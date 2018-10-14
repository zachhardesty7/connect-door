import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { Link } from 'react-scroll'
import Helmet from 'react-helmet'
import Async from 'react-promise'
import GImage from 'gatsby-image'

// ui framework
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Container,
  Grid,
  Segment,
  Header,
  Item,
  Label,
  Message
} from 'semantic-ui-react'

// user-defined
import './index.scss'
import 'semantic-ui-css/semantic.min.css'

// favicon
import faviconApple from '../../static/apple-touch-icon.png'
import favicon32 from '../../static/favicon-32x32.png'
import favicon16 from '../../static/favicon-16x16.png'
import faviconSafari from '../../static/safari-pinned-tab.svg'

import {
  Blurb,
  Navigation,
  Hero,
  Footer,
  SocialMediaIcons,
  Form
} from '../components'

const RootIndex = ({ data }) => {
  const sectionNav = data.allContentfulNav.edges[0].node
  const sectionHero = data.allContentfulHero.edges[0].node
  const sectionMission = data.allContentfulSectionBlurb.edges[0].node
  const sectionTour = data.allContentfulSectionForm.edges[0].node
  const sectionItems = data.allContentfulSectionItems.edges[0].node
  const sectionCareers = data.allContentfulSectionBlurb.edges[1].node
  const sectionContact = data.allContentfulSectionForm.edges[1].node

  return (
    <React.Fragment>
      <Helmet>
        <html lang='en' />
        <meta charSet='utf-8' />
        <title>{sectionHero.title}</title>
        <meta name='Description' content='Progressive Web App to advertise the services of ConnectDoor and contact them on listings' />
        <link rel='canonical' href='https://connectdoor.com' />

        {/* favicon */}
        <link rel='apple-touch-icon' sizes='180x180' href={faviconApple} />
        <link rel='icon' type='image/png' sizes='32x32' href={favicon32} />
        <link rel='icon' type='image/png' sizes='16x16' href={favicon16} />
        <link rel='mask-icon' href={faviconSafari} color='#3b5998' />
        <meta name='apple-mobile-web-app-title' content='ConnectDoor' />
        <meta name='application-name' content='ConnectDoor' />
        <meta name='msapplication-TileColor' content='#3b5998' />
        <meta name='theme-color' content='#ffffff' />
      </Helmet>
      <Navigation
        logo={sectionNav.logo.fixed}
        logoAlt={sectionNav.logo.title}
        pages={sectionNav.sections}
        centered
      />
      <Hero
        logo={sectionHero.logo.fixed}
        title={sectionHero.title}
        subtitle={sectionHero.subtitle}
        buttonText={sectionHero.button}
        background={sectionHero.background.fluid}
        backgroundAlt={sectionHero.background.title}
        buttonProps={{
          primary: true,
          size: 'huge',
          as: Link,
          to: 'property-tour',
          smooth: true,
          duration: calcDuration
        }}
      />

      <Segment id='home' vertical basic>

        <Segment id='about' vertical basic>
          <Container text>
            <Header as='h3' textAlign='center'>{sectionMission.title}</Header>
            <Header.Content>{sectionMission.content.content}</Header.Content>
          </Container>
          <Container className='blurbs'>
            <Grid relaxed stackable columns={3} divided padded>
              {sectionMission.blurbs.map(blurb => (
                <Async
                  key={toJoinedTitleCase(blurb.title)}
                  promise={import('@fortawesome/free-solid-svg-icons')}
                  then={icon => (
                    <Grid.Column>
                      <Blurb
                        icon={<FontAwesomeIcon icon={icon[`fa${toJoinedTitleCase(blurb.icon)}`]} size='3x' color='#749AD3' />}
                        header={blurb.title}
                        headerAs='h4'
                        content={blurb.content.content}
                      />
                    </Grid.Column>
                  )}
                />
              ))}
            </Grid>
          </Container>
        </Segment>

        <Segment id='property-tour' vertical secondary basic>
          <Form
            name={sectionTour.form.name}
            header={sectionTour.title}
            fields={sectionTour.form.contentfulfields}
            textArea={sectionTour.form.textarea}
            button={sectionTour.form.button}
          >
            {sectionTour.icons && (
              <Container textAlign='center'>
                <SocialMediaIcons />
              </Container>
            )}
            {sectionTour.content.content}
          </Form>
        </Segment>

        <Segment id='process' vertical basic>
          <Container className='container-items' text>
            <Header as='h3' textAlign='center'>{sectionItems.title}</Header>
            <Item.Group divided relaxed>
              {sectionItems.steps.map((item, i) => (
                <Item key={toJoinedTitleCase(item.title)}>
                  <Item.Image size='medium' rounded className='darken-25'>
                    <Label content={`#${i + 1}`} ribbon className='process-label' size='huge' />
                    <GImage fixed={item.image.fixed} backgroundColor alt={item.image.title} />
                  </Item.Image>

                  <Item.Content verticalAlign='middle'>
                    <Item.Header>{item.title}</Item.Header>
                    <Item.Description>{item.content.content}</Item.Description>
                  </Item.Content>
                </Item>
              ))}
            </Item.Group>
          </Container>
          <Container text textAlign='center'>
            <Message compact floating size='huge'>
              <Message.Header>
                <Label
                  content={sectionItems.finalStepLabel}
                  horizontal
                  className='process-label'
                  size='huge'
                />
                {sectionItems.finalStep}
              </Message.Header>
            </Message>
          </Container>
        </Segment>

        <Segment id='careers' vertical basic secondary>
          <Container text>
            <Header as='h3' textAlign='center'>{sectionCareers.title}</Header>
            <Header.Content>{sectionCareers.content.content}</Header.Content>
          </Container>
          <Container className='blurbs'>
            <Grid relaxed stackable columns={3} divided padded>
              {sectionCareers.blurbs.map(blurb => (
                <Async
                  key={toJoinedTitleCase(blurb.title)}
                  promise={import('@fortawesome/free-solid-svg-icons')}
                  then={icon => (
                    <Grid.Column>
                      <Blurb
                        icon={<FontAwesomeIcon icon={icon[`fa${toJoinedTitleCase(blurb.icon)}`]} size='3x' color='#749AD3' />}
                        header={blurb.title}
                        headerAs='h4'
                        content={blurb.content.content}
                      />
                    </Grid.Column>
                  )}
                />
              ))}
            </Grid>
          </Container>
        </Segment>

        <Segment id='contact' vertical basic>
          <Form
            name={sectionContact.form.name}
            header={sectionContact.title}
            fields={sectionContact.form.contentfulfields}
            textArea={sectionContact.form.textarea}
            button={sectionContact.form.button}
          >
            {sectionContact.icons && (
              <Container textAlign='center' className='contact-icons'>
                <SocialMediaIcons />
              </Container>
            )}
            {sectionContact.content.content}
          </Form>
        </Segment>

      </Segment>

      <Footer copyright='ConnectDoor' />
    </React.Fragment>
  )
}

function toJoinedTitleCase(str) {
  return str.replace(
    /\w*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1)
  ).replace(/\W/g, '')
}

RootIndex.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.object,
    allContentfulAsset: PropTypes.object
  })
}

RootIndex.defaultProps = {
  data: PropTypes.shape({
    site: {},
    allContentfulAsset: {}
  })
}

const calcDuration = (scrollDistanceInPx) => {
  const min = 800
  const max = 2000

  return Math.min(Math.max(Math.abs(scrollDistanceInPx), min), max)
}

export default RootIndex

export const imageQuery = graphql`
  query {
    allContentfulNav {
      edges {
        node {
          sections
          logo {
            id
            title
            fixed(width: 150) {
              ...GatsbyContentfulFixed_tracedSVG
            }
          }
        }
      }
    }
    allContentfulHero {
      edges {
        node {
          logo {
            id
            title
            fixed(width: 50) {
              ...GatsbyContentfulFixed_tracedSVG
            }
          }
          title
          subtitle
          button
          background {
            id
            title
            fluid(maxWidth: 1920) {
              ...GatsbyContentfulFluid_withWebp
            }
          }
        }
      }
    }
    allContentfulSectionBlurb {
      edges {
        node {
          id
          title
          content {
            content
          }
          blurbs {
            id
            icon
            title
            content {
              content
            }
          }
        }
      }
    }
    allContentfulSectionForm {
      edges {
        node {
          id
          title
          icons
          content {
            content
          }
          form {
            id
            name
            contentfulfields
            textarea
            button
          }
        }
      }
    }
    allContentfulSectionItems {
      edges {
        node {
          id
          title
          steps {
            id
            title
            content {
              content
            }
            image {
              id
              title
              fixed(width: 300) {
                ...GatsbyContentfulFixed_withWebp
              }
            }
            stepRibbon
          }
          finalStep
          finalStepLabel
        }
      }
    }
  }
`
