import React from 'react'
import { graphql } from 'gatsby'
import { Card, Image, Select } from 'semantic-styled-ui'

const Properties = ({ data: { propertiesPage, allPropertyCollection } }) => {
  console.log('Properties -> allPropertyCollection', allPropertyCollection)
  const [bedsSelected, setBedsSelected] = React.useState([])
  const [bathsSelected, setBathsSelected] = React.useState([])
  const [zipcodesSelected, setZipcodesSelected] = React.useState([])

  // calculate set of all collections / sheets to display as filter options
  let beds = new Set()
  let baths = new Set()
  let zipcodes = new Set()
  allPropertyCollection.nodes.forEach((collection) => {
    collection.beds.forEach((bed) => beds.add(bed))
    collection.baths.forEach((bath) => baths.add(bath))
    collection.zipcodes.forEach((bath) => zipcodes.add(bath))
  })
  beds = [...beds].sort()
  baths = [...baths].sort()
  zipcodes = [...zipcodes].sort()

  const bedsOptions = beds.map((bed) => ({ key: bed, value: bed, text: bed }))
  const bathsOptions = baths.map((bed) => ({ key: bed, value: bed, text: bed }))
  const zipcodesOptions = zipcodes.map((bed) => ({ key: bed, value: bed, text: bed }))

  const allProperties = []
  // NOTE: properties will show if they match anything from the filters (union not
  // intersection), eg unit: 1 bed, 2 bath matches filter: 1, 2, 3 bed, __ baths
  allPropertyCollection.nodes.forEach((collection) => {
    collection.properties.forEach((property) => {
      if (
        // show properties that match anything from filter list, auto include if no filter set
        (!bedsSelected.length || property.beds.some((ct) => bedsSelected.includes(ct))) &&
        (!bathsSelected.length || property.baths.some((ct) => bathsSelected.includes(ct))) &&
        (!zipcodesSelected.length || zipcodesSelected.includes(property.zipcode))
      ) {
        allProperties.push(property)
      }
    })
  })

  return (
    <div>
      <Select
        multiple
        closeOnBlur
        closeOnEscape
        placeholder='Select # Beds'
        onChange={(_, { value }) => { setBedsSelected(value) }}
        value={bedsSelected}
        options={bedsOptions}
      />
      <Select
        multiple
        closeOnBlur
        closeOnEscape
        placeholder='Select # Baths'
        onChange={(_, { value }) => { setBathsSelected(value) }}
        value={bathsSelected}
        options={bathsOptions}
      />
      <Select
        multiple
        closeOnBlur
        closeOnEscape
        placeholder='Select Zipcodes'
        onChange={(_, { value }) => { setZipcodesSelected(value) }}
        value={zipcodesSelected}
        options={zipcodesOptions}
      />
      <Card.Group>
        {allProperties.map((property) => (
          <Card>
            <Image src='https://housingscout.com/wp-content/uploads/2020/04/1-768x461.jpg' wrapped ui={false} />
            <Card.Content>
              <Card.Header>{property.name}</Card.Header>
              <Card.Meta>
                <span className='date'>{property.addr}</span>
              </Card.Meta>
            </Card.Content>
            <Card.Content extra>
              {`from $${property.units[0].monthlyRentPerBed}/mo`}
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </div>
  )
}

export default Properties

export const imageQuery = graphql`
  query {
    propertiesPage: contentfulPageProperties(contentful_id: {eq: "5bdotCvkQYqNXaQnhTw6Ys"}) {
      id
      title
      listings {
        description
        file {
          url
        }
      }
    }
    # custom transformed from above result
    allPropertyCollection {
      nodes {
        baths
        beds
        zipcodes
        apartmentAmenities
        communityAmenities
        properties {
          name
          beds
          baths
          addr
          street
          city
          state
          zipcode
          apartmentAmenities
          communityAmenities
          units {
            unit
            beds
            baths
            monthlyRentPerBed
            apartmentAmenities
            communityAmenities
          }
        }
      }
    }
  }
`
