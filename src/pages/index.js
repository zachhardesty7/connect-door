import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { richTextToJsx } from '@madebyconnor/rich-text-to-jsx'

import { Link } from 'react-scroll'
import Helmet from 'react-helmet'
import GImage from 'gatsby-image'

import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'

// ui framework
import {
  Card,
  Container,
  Segment,
  Header,
  Item,
  Label,
  Message
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

// user-defined
import {
  Hero,
  Navigation,
  Blurbs,
  Footer,
  Form,
  IconGroup,
  Icon,
  asTag,
  getColor,
  getBackgroundColor
} from 'semantic-styled-ui'

import brandingMedium from '../assets/branding-medium.otf'

const brandColors = {
  blue: '#3b5998',
  orange: '#ca6914',
  teal: '#749ad3',
  white: '#ffffff'
}

const defaultColors = {
  ...brandColors,
  primary: brandColors.blue,
  secondary: brandColors.teal,
  accent: brandColors.orange
}

const GlobalStyle = createGlobalStyle`
  /* logo font */
  @font-face {
    font-family: 'Branding';
    src: url(${brandingMedium}) format('opentype');
    font-display: swap;
  }

  /* override SemanticUI font "Lato" */
  *:not(.icon) {
    font-family: 'Branding', Tahoma, Arial, Helvetica, sans-serif !important;
  }

  body {
    font-size: 1em;
    margin: 0;
  }

  p {
    line-height: 1.5;
  }

  img {
    display: block;
    width: 100%;
  }
`

const SegmentTagged = asTag(Segment)
const BaseSegment = styled(SegmentTagged)`
  h3 {
    font-size: 3em;
  }

  h4 {
    font-size: 2em !important;
  }

  padding-top: 6em;
  padding-bottom: 6em;
`

const HeaderTagged = asTag(Header)
const ProcessHeader = styled(HeaderTagged)`
  margin-bottom: 1em;
`

const ProcessLabelContainer = styled(Container)`
  padding-top: 4em;
`

const ProcessLabel = styled(Label)`
  z-index: 1;
  left: calc(.05rem - 1.2em);
  
  ${getColor('white')};
  ${getBackgroundColor('secondary')};

  /* allow placement on right with changed color */
  &.right::after {
    border-top-color: ${defaultColors.secondary};
  }
  &:not(.right)::after {
    border-right-color: ${defaultColors.secondary};
  }
`

const ProcessDarkenedImage = styled(Item.Image)`
  .gatsby-image-wrapper {
    display: block !important;
  }

  /* overlay darken by 25% */
  &::before {
    content: "";
    height: 100%;
    width: 100%;
    background: linear-gradient(0deg,rgba(0,0,0,0.25),rgba(0,0,0,0.25));
    border-radius: inherit;
    top: 0;
    left: 0;
    position: absolute;
    z-index: 1;
  }
`

const TeamSegment = styled(BaseSegment)`
  /* force cards to always center */
  .ui.doubling.stackable.three.cards {
    justify-content: center;
  }

  /* relax spacing between cards */
  .ui.cards.relaxed > .card {
    width: calc(33.33333333% - 2.5em);
    margin: 1.25em 1.125em;
  }

  @media only screen and (max-width: 991px) and (min-width: 768px) {
    .ui.three.doubling.cards>.card {
      width: calc(50% - 2.5em);
      margin: 1.25em 1.125em;
    }
  }

  /* force center and appropriate size for mobile */
  @media only screen and (max-width: 767px) {
    .ui.stackable.cards {
      display: flex !important;

      & > .card {
        width: 350px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
    }
  }
`

const RootIndex = ({ data }) => {
  const sectionNav = data.allContentfulNav.edges[0].node
  const sectionHero = data.allContentfulHero.edges[0].node
  const sectionMission = data.allContentfulSectionBlurb.edges[0].node
  const sectionTour = data.allContentfulSectionForm.edges[1].node
  const sectionItems = data.allContentfulSectionItems.edges[0].node
  // account for dummy entry
  const sectionTeam = (data.allContentfulSectionTeam.edges[1] &&
    data.allContentfulSectionTeam.edges[1].node) ||
    data.allContentfulSectionTeam.edges[0].node
  const sectionCareers = data.allContentfulSectionBlurb.edges[1].node
  const sectionContact = data.allContentfulSectionForm.edges[0].node

  return (
    <ThemeProvider theme={{ ...defaultColors }}>
      <div id='top' className='root'>
        <GlobalStyle />

        <Helmet>
          <html lang='en' />
          <meta charSet='utf-8' />
          <title>{sectionHero.title}</title>
          <meta name='Description' content='Progressive Web App to advertise the services of ConnectDoor and contact them on listings' />
          <link rel='canonical' href='https://connectdoor.com' />
        </Helmet>

        <Navigation tag={Link} size={sectionNav.size} text pointing>
          <Navigation.Logo link='#top' tabIndex='0'>
            <GImage fixed={sectionNav.logo?.fixed} alt='logo' />
          </Navigation.Logo>
          {sectionNav.sections.map((page, i) => (
            <Navigation.Item key={page} link={`#${page}`} tabIndex='0'>{page}</Navigation.Item>
          ))}
        </Navigation>

        <Hero
          logo={<GImage fixed={sectionHero?.logo?.fixed} alt='logo' />}
          inlineLogo
          overlay='darker'
          baseline='bottom'
          size='compact'
          title={sectionHero.title}
          subtitle={sectionHero.subtitle}
          button={(
            <Hero.Button
              compact
              tag={Link}
              link={`#${sectionNav.sections[1]}`}
            >
              {sectionHero.button}
            </Hero.Button>
          )}
        >
          {sectionHero.backgrounds.map(background => (
            <GImage fluid={background.fluid} alt={background.title} key={background.title} />
          ))}
        </Hero>

        <Segment as='main' vertical basic>

          <Blurbs
            as={BaseSegment}
            id={sectionNav.sections[0]}
            title={sectionMission.title}
            content={richTextToJsx(sectionMission.content?.json)}
          >
            {sectionMission.blurbs.map(blurb => (
              <Blurbs.Item
                key={blurb.title}
                icon={<Icon name={blurb.icon} inverted size='bigger' />}
                header={blurb.title}
              >
                {richTextToJsx(blurb.content?.json)}
              </Blurbs.Item>
            ))}
          </Blurbs>

          <BaseSegment id={sectionNav.sections[1]} tag='section' vertical secondary basic>
            <Container text>
              <Header as='h3' textAlign='center'>{sectionTour.title}</Header>
              {sectionTour.icons && (
                <IconGroup padded='bottom' inverted size='large' justify='center'>
                  <Icon name='facebook' link='https://www.facebook.com/theconnectdoor/' />
                  <Icon name='twitter' link='https://twitter.com/ConnectDoor/' />
                  <Icon name='instagram' link='https://instagram.com/ConnectDoor/' />
                  <Icon name='linkedin' link='https://www.linkedin.com/company/connect-door/' />
                </IconGroup>
              )}
              <Header.Content>{richTextToJsx(sectionTour?.content?.json)}</Header.Content>
              <Form
                name={sectionTour.form?.name}
                fields={sectionTour.form?.contentfulfields}
                textArea={sectionTour.form?.textarea}
                button={sectionTour.form?.button}
                padded='top'
              />
            </Container>
          </BaseSegment>

          {/* @TODO extract to component (less undefined checking necessary) */}
          <BaseSegment id={sectionNav.sections[2]} vertical basic>
            <Container text>
              <ProcessHeader tag='h3' textAlign='center'>{sectionItems.title}</ProcessHeader>
              <Header.Content>{richTextToJsx(sectionItems.content?.json)}</Header.Content>
              <Item.Group divided relaxed>
                {sectionItems.steps.map((item, i) => (
                  <Item key={item.title}>
                    <ProcessDarkenedImage size='medium' rounded>
                      <ProcessLabel ribbon size='huge'>{`#${i + 1}`}</ProcessLabel>
                      {item.image && (
                        <GImage fixed={item.image?.fixed} backgroundColor alt={item.image?.title} />
                      )}
                    </ProcessDarkenedImage>

                    <Item.Content verticalAlign='middle'>
                      <Item.Header as='h4'>{item.title}</Item.Header>
                      <Item.Description>{richTextToJsx(item.content?.json)}</Item.Description>
                    </Item.Content>
                  </Item>
                ))}
              </Item.Group>
            </Container>
            <ProcessLabelContainer text textAlign='center'>
              <Message compact floating size='huge'>
                <Message.Header>
                  <ProcessLabel horizontal size='huge'>
                    {sectionItems.finalStepLabel}
                  </ProcessLabel>
                  {sectionItems.finalStep}
                </Message.Header>
              </Message>
            </ProcessLabelContainer>
          </BaseSegment>

          {sectionTeam.title !== 'dummy' && (
            <TeamSegment basic>
              <Container text className='container-team'>
                <Header as='h3' textAlign='center'>{sectionTeam.title}</Header>
                {sectionTeam.content && (
                  <Header.Content>{richTextToJsx(sectionTeam.content?.json)}</Header.Content>
                )}
              </Container>
              <Container className='cards'>
                <Card.Group itemsPerRow={sectionTeam.itemsPerRow} stackable doubling className='relaxed'>
                  {sectionTeam.members.map((member, i) => (
                    <Card centered key={member.name}>
                      {member.image && (
                        <GImage
                          fluid={member.image?.fluid}
                          backgroundColor
                          alt={member.image?.title}
                        />
                      )}
                      <Card.Content>
                        <Card.Header>{member.name}</Card.Header>
                        <Card.Description>{member.content}</Card.Description>
                      </Card.Content>
                      {/* prevent divider render */}
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
            </TeamSegment>
          )}

          <Blurbs
            id={sectionNav.sections[3]}
            title={sectionCareers.title}
            content={richTextToJsx(sectionCareers.content?.json)}
            secondary
          >
            {sectionCareers.blurbs.map(blurb => (
              <Blurbs.Item
                key={blurb.title}
                icon={<Icon name={blurb.icon} inverted size='bigger' />}
                header={blurb.title}
              >
                {richTextToJsx(blurb.content?.json)}
              </Blurbs.Item>
            ))}
          </Blurbs>

          <BaseSegment id={sectionNav.sections[4]} vertical basic>
            <Container text>
              <Container text>
                <Header as='h3' textAlign='center'>{sectionContact.title}</Header>
                {sectionContact.icons && (
                  <Container textAlign='center'>
                    <IconGroup padded='bottom' inverted size='large' justify='center'>
                      <Icon name='facebook' link='https://www.facebook.com/theconnectdoor/' />
                      <Icon name='twitter' link='https://twitter.com/ConnectDoor/' />
                      <Icon name='instagram' link='https://instagram.com/ConnectDoor/' />
                      <Icon name='linkedin' link='https://www.linkedin.com/company/connect-door/' />
                    </IconGroup>
                  </Container>
                )}
                <Header.Content>
                  {richTextToJsx(sectionContact?.content?.json)}
                </Header.Content>
              </Container>
              <Form
                name={sectionContact.form?.name}
                fields={sectionContact.form?.contentfulfields}
                textArea={sectionContact.form?.textarea}
                button={sectionContact.form?.button}
                padded='top'
              />
            </Container>
          </BaseSegment>

        </Segment>

        <Footer
          inverted
          icons={(
            <IconGroup light justify='flex-end'>
              <Icon name='facebook' link='https://www.facebook.com/theconnectdoor/' />
              <Icon name='twitter' link='https://twitter.com/ConnectDoor/' />
              <Icon name='instagram' link='https://instagram.com/ConnectDoor/' />
              <Icon name='linkedin' link='https://www.linkedin.com/company/connect-door/' />
            </IconGroup>
          )}
          copyright='ConnectDoor'
          developerName='Zach Hardesty'
          developerLink='https://zachhardesty.com'
        />
      </div>
    </ThemeProvider>
  )
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
          backgrounds {
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
            json
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
            bio {
              json
            }
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
            json
          }
          blurbs {
            icon
            title
            content {
              json
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
            json
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
              json
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
