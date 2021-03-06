import React from 'react'
import { Link, graphql, navigate } from 'gatsby'

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
  Modal,
  Navigation,
  Pagination,
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

import styled, { css } from 'styled-components'

import { animated, useSpring } from 'react-spring'

import cx from 'classnames'
import { noOverflow, noPadding } from '../components'

import { S } from '../components/S'

const ITEMS_PER_PAGE = 12

const NavLogo = styled(GImage).attrs()`
  margin-bottom: -3px;
`

S.Body = styled(Segment)`
  h3 {
    font-size: 3em;
  }

  h4 {
    font-size: 2em !important;
  }

  padding-top: 5em;
  padding-bottom: 5em;
`

S.CarouselButton = styled.div`
  background-color: #e8e8e8df;
  position: absolute;
  top: 50%;
  ${({ $side }) => $side && $side}: 0;
  transform: translateY(-50%);
`

S.Pagination = styled(Pagination)`
  a {
    justify-content: center;
  }
  display: flex;
  width: fit-content;
  margin: auto;
`

S.Slide = styled(Slide)`
  &:not(:last-child) {
    border-right: solid #F3F4F5 1em;
  }
`

S.RelativeDiv = styled.div`
  position: relative;
`

const NO_AMENITIES_DATA = '(information unavailable at this time)'
/**
 * @param {import("gatsby").PageProps<{sectionNav, propertiesPage, allProperty, allPropertyCollection}>} props - main input
 * @returns {JSX.Element} page
 */
const Properties = ({
  location,
  data: { sectionNav, propertiesPage, allProperty, allPropertyCollection },
}) => {
  const [propertyCollectionInfo] = allPropertyCollection.nodes

  // calculate set of all sheets to display as filter options
  let beds = new Set()
  let baths = new Set()
  let zipcodes = new Set()
  // TODO: support multiple spreadsheets, this code does nothing productive for now
  propertyCollectionInfo.beds.forEach((bed) => beds.add(bed))
  propertyCollectionInfo.baths.forEach((bath) => baths.add(bath))
  propertyCollectionInfo.zipcodes.forEach((zip) => zipcodes.add(zip))
  beds = [...beds].sort()
  baths = [...baths].sort()
  zipcodes = [...zipcodes].sort()

  // convert to SUI options display objects
  const bedsOptions = beds.map((bed) => ({ key: bed, value: bed, text: bed }))
  const bathsOptions = baths.map((bath) => ({ key: bath, value: bath, text: bath }))
  const zipcodesOptions = zipcodes.map((zip) => ({ key: zip, value: zip, text: zip }))

  const initZipcode = zipcodes.includes(location?.state?.zipcode)
    ? [location.state.zipcode]
    : []
  const initRentMin = location?.state?.min ?? ''
  const initRentMax = location?.state?.max ?? ''

  const [zipcodeErr, setZipcodeErr] = React.useState(false)
  React.useEffect(() => {
    if (location?.state?.zipcode && !zipcodes.includes(location.state.zipcode)) {
      setZipcodeErr(true)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [detailsOpen, setDetailsOpen] = React.useState()
  const [tourModalOpen, setTourModalOpen] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)

  // filter form state values
  const [bedsSelected, setBedsSelected] = React.useState([])
  const [bathsSelected, setBathsSelected] = React.useState([])
  const [zipcodesSelected, setZipcodesSelected] = React.useState(initZipcode)
  const [rentMinSelected, setRentMinSelected] = React.useState(initRentMin)
  const [rentMaxSelected, setRentMaxSelected] = React.useState(initRentMax)

  const selectedProperties = []
  // NOTE: properties will show if they match anything from the filters (union not
  // intersection), eg unit: {1 bed, 2 bath} matches filter: {1 or 2 or 3 bed, __ baths}
  allProperty.nodes.forEach((property) => {
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
      selectedProperties.push(property)
    }
  })

  const filterViewAnimation = useSpring({
    width: !detailsOpen ? '100%' : '50%',
    config: { tension: 170, friction: 30 },
  })
  const detailViewAnimation = useSpring({
    width: detailsOpen ? '50%' : '0%',

    // REVIEW: fix for snap disappearing...
    // https://codesandbox.io/s/react-spring-mount-via-resize-rc3v8
    height: detailsOpen ? 'auto' : 0,
    config: { tension: 170, friction: 30 },
  })

  // hide detail panel view when active property is filtered out
  if (detailsOpen && selectedProperties.every(({ name }) => name !== detailsOpen.name)) {
    setDetailsOpen()
  }

  return (
    <div>
      <Navigation size={sectionNav.size} text>
        <Navigation.Logo as={Link} link='/' activeClassName='active'>
          <NavLogo fixed={sectionNav.logo?.fixed} alt='logo' />
        </Navigation.Logo>
        {sectionNav.sections.map((page) => (
          // last item is a new page link
          page === 'Properties' ? (
            <Navigation.Item
              key={page}
              as={Link}
              link={`/${page.toLowerCase()}`}
              activeClassName='active'
            >
              {page}
            </Navigation.Item>
          ) : (
            <Navigation.Item
              key={page}
              onClick={() => location.pathname === '/properties' && navigate(`/#${page}`)}
              link={location.pathname !== '/properties' ? `#${page}` : ''}
            >
              {page}
            </Navigation.Item>
          )
        ))}
      </Navigation>
      {/* FIXME: get rid of bottom padding */}
      <Segment as='main' basic vertical>
        <Grid columns='equal' relaxed='very' centered padded stackable>
          <Grid.Column as={animated.div} style={filterViewAnimation}>
            <Segment vertical>
              <Form>
                <Form.Group
                  inline
                  css={css`
                    row-gap: 1em;
                    flex-wrap: wrap;
                    justify-content: center;
                  `}
                >
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
                    error={zipcodeErr}
                    multiple
                    closeOnBlur
                    closeOnEscape
                    id='select-zipcodes-filter'
                    label='Zip Code'
                    placeholder='Select Zip Code'
                    onChange={(_, { value }) => {
                      setZipcodesSelected(value)
                      setZipcodeErr(false)
                    }}
                    value={zipcodesSelected}
                    options={zipcodesOptions}
                  />
                </Form.Group>
                <Form.Group
                  inline
                  id='price-range-filter'
                  widths='equal'
                  css={css`
                    justify-content: center;
                    align-items: flex-end;
                    & > * {
                      max-width: 15em;
                    }
                  `}
                >
                  <Form.Field>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label>Price Range</label>
                    <Input
                      fluid
                      label={{ content: '$' }}
                      step={100}
                      min={0}
                      type='number'
                      labelPosition='left'
                      placeholder='Min'
                      name='min'
                      value={rentMinSelected}
                      onChange={({ target }) => { setRentMinSelected(target.value) }}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Input
                      fluid
                      label={{ content: '$' }}
                      step={100}
                      min={0}
                      type='number'
                      labelPosition='left'
                      placeholder='Max'
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
                {selectedProperties
                  .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                  .map((property) => (
                    <Card
                      link
                      as='div'
                      key={property.name}
                      onClick={() => { setDetailsOpen(); setDetailsOpen(property) }}
                    >
                      {property.imageSet?.images[0] && (
                        <Image ui={false} wrapped>
                          <GImage
                            fluid={property.imageSet.images[0].fluid}
                            // fixed={property.imageSet.images[0].fixed}
                            alt={`${property.name} display image`}
                          />
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
                {!selectedProperties.length && (
                  <div>No properties found matching your search filters...</div>
                )}
              </Card.Group>
            </S.Body>

            <Segment vertical>
              <S.Pagination
                boundaryRange={0}
                defaultActivePage={1}
                onPageChange={(_, { activePage }) => {
                  setCurrentPage(activePage)
                }}
                firstItem={selectedProperties.length / ITEMS_PER_PAGE <= 5 ? null : undefined}
                lastItem={selectedProperties.length / ITEMS_PER_PAGE <= 5 ? null : undefined}
                siblingRange={2}
                totalPages={Math.ceil(selectedProperties.length / ITEMS_PER_PAGE)}
              />
            </Segment>
          </Grid.Column>

          <Grid.Column
            as={animated.div}
            style={detailViewAnimation}
            className={cx([noPadding('all'), noOverflow('y')])}
          >
            {detailsOpen && (
              <Segment secondary className={cx(noPadding('all'))}>
                <Label
                  size='large'
                  corner='left'
                  icon={{
                    link: true,
                    name: 'close',
                    onClick: () => { setDetailsOpen() },
                  }}
                />

                {detailsOpen.imageSet?.images?.length > 0 && (
                  <CarouselProvider
                    touchEnabled={detailsOpen.imageSet.images.length > 1}
                    dragEnabled={detailsOpen.imageSet.images.length > 1}
                    naturalSlideWidth={10}
                    naturalSlideHeight={6}
                    totalSlides={detailsOpen.imageSet.images.length}
                    visibleSlides={detailsOpen.imageSet.images.length > 1 ? 1.2 : 1}
                  >
                    <S.RelativeDiv>
                      <Slider>
                        {detailsOpen.imageSet.images.map((image, i) => image && (
                          <S.Slide
                            index={i}
                            key={image.title}
                          >
                            <GImage
                              fluid={image.fluid}
                              style={{ position: 'unset' }}
                              alt={image.title}
                            />
                          </S.Slide>
                        ))}
                      </Slider>

                      {detailsOpen.imageSet.images.length > 1 && (
                        <>
                          <S.CarouselButton $side='left' icon compact as={Button} forwardedAs={ButtonBack}>
                            <Icon fitted size='big' link name='chevron left' />
                          </S.CarouselButton>
                          <S.CarouselButton $side='right' icon compact as={Button} forwardedAs={ButtonNext}>
                            <Icon fitted size='big' link name='chevron right' />
                          </S.CarouselButton>
                        </>
                      )}
                    </S.RelativeDiv>
                  </CarouselProvider>
                )}
                <Segment basic padded='very'>
                  <Header as='h2'>
                    <S.FlexSplit>
                      <div>
                        {detailsOpen.name}
                        <Header.Subheader>
                          <a
                            href={`https://www.google.com/maps/place/${detailsOpen.addr.replace(/\s+/g, '+')}`}
                            target='_blank'
                            rel='noreferrer'
                            className='date'
                          >
                            {detailsOpen.addr}
                          </a>
                        </Header.Subheader>
                      </div>

                      <Modal
                        closeIcon
                        onClose={() => setTourModalOpen(false)}
                        closeOnDocumentClick
                        size='small'
                        open={tourModalOpen}
                        trigger={(
                          <Button size='large' primary onClick={() => setTourModalOpen(true)}>
                            {propertiesPage.contactForm.title}
                          </Button>
                        )}
                      >
                        <Modal.Header>
                          {propertiesPage.contactForm.title}
                          {' '}
                          --
                          {' '}
                          {detailsOpen.name}
                        </Modal.Header>
                        <Modal.Content>
                          <ContactForm
                            name={propertiesPage.contactForm.form?.name}
                            fields={propertiesPage.contactForm.form?.contentfulfields}
                            textArea={propertiesPage.contactForm.form?.textarea}
                            button={propertiesPage.contactForm.form?.button}
                            onSubmit={() => setTourModalOpen(false)}
                          >
                            <input type='hidden' name='PROPERTY' value={detailsOpen.name} />
                          </ContactForm>
                        </Modal.Content>
                      </Modal>
                    </S.FlexSplit>
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
                        {detailsOpen.units.map((unit) => (
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
                        {detailsOpen.apartmentAmenities?.length > 0 ? (
                          <List bulleted>
                            {detailsOpen.apartmentAmenities.map((amenity) => (
                              <List.Item key={amenity}>{amenity}</List.Item>
                            ))}
                          </List>
                        ) : (
                          // `List` used to simplify spacing
                          <List><List.Content>{NO_AMENITIES_DATA}</List.Content></List>
                        )}
                      </Grid.Column>
                      <Grid.Column>
                        <Header>Community Amenities</Header>
                        {detailsOpen.communityAmenities?.length > 0 ? (
                          <List bulleted>
                            {detailsOpen.communityAmenities.map((amenity) => (
                              <List.Item key={amenity}>{amenity}</List.Item>
                            ))}
                          </List>
                        ) : (
                          <List><List.Content>{NO_AMENITIES_DATA}</List.Content></List>
                        )}
                      </Grid.Column>
                    </Grid>
                  </Segment>
                </Segment>
              </Segment>
            )}
          </Grid.Column>
        </Grid>
      </Segment>
    </div>
  )
}

export default Properties

export const imageQuery = graphql`
  query {
    sectionNav: contentfulNav(contentful_id: {eq: "3oYma487pKEGoceuYc8WCk"}) {
      sections
      size
      logo {
        title
        fixed(width: 150) {
          ...GatsbyContentfulFixed_tracedSVG
        }
      }
      logoSecondary {
        title
        fixed(width: 150) {
          ...GatsbyContentfulFixed_tracedSVG
        }
      }
    }
    propertiesPage: contentfulPropertiesPage(contentful_id: {eq: "5bdotCvkQYqNXaQnhTw6Ys"}) {
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
    # TODO: if multiple, need to know union of all
    allPropertyCollection {
      nodes {
        baths
        beds
        zipcodes
        rents
        apartmentAmenities
        communityAmenities
      }
    }
    allProperty {
      nodes {
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
            title
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
`
