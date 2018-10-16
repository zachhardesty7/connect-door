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
  Card,
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

import { toJoinedTitleCase, calcDuration } from '../utils'

const RootIndex = ({ data }) => {
  const sectionNav = data.allContentfulNav.edges[0].node
  const sectionHero = data.allContentfulHero.edges[0].node
  const sectionMission = data.allContentfulSectionBlurb.edges[0].node
  const sectionTour = data.allContentfulSectionForm.edges[1].node
  const sectionItems = data.allContentfulSectionItems.edges[0].node
  const sectionTeam = (data.allContentfulSectionTeam.edges[1] &&
    data.allContentfulSectionTeam.edges[1].node) ||
    data.allContentfulSectionTeam.edges[0].node
  const sectionCareers = data.allContentfulSectionBlurb.edges[1].node
  const sectionContact = data.allContentfulSectionForm.edges[0].node

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
        logo={sectionNav.logo && sectionNav.logo.fixed}
        logoAlt={sectionNav.logo && sectionNav.logo.title}
        size={sectionNav.size}
        pages={sectionNav.sections}
        centered
      />
      <Hero
        logo={sectionHero.logo && sectionHero.logo.fixed}
        title={sectionHero.title}
        subtitle={sectionHero.subtitle}
        buttonText={sectionHero.button}
        background={sectionHero.background && sectionHero.background.fluid}
        backgroundAlt={sectionHero.background && sectionHero.background.title}
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
            {sectionMission.content && (
              <Header.Content>{sectionMission.content.content}</Header.Content>
            )}
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
                        content={blurb.content && blurb.content.content}
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
                <SocialMediaIcons
                  icons={[
                    {
                      name: 'Facebook',
                      link: 'https://www.facebook.com/theconnectdoor/'
                    },
                    {
                      name: 'Twitter',
                      link: 'https://twitter.com/ConnectDoor/'
                    },
                    {
                      name: 'Instagram',
                      link: 'https://instagram.com/ConnectDoor/'
                    },
                    {
                      name: 'Linkedin',
                      link: 'https://www.linkedin.com/company/connect-door/'
                    }
                  ]}
                />
              </Container>
            )}
            {sectionTour.content && sectionTour.content.content}
          </Form>
        </Segment>

        <Segment id='process' vertical basic>
          <Container className='container-items' text>
            <Header as='h3' textAlign='center'>{sectionItems.title}</Header>
            {sectionItems.content && (
              <Header.Content>{sectionItems.content.content}</Header.Content>
            )}
            <Item.Group divided relaxed>
              {sectionItems.steps.map((item, i) => (
                <Item key={toJoinedTitleCase(item.title)}>
                  <Item.Image size='medium' rounded className='darken-25'>
                    <Label content={`#${i + 1}`} ribbon className='process-label' size='huge' />
                    {item.image && (
                      <GImage fixed={item.image.fixed} backgroundColor alt={item.image.title} />
                    )}
                  </Item.Image>

                  <Item.Content verticalAlign='middle'>
                    <Item.Header>{item.title}</Item.Header>
                    <Item.Description>{item.content && item.content.content}</Item.Description>
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

        {sectionTeam.title !== 'dummy' && (
          <Segment id='team' basic>
            <Container text className='container-team'>
              <Header as='h3' textAlign='center'>{sectionTeam.title}</Header>
              {sectionTeam.content && (
                <Header.Content>{sectionTeam.content.content}</Header.Content>
              )}
            </Container>
            <Container className='cards'>
              <Card.Group itemsPerRow={sectionTeam.itemsPerRow} stackable doubling className='relaxed'>
                {sectionTeam.members.map((member, i) => (
                  <Card centered>
                    {member.image && (
                      <GImage fluid={member.image.fluid} backgroundColor alt={member.image.title} />
                    )}
                    <Card.Content>
                      <Card.Header>{member.name}</Card.Header>
                      <Card.Description>{member.content}</Card.Description>
                    </Card.Content>
                    {(member.number || member.email) && (
                      <Card.Content extra>
                        <Card.Meta>{member.number}</Card.Meta>
                        <Card.Meta>{member.email}</Card.Meta>
                      </Card.Content>
                    )}
                  </Card>
                ))}
              </Card.Group>
            </Container>
          </Segment>
        )}

        <Segment id='careers' vertical basic secondary>
          <Container text>
            <Header as='h3' textAlign='center'>{sectionCareers.title}</Header>
            {sectionCareers.content && (
              <Header.Content>{sectionCareers.content.content}</Header.Content>
            )}
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
                        content={blurb.content && blurb.content.content}
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
                <SocialMediaIcons
                  icons={[
                    {
                      name: 'Facebook',
                      link: 'https://www.facebook.com/theconnectdoor/'
                    },
                    {
                      name: 'Twitter',
                      link: 'https://twitter.com/ConnectDoor/'
                    },
                    {
                      name: 'Instagram',
                      link: 'https://instagram.com/ConnectDoor/'
                    },
                    {
                      name: 'Linkedin',
                      link: 'https://www.linkedin.com/company/connect-door/'
                    }
                  ]}
                />
              </Container>
            )}
            {sectionContact.content && sectionContact.content.content}
          </Form>
        </Segment>

      </Segment>

      <Footer copyright='ConnectDoor' />
    </React.Fragment>
  )
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

export default RootIndex

export const imageQuery = graphql`
  query {
    allContentfulNav(sort: { fields: [contentful_id] }) {
      edges {
        node {
          sections
          size
          logo {
            title
            fixed(width: 150) {
              ...GatsbyContentfulFixed_tracedSVG
            }
          }
        }
      }
    }
    allContentfulHero(sort: { fields: [contentful_id] }) {
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
    allContentfulSectionTeam(sort: { fields: [contentful_id] }) {
      edges {
        node {
          title
          content {
            content
          }
          itemsPerRow
          members {
            image {
              title
              fluid(maxWidth: 500) {
                ...GatsbyContentfulFluid_withWebp
              }
            }
            name
            content
            email
            number
          }
        }
      }
    }
    allContentfulSectionBlurb(sort: { fields: [contentful_id] }) {
      edges {
        node {
          title
          content {
            content
          }
          blurbs {
            icon
            title
            content {
              content
            }
          }
        }
      }
    }
    allContentfulSectionForm(sort: { fields: [contentful_id] }) {
      edges {
        node {
          title
          icons
          content {
            content
          }
          form {
            name
            contentfulfields
            textarea
            button
          }
        }
      }
    }
    allContentfulSectionItems(sort: { fields: [contentful_id] }) {
      edges {
        node {
          title
          steps {
            title
            content {
              content
            }
            image {
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
