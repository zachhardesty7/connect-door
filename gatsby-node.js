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

const setAsSortedArr = (set) => [...set].sort()

// fetch excel file from url and return processed js object
const evaluateSheetURL = async(url) => {
  const raw = await fetch(`http://${url.slice(2)}`)
  if (raw.statusText !== 'OK') throw new Error('fetch failed')

  const buffer = await raw.arrayBuffer()
  const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' })

  // make changes to each collection
  const bedsAll = new Set()
  const bathsAll = new Set()
  const zipcodesAll = new Set()
  const communityAmenitiesAll = new Set()
  const apartmentAmenitiesAll = new Set()
  const rentsAll = new Set()

  // process each worksheet, aka set of units at a property
  const sheets = workbook.SheetNames.map((sheetName) => {
    const worksheet = workbook.Sheets[sheetName]

    // simple attributes
    const name = worksheet.B3 ? worksheet.B3.v : undefined
    const street = worksheet.B4 ? worksheet.B4.v : undefined
    const city = worksheet.B5 ? worksheet.B5.v : undefined
    const state = worksheet.B6 ? worksheet.B6.v : undefined
    const zipcode = worksheet.B7 ? `${worksheet.B7.v}` : undefined // enforce string type

    // complex attributes
    const imageSet = worksheet.B9 ? worksheet.B9.v : undefined

    zipcodesAll.add(zipcode)

    // make changes to each property
    // calc union of all vals of each unit for entire property
    const bedsProperty = new Set()
    const bathsProperty = new Set()
    const communityAmenitiesProperty = new Set()
    const apartmentAmenitiesProperty = new Set()
    const rentsProperty = new Set()

    // custom range eliminates blank rows & columns before data starts
    const items = XLSX.utils.sheet_to_json(worksheet, { range: 'D2:Z9999' })

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
      addr: `${street}, ${city}, ${state} ${zipcode}`,
      street,
      city,
      state,
      zipcode,
      imageSet,
      beds: setAsSortedArr(bedsProperty),
      baths: setAsSortedArr(bathsProperty),
      rents: setAsSortedArr(rentsProperty),
      communityAmenities: setAsSortedArr(communityAmenitiesProperty),
      apartmentAmenities: setAsSortedArr(apartmentAmenitiesProperty),
      units,
    }
  })

  return {
    properties: Object.values(sheets),
    attributes: {
      beds: setAsSortedArr(bedsAll),
      baths: setAsSortedArr(bathsAll),
      zipcodes: setAsSortedArr(zipcodesAll),
      rents: setAsSortedArr(rentsAll),
      communityAmenities: setAsSortedArr(communityAmenitiesAll),
      apartmentAmenities: setAsSortedArr(apartmentAmenitiesAll),
    },
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
  // TODO: retrieve all assets from node.internalId === 'page-properties'
  // and combine into a single query-able node

  // short circuit when not dealing with excel file
  if (
    node.internal.type !== 'ContentfulAsset' ||
    !node.file ||
    node.file.contentType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return
  }

  const collection = await evaluateSheetURL(node.file.url)

  const excelNode = {
    ...collection.attributes,
    id: createNodeId(`${node.id}-excel`),
    children: [],
    parent: node.id,
    internal: {
      contentDigest: createContentDigest(collection),
      type: 'PropertyCollection',
    },
  }

  createNode(excelNode)
  createParentChildLink({ parent: node, child: excelNode })

  const properties = collection.properties.map((property) => ({
    ...property,
    id: createNodeId(`${node.id}-property-${toCamelCase(property.addr)}`),
    children: [],
    internal: {
      contentDigest: createContentDigest(property),
      type: 'Property',
    },
  }))

  properties.forEach((property) => { createNode(property) })

  // create PropertyCollection.properties for convenience
  // NOTE: using this field does not allow limiting, sorting, filtering
  // excelNode.properties___NODE = properties.map(({ id }) => id)
  excelNode.properties = properties.map(({ id }) => id)
}

// transform the "Image Set Name" defined in the spreadsheet
// into a node of contentfulAssets with a matching title
// @see https://www.gatsbyjs.org/docs/schema-customization/#foreign-key-fields
exports.createSchemaCustomization = ({ actions: { createTypes } }) => {
  const typeDefs = `
    type Property implements Node {
      imageSet: ContentfulPropertyImagesSet @link(by: "title")
    }
    type PropertyCollection implements Node {
      properties: [Property] @link
    }
  `

  // https://www.gatsbyjs.org/docs/actions/#createTypes
  createTypes(typeDefs)
}
