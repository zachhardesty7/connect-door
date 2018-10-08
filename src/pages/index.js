import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
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
import {
  Blurb,
  Navigation,
  Hero,
  Footer,
  SocialMediaIcons,
  Form
} from '../components'

class RootIndex extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      site: PropTypes.object,
      allContentfulAsset: PropTypes.object
    })
  }

  static defaultProps = {
    data: PropTypes.shape({
      site: {},
      allContentfulAsset: {}
    })
  }

  render() {
    const { data } = this.props

    const sectionNav = data.allContentfulNav.edges[0].node
    const sectionHero = data.allContentfulHero.edges[0].node
    const sectionMission = data.allContentfulSectionBlurb.edges[1].node
    const sectionTour = data.allContentfulSectionForm.edges[0].node
    const sectionItems = data.allContentfulSectionItems.edges[0].node
    const sectionCareers = data.allContentfulSectionBlurb.edges[0].node
    const sectionContact = data.allContentfulSectionForm.edges[1].node

    return (
      <React.Fragment>
        <Helmet>
          <meta charSet='utf-8' />
          <title>{sectionHero.title}</title>
          <meta name='Description' content='Progressive Web App to advertise the services of ConnectDoor and contact them on listings' />
          <link rel='canonical' href='http://connectdoor.com' />
        </Helmet>
        <Navigation
          logo={sectionNav.logo.fluid}
          pages={sectionNav.sections}
          centered
        />
        <Hero
          title={sectionHero.title}
          subtitle={sectionHero.subtitle}
          buttonText={sectionHero.button}
          background={sectionHero.background.fluid}
          buttonProps={{ basic: true, inverted: true, size: 'huge' }}
        />

        <Segment id='home' vertical basic>

          <Segment id='about' vertical basic>
            <Container text>
              <Header as='h3' textAlign='center'>{sectionMission.title}</Header>
              <Header.Content>{sectionMission.content.content}</Header.Content>
            </Container>
            <Container className='blurbs'>
              <Grid relaxed columns={3} divided padded>
                {sectionMission.blurbs.map(blurb => (
                  <Async
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
                  <Item>
                    <Item.Image size='medium' rounded>
                      <Label content={`#${i + 1}`} ribbon className='process-label' size='huge' />
                      <GImage fluid={item.image.fluid} className='test' />
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
              <Grid relaxed columns={3} divided padded>
                {sectionCareers.blurbs.map(blurb => (
                  <Async
                    promise={import('@fortawesome/free-solid-svg-icons')}
                    then={(icon) => {
                      const name = `fa${toJoinedTitleCase(blurb.icon)}`
                      const { [name]: test } = icon
                      return (
                        <Grid.Column>
                          <Blurb
                            icon={<FontAwesomeIcon icon={test} size='3x' color='#749AD3' />}
                            header={blurb.title}
                            headerAs='h4'
                            content={blurb.content.content}
                          />
                        </Grid.Column>
                      )
                    }}
                  />
                ))}
              </Grid>
            </Container>
          </Segment>

          <Segment id='contact' vertical basic>
            <Form
              name={sectionContact.form.name}
              header={sectionContact.title}
              fields={sectionTour.form.contentfulfields}
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
        <Footer />
      </React.Fragment>
    )
  }
}

function toJoinedTitleCase(str) {
  return str.replace(
    /\w*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1)
  ).replace(/\W/g, '')
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
            fluid(maxWidth: 300) {
              tracedSVG
              aspectRatio
              src
              srcSet
              srcWebp
              srcSetWebp
              sizes
            }
          }
        }
      }
    }
    allContentfulHero {
      edges {
        node {
          title
          subtitle
          button
          background {
            id
            title
            fluid(maxWidth: 1920) {
              tracedSVG
              aspectRatio
              src
              srcSet
              srcWebp
              srcSetWebp
              sizes
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
              fluid(maxWidth: 600) {
                tracedSVG
                aspectRatio
                src
                srcSet
                srcWebp
                srcSetWebp
                sizes
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
