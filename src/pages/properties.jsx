import React from 'react'
import { graphql } from 'gatsby'
import { Card, Container, Form, Grid, Image, Input, Segment } from 'semantic-styled-ui'
import styled from 'styled-components'

const BaseSegment = styled(Segment)`
  h3 {
    font-size: 3em;
  }

  h4 {
    font-size: 2em !important;
  }

  padding-top: 6em;
  padding-bottom: 6em;
`

const Properties = ({ data: { allPropertyCollection } }) => {
  console.log('Properties -> allPropertyCollection', allPropertyCollection)
  const [bedsSelected, setBedsSelected] = React.useState([])
  const [bathsSelected, setBathsSelected] = React.useState([])
  const [zipcodesSelected, setZipcodesSelected] = React.useState([])
  const [rentMinSelected, setRentMinSelected] = React.useState()
  const [rentMaxSelected, setRentMaxSelected] = React.useState()

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

  // convert to SUI options display objects
  const bedsOptions = beds.map((bed) => ({ key: bed, value: bed, text: bed }))
  const bathsOptions = baths.map((bed) => ({ key: bed, value: bed, text: bed }))
  const zipcodesOptions = zipcodes.map((bed) => ({ key: bed, value: bed, text: bed }))

  const allProperties = []
  // NOTE: properties will show if they match anything from the filters (union not
  // intersection), eg unit: {1 bed, 2 bath} matches filter: {1 or 2 or 3 bed, __ baths}
  allPropertyCollection.nodes.forEach((collection) => {
    collection.properties.forEach((property) => {
      if (
        // show properties that match anything from filter list, auto include if no filter set
        (!bedsSelected.length || property.beds.some((ct) => bedsSelected.includes(ct))) &&
        (!bathsSelected.length || property.baths.some((ct) => bathsSelected.includes(ct))) &&
        (!zipcodesSelected.length || zipcodesSelected.includes(property.zipcode)) &&

        // only 1 unit per property needs to match filter
        // cheapest unit < maxRentSelection
        (!rentMaxSelected || property.rents[0] < rentMaxSelected) &&
        // most expensive unit > minRentSelection
        (!rentMinSelected || property.rents[property.rents.length - 1] > rentMinSelected)
      ) {
        allProperties.push(property)
      }
    })
  })

  return (
    <div>
      <Segment as='main' vertical basic>
        <BaseSegment>
          <Container text>
            <Form>
              <Form.Group widths='equal'>
                <Form.Select
                  fluid
                  multiple
                  closeOnBlur
                  closeOnEscape
                  id='select-beds-filter'
                  label='Beds'
                  placeholder='Select # Beds'
                  onChange={(_, { value }) => { setBedsSelected(value) }}
                  value={bedsSelected}
                  options={bedsOptions}
                />
                <Form.Select
                  fluid
                  multiple
                  closeOnBlur
                  closeOnEscape
                  id='select-baths-filter'
                  label='Baths'
                  placeholder='Select # Baths'
                  onChange={(_, { value }) => { setBathsSelected(value) }}
                  value={bathsSelected}
                  options={bathsOptions}
                />
                <Form.Select
                  fluid
                  multiple
                  closeOnBlur
                  closeOnEscape
                  id='select-zipcodes-filter'
                  label='Zipcodes'
                  placeholder='Select Zipcodes'
                  onChange={(_, { value }) => { setZipcodesSelected(value) }}
                  value={zipcodesSelected}
                  options={zipcodesOptions}
                />
              </Form.Group>
              <Form.Group as={Grid} centered inline id='price-range-filter'>
                <label>Price Range</label>
                <Form.Field>
                  <Input
                    label={{ content: '$' }}
                    step={100}
                    min={0}
                    type='number'
                    labelPosition='left'
                    placeholder='min'
                    value={rentMinSelected}
                    onChange={(_, { value }) => { setRentMinSelected(parseInt(value, 10)) }}
                  />
                </Form.Field>
                <Form.Field>
                  <Input
                    label={{ content: '$' }}
                    step={100}
                    min={0}
                    type='number'
                    labelPosition='left'
                    placeholder='max'
                    value={rentMaxSelected}
                    onChange={(_, { value }) => { setRentMaxSelected(parseInt(value, 10)) }}
                  />
                </Form.Field>
              </Form.Group>
            </Form>
          </Container>
        </BaseSegment>
        <BaseSegment>
          <Container>
            <Card.Group centered>
              {allProperties.map((property) => console.log('Properties -> property', property) || (
                <Card>
                  <Image src='https://housingscout.com/wp-content/uploads/2020/04/1-768x461.jpg' wrapped ui={false} />
                  <Card.Content>
                    <Card.Header>{property.name}</Card.Header>
                    <Card.Meta>
                      <a
                        href={`https://www.google.com/maps/place/${property.addr.replace(/\s+/g, '+')}`}
                        className='date'
                      >
                        {property.addr}
                      </a>
                    </Card.Meta>
                  </Card.Content>
                  <Card.Content extra>
                    {/* TODO: show cheapest MATCHING FILTER */}
                    {`from $${property.rents[0]}/mo`}
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          </Container>
        </BaseSegment>

      </Segment>
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
        rents
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
          rents
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
