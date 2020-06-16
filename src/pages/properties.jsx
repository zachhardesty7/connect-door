import React from 'react'
import { graphql } from 'gatsby'
import GImage from 'gatsby-image'

import {
  Button,
  Card,
  ContactForm,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Label,
  List,
  Segment,
  Table,
} from 'semantic-styled-ui'

// https://github.com/express-labs/pure-react-carousel
// cons: infinite isn't a seamless loop
import {
  ButtonBack,
  ButtonNext,
  CarouselProvider,
  Slide,
  Slider,
} from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'

import styled from 'styled-components'

import { animated, useSpring } from 'react-spring'

import { noOverflow, noPadding } from '../components'

const S = {} // SC namespace

S.Body = styled(Segment)`
  h3 {
    font-size: 3em;
  }

  h4 {
    font-size: 2em !important;
  }

  padding-top: 6em;
  padding-bottom: 6em;
`

S.CarouselButton = styled.div`
  background-color: #e8e8e8df;
  position: absolute;
  top: 50%;
  ${({ $side }) => $side && $side}: 0;
  transform: translateY(-50%);
`

const Properties = ({ location, data: { propertiesPage, allPropertyCollection } }) => {
  let initZipcode = []
  let initRentMin = ''
  let initRentMax = ''

  if (location?.state?.zipcode) initZipcode = [location.state.zipcode]
  if (location?.state?.min) initRentMin = location.state.min
  if (location?.state?.max) initRentMax = location.state.max

  const [detailView, setDetailView] = React.useState()

  // filter form state values
  const [bedsSelected, setBedsSelected] = React.useState([])
  const [bathsSelected, setBathsSelected] = React.useState([])
  const [zipcodesSelected, setZipcodesSelected] = React.useState(initZipcode)
  const [rentMinSelected, setRentMinSelected] = React.useState(initRentMin)
  const [rentMaxSelected, setRentMaxSelected] = React.useState(initRentMax)

  // calculate set of all collections / sheets to display as filter options
  let beds = new Set()
  let baths = new Set()
  let zipcodes = new Set()
  allPropertyCollection.nodes.forEach((collection) => {
    collection.beds.forEach((bed) => beds.add(bed))
    collection.baths.forEach((bath) => baths.add(bath))
    collection.zipcodes.forEach((zip) => zipcodes.add(zip))
  })
  beds = [...beds].sort()
  baths = [...baths].sort()
  zipcodes = [...zipcodes].sort()

  // convert to SUI options display objects
  const bedsOptions = beds.map((bed) => ({ key: bed, value: bed, text: bed }))
  const bathsOptions = baths.map((bath) => ({ key: bath, value: bath, text: bath }))
  const zipcodesOptions = zipcodes.map((zip) => ({ key: zip, value: zip, text: zip }))

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

  const filterViewAnimation = useSpring({
    width: !detailView ? '100%' : '50%',
    config: { tension: 170, friction: 30 },
  })
  const detailViewAnimation = useSpring({
    width: detailView ? '50%' : '0%',

    // REVIEW: fix for snap disappearing...
    // https://codesandbox.io/s/react-spring-mount-via-resize-rc3v8
    height: detailView ? 'auto' : 0,
    config: { tension: 170, friction: 30 },
  })

  // hide detail panel view when active property is filtered out
  if (detailView && allProperties.every(({ name }) => name !== detailView.name)) {
    setDetailView()
  }

  return (
    <div>
      {/* FIXME: get rid of bottom padding */}
      <Segment as='main' basic vertical>
        <Grid columns='equal' relaxed='very' centered padded>
          <Grid.Column as={animated.div} style={filterViewAnimation}>
            <Segment vertical>
              <Form>
                <Form.Group as={Grid} centered>
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
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label>Price Range</label>
                  <Form.Field>
                    <Input
                      label={{ content: '$' }}
                      step={100}
                      min={0}
                      type='number'
                      labelPosition='left'
                      placeholder='min'
                      name='min'
                      value={rentMinSelected}
                      onChange={({ target }) => { setRentMinSelected(target.value) }}
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
                      name='max'
                      value={rentMaxSelected}
                      onChange={({ target }) => { setRentMaxSelected(target.value) }}
                    />
                  </Form.Field>
                </Form.Group>
              </Form>
            </Segment>

            <S.Body vertical>
              <Card.Group centered>
                {allProperties.map((property) => (
                  <Card
                    link
                    as='div'
                    key={property.name}
                    onClick={() => { setDetailView(property) }}
                  >
                    {property?.imageSet?.images[0] && (
                      <Image ui={false} wrapped>
                        {property?.imageSet?.images[0] && GImage && (
                          <GImage
                            fluid={property?.imageSet?.images[0].fluid}
                            // fixed={property?.imageSet?.images[0].fixed}
                            alt={`${property.name} display image`}
                          />
                        )}
                      </Image>
                    )}
                    <Card.Content>
                      <Card.Header>{property.name}</Card.Header>
                      <Card.Meta>
                        <a
                          href={`https://www.google.com/maps/place/${property.addr.replace(/\s+/g, '+')}`}
                          className='date'
                          target='_blank'
                          rel='noreferrer'
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
                {!allProperties.length && (
                  <div>No properties matching filter...</div>
                )}
              </Card.Group>
            </S.Body>
          </Grid.Column>

          <Grid.Column
            as={animated.div}
            style={detailViewAnimation}
            className={noPadding('all') + noOverflow('y')}
          >
            <Segment secondary className={noPadding('all')}>
              <Label
                size='large'
                icon={{ link: true, name: 'close', onClick: () => { setDetailView() } }}
                corner='left'
              />

              {detailView?.imageSet.images.length && (
                <CarouselProvider
                  touchEnabled={detailView?.imageSet.images.length > 1}
                  dragEnabled={detailView?.imageSet.images.length > 1}
                  naturalSlideWidth={10}
                  naturalSlideHeight={6}
                  totalSlides={detailView?.imageSet.images.length}
                  visibleSlides={detailView?.imageSet.images.length > 1 ? 1.2 : 1}
                >
                  <div css='position: relative;'>
                    <Slider>
                      {detailView?.imageSet.images.map((image, i) => image && (
                        <Slide
                          index={i}
                          css={`
                          &:not(:last-child) {
                            border-right: solid #F3F4F5 1em;
                          }
                        `}
                        >
                          <GImage
                            fluid={image?.fluid}
                            style={{ position: 'unset' }}
                            alt={image?.title}
                          />
                        </Slide>
                      ))}
                    </Slider>

                    {detailView?.imageSet.images.length > 1 && (
                      <>
                        <S.CarouselButton $side='left' icon compact as={Button} forwardedAs={ButtonBack}>
                          <Icon fitted size='big' link name='chevron left' />
                        </S.CarouselButton>
                        <S.CarouselButton $side='right' icon compact as={Button} forwardedAs={ButtonNext}>
                          <Icon fitted size='big' link name='chevron right' />
                        </S.CarouselButton>
                      </>
                    )}
                  </div>
                </CarouselProvider>
              )}

              <Segment basic padded='very'>
                <Header as='h2'>
                  {detailView?.name}
                  <Header.Subheader>
                    <a
                      href={`https://www.google.com/maps/place/${detailView?.addr.replace(/\s+/g, '+')}`}
                      target='_blank'
                      rel='noreferrer'
                      className='date'
                    >
                      {detailView?.addr}
                    </a>
                  </Header.Subheader>
                </Header>

                <Segment vertical basic padded>
                  <Header>Available Units</Header>
                  <Table celled>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Unit</Table.HeaderCell>
                        <Table.HeaderCell>Beds</Table.HeaderCell>
                        <Table.HeaderCell>Baths</Table.HeaderCell>
                        <Table.HeaderCell>Monthly Rent (Per Bed)</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {detailView?.units.map((unit) => (
                        <Table.Row key={unit.unit}>
                          <Table.Cell>{unit.unit}</Table.Cell>
                          <Table.Cell>{unit.beds}</Table.Cell>
                          <Table.Cell>{unit.baths}</Table.Cell>
                          <Table.Cell>
                            $
                            {unit.monthlyRentPerBed}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Segment>

                <Segment vertical basic padded>
                  <Grid columns='equal'>
                    <Grid.Column>
                      <Header>Apartment Amenities</Header>
                      <List bulleted>
                        {detailView?.apartmentAmenities.map((amenity) => (
                          <List.Item key={amenity}>{amenity}</List.Item>
                        ))}
                      </List>
                    </Grid.Column>
                    <Grid.Column>
                      <Header>Community Amenities</Header>
                      <List bulleted>
                        {detailView?.communityAmenities.map((amenity) => (
                          <List.Item key={amenity}>{amenity}</List.Item>
                        ))}
                      </List>
                    </Grid.Column>
                  </Grid>
                </Segment>

                <Segment vertical basic padded>
                  <Header>{propertiesPage.contactForm.title}</Header>
                  <ContactForm
                    name={propertiesPage.contactForm.form?.name}
                    fields={propertiesPage.contactForm.form?.contentfulfields}
                    textArea={propertiesPage.contactForm.form?.textarea}
                    button={propertiesPage.contactForm.form?.button}
                  >
                    <input type='hidden' name='PROPERTY' value={detailView?.name} />
                  </ContactForm>
                </Segment>
              </Segment>
            </Segment>
          </Grid.Column>
        </Grid>
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
      contactForm {
        title
        form {
          name
          button
          contentfulfields
          textarea
        }
      }
      listings {
        description
        file {
          url
        }
      }
    }
    # custom transformed data from above listings > file > url
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
          imageSet {
            images {
              fixed(width: 400) {
                ...GatsbyContentfulFixed
              }
              fluid(maxWidth: 400) {
                ...GatsbyContentfulFluid
              }
            }
          }
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
