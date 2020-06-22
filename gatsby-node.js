const XLSX = require('xlsx')
const fetch = require('node-fetch')

// quick link
// http://localhost:8000/___graphql

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

  // make changes to each collection
  const bedsAll = new Set()
  const bathsAll = new Set()
  const zipcodesAll = new Set()
  const communityAmenitiesAll = new Set()
  const apartmentAmenitiesAll = new Set()
  const rentsAll = new Set()

  // process each worksheet, aka set of units at a property
  const sheets = wb.SheetNames.map((sheetName) => {
    const ws = wb.Sheets[sheetName]

    // simple attributes
    const name = ws.B3 ? ws.B3.v : undefined
    const street = ws.B4 ? ws.B4.v : undefined
    const city = ws.B5 ? ws.B5.v : undefined
    const state = ws.B6 ? ws.B6.v : undefined
    const zipcode = ws.B7 ? `${ws.B7.v}` : undefined // enforce string type

    // complex attributes
    const imageSet = ws.B9 ? ws.B9.v : undefined

    const addr = `${street}, ${city}, ${state} ${zipcode}`

    zipcodesAll.add(zipcode)

    // make changes to each property
    // calc union of all vals of each unit for entire property
    const bedsProperty = new Set()
    const bathsProperty = new Set()
    const communityAmenitiesProperty = new Set()
    const apartmentAmenitiesProperty = new Set()
    const rentsProperty = new Set()

    // custom range eliminates blank rows & columns before data starts
    const items = XLSX.utils.sheet_to_json(ws, { range: 'D2:Z9999' })

    // make changes to each unit
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
      if (parsedUnit.monthlyRentPerBed !== null) {
        rentsAll.add(parsedUnit.monthlyRentPerBed)
        rentsProperty.add(parsedUnit.monthlyRentPerBed)
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
      imageSet,
      beds: [...bedsProperty].sort(),
      baths: [...bathsProperty].sort(),
      rents: [...rentsProperty].sort(),
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
    rents: [...rentsAll].sort(),
    communityAmenities: [...communityAmenitiesAll].sort(),
    apartmentAmenities: [...apartmentAmenitiesAll].sort(),
  }
}

exports.onCreateWebpackConfig = ({
  actions: { setWebpackConfig },
}) => {
  // changes requested by `sheetJS` aka `xljs`
  setWebpackConfig({
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
  actions: {
    createNode,
    createParentChildLink,
  },
  createNodeId,
  createContentDigest,
}) => {
  // only log for nodes of excel sheets
  if (node.internal.type !== 'ContentfulAsset' || !node.file || node.file.contentType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return
  }

  const collection = await evaluateSheetURL(node.file.url)

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

exports.setFieldsOnGraphQLNodeType = ({ type }) => {
  if (type.name === 'PropertyCollection') {
    return {
      properties: {
        type: ['Property'],
        args: {
          filter: 'String',
          limit: 'Int',
        },
        resolve(source, args, context, info) {
          // return info.originalResolver(source, args, context, info)
          return context.nodeModel.runQuery({
            // only supports filter and sort
            query: {
              // filter: {
              //   name: { eq: 'Villas on Nueces' },
              // },
              // limit: args.limit,
            },
            type: 'Property',
            firstOnly: false,
          })
        },
      },
    }
  }

  // by default return empty object
  return {}
}

// transform the "Image Set Name" defined in the spreadsheet
// into a node of contentfulAssets with a matching title
// @see https://www.gatsbyjs.org/docs/schema-customization/#foreign-key-fields
exports.createSchemaCustomization = ({ actions: { createTypes } }) => {
  const typeDefs = `
    type PropertyCollectionProperties implements Node {
      imageSet: ContentfulPropertyImagesSet @link(by: "title")
    }
  `

  // https://www.gatsbyjs.org/docs/actions/#createTypes
  createTypes(typeDefs)
}
