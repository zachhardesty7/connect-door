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

  // process each worksheet, aka set of units at a property
  return wb.SheetNames.map((sheetName) => {
    const ws = wb.Sheets[sheetName]
    const name = ws.C2 ? ws.C2.v : undefined
    const addr = ws.C3 ? ws.C3.v : undefined

    const beds = new Set()
    const baths = new Set()

    // custom range eliminates blank rows & columns before data starts
    const items = XLSX.utils.sheet_to_json(ws, { range: 'C4:Z9999' })

    const units = items.filter((unit) => unit && unit.Unit).map((unit) => {
      const parsedUnit = {}
      const communityAmenities = []
      const apartmentAmenities = []

      // convert keys to camelCase & accumulate amenities for easier and more consistent use
      Object.entries(unit).forEach(([key, val]) => {
        if (!key) return
        parsedUnit[toCamelCase(key)] = val
        if (key.toLowerCase().includes('community')) communityAmenities.push(val)
        if (key.toLowerCase().includes('apartment')) apartmentAmenities.push(val)
      })

      parsedUnit.communityAmenities = [...new Set(communityAmenities)]
      parsedUnit.apartmentAmenities = [...new Set(apartmentAmenities)]

      // TODO: edge case testing
      parsedUnit.beds !== null && beds.add(parsedUnit.beds)
      parsedUnit.baths !== null && baths.add(parsedUnit.baths)

      return parsedUnit
    })

    return {
      name,
      addr,
      beds: [...beds].sort(),
      baths: [...baths].sort(),
      units,
    }
  })
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

  const properties = await evaluateSheetURL(node.file.url)

  const xlNode = {
    properties,
    id: createNodeId(`${node.id} >>> SHEET`),
    children: [],
    parent: node.id,
    internal: {
      contentDigest: createContentDigest(properties),
      type: 'PropertyJson',
    },
  }

  createNode(xlNode)
  createParentChildLink({ parent: node, child: xlNode })
}
