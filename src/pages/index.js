import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { Link } from 'react-scroll'
import Helmet from 'react-helmet'
import GImage from 'gatsby-image'

import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'

// ui framework
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
import 'semantic-ui-css/semantic.min.css'

// user-defined
import {
  Hero,
  Navigation,
  Blurb,
  Footer,
  Form,
  IconGroup,
  Icon
} from 'semantic-styled-ui'
// import branding from '../../static/branding-medium.otf'

import { defaultColors, toJoinedTitleCase } from '../utils'

// favicon
import faviconApple from '../../static/apple-touch-icon.png'
import favicon32 from '../../static/favicon-32x32.png'
import favicon16 from '../../static/favicon-16x16.png'
import faviconSafari from '../../static/safari-pinned-tab.svg'

const GlobalStyle = createGlobalStyle`
  /* logo font */
  @font-face {
    font-family: 'Branding';
    font-weight: 600;
    font-style: normal;
    src: url('/static/branding.otf') format('opentype');
    font-display: swap;
  }

  /* override SemanticUI font "Lato" */
  *:not(.icon) {
    font-family: 'Branding', Tahoma, Arial, Helvetica, sans-serif !important;
  }

  body {
    font-size: 1em;
    line-height: 1.65;
    color: ${defaultColors.dark};
    margin: 0;
  }

  img {
    display: block;
    width: 100%;
  }

  h1,
  h2,
  h3 {
    font-size: 2em;
    font-weight: 600 !important;
  }

  a {
    color: ${defaultColors.secondaryColor};
    &:hover {
      color: ${defaultColors.white};
    }
  }
`

const Main = styled(Segment)`
  h3 {
    font-size: 3em;
    font-weight: 600;
  }

  h4 {
    font-size: 2em;
    font-weight: 600;
  }

  padding: 3em 0em;

  .gatsby-image-wrapper {
    display: block !important;
  }

  /* space each segment */
  & > .segment {
    padding-top: 5em;
    padding-bottom: 5em;
  }
`

const BaseSegment = styled(Segment)`
  & > .container:first-child {
    padding-bottom: 3em;
  }
`

const ProcessSegment = styled(Segment)`
  h3 {
    font-weight: 600;
    margin-bottom: 1em;
  }

  h4 {
    font-weight: 600;
  }

  .container-items {
    margin-bottom: 3em;
  }

  .rounded img {
    border-radius: 0.5rem;
  }

  .process-label {
    z-index: 1;
    background-color: ${defaultColors.secondary};
    color: ${defaultColors.white};

    /* allow placement on right with changed color */
    &.right::after {
      border-top-color: ${defaultColors.secondary};
    }
    &:not(.right)::after {
      border-right-color: ${defaultColors.secondary};
    }
  }

  /* overlay darken by 25% */
  .darken-25::before {
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

const Blurbs = styled(Container)`
  text-align: center;
`

const PaddedForm = styled(Form)`
  padding-top: 2em;
`

const UnpaddedTopIconGroup = styled(IconGroup)`
  padding-top: 0;
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

  const colors = {
    blue: '#3b5998',
    orange: '#ca6914',
    teal: '#749ad3'
  }

  return (
    <ThemeProvider theme={{
      ...colors,
      primary: colors.blue,
      secondary: colors.teal,
      accent: colors.orange
    }}
    >
      <div id='top' className='root'>
        <GlobalStyle />

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
          <link rel='mask-icon' href={faviconSafari} color={defaultColors.primary} />
          <meta name='apple-mobile-web-app-title' content='ConnectDoor' />
          <meta name='application-name' content='ConnectDoor' />
          <meta name='msapplication-TileColor' content={defaultColors.primary} />
          <meta name='theme-color' content={defaultColors.white} />
        </Helmet>

        <Navigation tag={Link} size={sectionNav.size} text pointing={false}>
          <Navigation.Logo to='top' anchor tabIndex='0'>
            <GImage fixed={sectionNav.logo.fixed} alt='logo' />
          </Navigation.Logo>
          {sectionNav.sections.map((page, i) => (
            <Navigation.Item key={page} to={page} anchor tabIndex={i + 1}>{page}</Navigation.Item>
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
              anchor
              tag={Link}
              to={sectionNav.sections[1]}
            >
              {sectionHero.button}
            </Hero.Button>
          )}
        >
          {sectionHero.backgrounds.map(background => (
            <GImage fluid={background.fluid} alt={background.title} key={background.title} />
          ))}
        </Hero>

        <Main vertical basic>

          <BaseSegment id={sectionNav.sections[0]} vertical basic>
            <Container text>
              <Header as='h3' textAlign='center'>{sectionMission.title}</Header>
              {sectionMission.content && (
                <Header.Content>{sectionMission.content.content}</Header.Content>
              )}
            </Container>
            <Blurbs>
              <Grid relaxed stackable divided padded columns={sectionMission.blurbs.length}>
                {sectionMission.blurbs.map(blurb => (
                  <Grid.Column key={toJoinedTitleCase(blurb.title)}>
                    <Blurb
                      icon={<Icon name={blurb.icon} inverted size='bigger' />}
                      header={blurb.title}
                    >
                      {blurb?.content?.content}
                    </Blurb>
                  </Grid.Column>
                ))}
              </Grid>
            </Blurbs>
          </BaseSegment>

          <Segment id={sectionNav.sections[1]} vertical secondary basic>
            <Container text>
              <Header as='h3' textAlign='center'>{sectionTour.title}</Header>
              {sectionTour.icons && (
                <UnpaddedTopIconGroup inverted size='large' justify='center'>
                  <Icon name='facebook' link='https://www.facebook.com/theconnectdoor/' />
                  <Icon name='twitter' link='https://twitter.com/ConnectDoor/' />
                  <Icon name='instagram' link='https://instagram.com/ConnectDoor/' />
                  <Icon name='linkedin' link='https://www.linkedin.com/company/connect-door/' />
                </UnpaddedTopIconGroup>
              )}
              <Header.Content>{sectionTour?.content?.content}</Header.Content>
              <PaddedForm
                name={sectionTour.form.name}
                fields={sectionTour.form.contentfulfields}
                textArea={sectionTour.form.textarea}
                button={sectionTour.form.button}
              />
            </Container>
          </Segment>

          {/* TODO: extract to component (less undefined checking necessary) */}
          <ProcessSegment id={sectionNav.sections[2]} vertical basic>
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
                      <Item.Header as='h4'>{item.title}</Item.Header>
                      <Item.Description>{item?.content?.content}</Item.Description>
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
          </ProcessSegment>

          {/* TODO: extract to component (less undefined checking necessary) */}
          {sectionTeam.title !== 'dummy' && (
            <TeamSegment basic>
              <Container text className='container-team'>
                <Header as='h3' textAlign='center'>{sectionTeam.title}</Header>
                {sectionTeam.content && (
                  <Header.Content>{sectionTeam.content.content}</Header.Content>
                )}
              </Container>
              <Container className='cards'>
                <Card.Group itemsPerRow={sectionTeam.itemsPerRow} stackable doubling className='relaxed'>
                  {sectionTeam.members.map((member, i) => (
                    <Card centered key={member.name}>
                      {member.image && (
                        <GImage fluid={member.image.fluid} backgroundColor alt={member.image.title} />
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

          <BaseSegment id={sectionNav.sections[3]} vertical basic secondary>
            <Container text>
              <Header as='h3' textAlign='center'>{sectionCareers.title}</Header>
              {sectionCareers.content && (
                <Header.Content>{sectionCareers.content.content}</Header.Content>
              )}
            </Container>
            <Blurbs>
              <Grid relaxed stackable columns={sectionCareers.blurbs.length} divided padded>
                {sectionCareers.blurbs.map(blurb => (
                  <Grid.Column key={toJoinedTitleCase(blurb.title)}>
                    <Blurb
                      icon={<Icon name={blurb.icon} inverted size='bigger' />}
                      header={blurb.title}
                    >
                      {blurb?.content?.content}
                    </Blurb>
                  </Grid.Column>
                ))}
              </Grid>
            </Blurbs>
          </BaseSegment>

          <Segment id={sectionNav.sections[4]} vertical basic>
            <Container text>
              <Container text>
                <Header as='h3' textAlign='center'>{sectionContact.title}</Header>
                {sectionContact.icons && (
                  <Container textAlign='center'>
                    <UnpaddedTopIconGroup inverted size='large' justify='center'>
                      <Icon name='facebook' link='https://www.facebook.com/theconnectdoor/' />
                      <Icon name='twitter' link='https://twitter.com/ConnectDoor/' />
                      <Icon name='instagram' link='https://instagram.com/ConnectDoor/' />
                      <Icon name='linkedin' link='https://www.linkedin.com/company/connect-door/' />
                    </UnpaddedTopIconGroup>
                  </Container>
                )}
                <Header.Content>
                  {sectionContact?.content?.content}
                </Header.Content>
              </Container>
              <PaddedForm
                name={sectionContact.form.name}
                fields={sectionContact.form.contentfulfields}
                textArea={sectionContact.form.textarea}
                button={sectionContact.form.button}
              />
            </Container>
          </Segment>

        </Main>

        <Footer
          inverted
          icons={(
            <IconGroup light compact justify='flex-end'>
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

RootIndex.propTypes = {
  data: PropTypes.object // eslint-disable-line react/forbid-prop-types
}

RootIndex.defaultProps = {
  data: {}
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
