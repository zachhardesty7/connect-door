const XLSX = require('xlsx')
const fetch = require('node-fetch')

// most of the reference materials are here
// https://www.gatsbyjs.org/docs/creating-a-transformer-plugin/

// from 30s code snippets
const toCamelCase = (str) => {
  const s =
    str &&
    str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g)
      .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
      .join('')
  return s.slice(0, 1).toLowerCase() + s.slice(1)
}

// fetch excel file from url and return processed js object
const evaluateSheetURL = async(url) => {
  const raw = await fetch(`http://${url.slice(2)}`)
  if (raw.statusText !== 'OK') throw new Error('fetch failed')

  const buffer = await raw.arrayBuffer()
  const int8Arr = new Uint8Array(buffer)
  const wb = XLSX.read(int8Arr, { type: 'array' })

  const bedsAll = new Set()
  const bathsAll = new Set()
  const zipcodesAll = new Set()
  const communityAmenitiesAll = new Set()
  const apartmentAmenitiesAll = new Set()

  // process each worksheet, aka set of units at a property
  const sheets = wb.SheetNames.map((sheetName) => {
    const ws = wb.Sheets[sheetName]

    const name = ws.C2 ? ws.C2.v : undefined
    const street = ws.C3 ? ws.C3.v : undefined
    const city = ws.D3 ? ws.D3.v : undefined
    const state = ws.E3 ? ws.E3.v : undefined
    const zipcode = ws.F3 ? ws.F3.v : undefined

    const addr = `${street}, ${city}, ${state} ${zipcode}`

    zipcodesAll.add(zipcode)

    // calc union of all vals of each unit for entire property
    const bedsProperty = new Set()
    const bathsProperty = new Set()
    const communityAmenitiesProperty = new Set()
    const apartmentAmenitiesProperty = new Set()

    // custom range eliminates blank rows & columns before data starts
    const items = XLSX.utils.sheet_to_json(ws, { range: 'C5:Z9999' })

    const units = items.filter((unit) => unit && unit.Unit).map((unit) => {
      const parsedUnit = {}
      const communityAmenitiesUnit = new Set()
      const apartmentAmenitiesUnit = new Set()

      // convert keys to camelCase & accumulate amenities for easier and more consistent use
      Object.entries(unit).forEach(([key, val]) => {
        if (!key) return
        parsedUnit[toCamelCase(key)] = val

        if (key.toLowerCase().includes('community')) {
          communityAmenitiesAll.add(val)
          communityAmenitiesProperty.add(val)
          communityAmenitiesUnit.add(val)
        }

        if (key.toLowerCase().includes('apartment')) {
          apartmentAmenitiesAll.add(val)
          apartmentAmenitiesProperty.add(val)
          apartmentAmenitiesUnit.add(val)
        }
      })

      parsedUnit.communityAmenities = [...communityAmenitiesUnit]
      parsedUnit.apartmentAmenities = [...apartmentAmenitiesUnit]

      // TODO: edge case testing
      if (parsedUnit.beds !== null) {
        bedsAll.add(parsedUnit.beds)
        bedsProperty.add(parsedUnit.beds)
      }
      if (parsedUnit.baths !== null) {
        bathsAll.add(parsedUnit.baths)
        bathsProperty.add(parsedUnit.baths)
      }

      return parsedUnit
    })

    return {
      name,
      addr,
      street,
      city,
      state,
      zipcode,
      beds: [...bedsProperty].sort(),
      baths: [...bathsProperty].sort(),
      communityAmenities: [...communityAmenitiesProperty].sort(),
      apartmentAmenities: [...apartmentAmenitiesProperty].sort(),
      units,
    }
  })

  return {
    properties: Object.values(sheets),
    beds: [...bedsAll].sort(),
    baths: [...bathsAll].sort(),
    zipcodes: [...zipcodesAll].sort(),
    communityAmenities: [...communityAmenitiesAll].sort(),
    apartmentAmenities: [...apartmentAmenitiesAll].sort(),
  }
}

exports.onCreateWebpackConfig = ({
  actions,
}) => {
  // changes requested by `sheetJS` aka `xljs`
  actions.setWebpackConfig({
    node: {
      process: false,
      Buffer: false,
    },
    resolve: {
      alias: { './dist/cpexcel.js': '' },
    },
  })
}

// might be possible to use `createRemoteFileNode` from `gatsby-source-filesystem`
exports.onCreateNode = async({
  node,
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode, createParentChildLink } = actions

  // only log for nodes of excel sheets
  if (node.internal.type !== 'ContentfulAsset' || !node.file || node.file.contentType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return
  }

  const collection = await evaluateSheetURL(node.file.url)
  console.log('collection', collection)

  const xlNode = {
    ...collection,
    id: createNodeId(`${node.id}>>>SHEET`),
    children: [],
    parent: node.id,
    internal: {
      contentDigest: createContentDigest(collection),
      type: 'PropertyCollection',
    },
  }

  createNode(xlNode)
  createParentChildLink({ parent: node, child: xlNode })
}
