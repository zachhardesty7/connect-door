import React from 'react'
import { graphql } from 'gatsby'
import { Card, Image, Select } from 'semantic-styled-ui'

const Properties = ({ data: { propertiesPage, propertiesJson } }) => {
  const [bedsSelected, setBedsSelected] = React.useState([])
  const [bathsSelected, setBathsSelected] = React.useState([])

  // calculate bed set of all properties to display as filter options
  let beds = new Set()
  let baths = new Set()
  propertiesJson.nodes.forEach((propertyJson) => {
    propertyJson.properties.forEach((property) => {
      property.beds.forEach((bed) => beds.add(bed))
      property.baths.forEach((bath) => baths.add(bath))
    })
  })
  beds = [...beds].sort()
  baths = [...baths].sort()

  const bedsOptions = beds.map((bed) => ({ key: bed, value: bed, text: bed }))
  const bathsOptions = baths.map((bed) => ({ key: bed, value: bed, text: bed }))

  const allProperties = []
  // NOTE: properties will show if they match anything from the filters (union not
  // intersection), eg unit: 1 bed, 2 bath matches filter: 1, 2, 3 bed, __ baths
  propertiesJson.nodes.forEach((propertyJson) => {
    propertyJson.properties.forEach((property) => {
      if (
        // show properties that match anything from filter list, auto include if no filter set
        (!bedsSelected.length || property.beds.some((ct) => bedsSelected.includes(ct))) &&
        (!bathsSelected.length || property.baths.some((ct) => bathsSelected.includes(ct)))
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
    propertiesJson: allPropertyJson {
      nodes {
        properties {
          name
          addr
          beds
          baths
          units {
            apartmentAmenities
            communityAmenities
            unit
            beds
            baths
            monthlyRentPerBed
          }
        }
      }
    }
  }
`
