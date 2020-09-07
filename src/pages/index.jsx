import React from 'react'
import { Link, graphql, navigate } from 'gatsby'
import { richTextToJsx } from '@madebyconnor/rich-text-to-jsx'

import GImage from 'gatsby-image'

// ui framework
import {
  Blurbs,
  Card,
  ContactForm,
  Container,
  Form,
  Header,
  Hero,
  IconLink,
  Input,
  Item,
  Label,
  Message,
  Navigation,
  PageSegment,
  Segment,
  Title,
  getBackgroundColor,
  getColor,
  media,
} from 'semantic-styled-ui'

import styled from 'styled-components'

import 'fomantic-ui-css/semantic.min.css'

import { noPadding } from '../components/S'
import { SharedFooter } from '../components'

import { defaultColors } from '../constants'

const NavLogo = styled(GImage).attrs()`
  margin-bottom: -3px;
`

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

const ProcessHeader = styled(Header)`
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

const SInput = styled(Input)`
  input {
    border: none;
    border-radius: 0 !important;
  }
`

const Flexbox = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;

  @media ${media.mobile} {
    flex-direction: column;
    margin-top: 2rem;
  }
`

const SHeroButton = styled(Hero.Button)`
  @media ${media.mobile} {
    margin-top: 0.5rem;
  }

  border: none;
  border-radius: 0 !important;
`

const RootIndex = ({
  location,
  data: {
    sectionNav,
    sectionHero,
    sectionMission,
    sectionTour,
    sectionItems,
    sectionTeam,
    sectionCareers,
    sectionContact,
  },
}) => {
  const handleSubmit = (e) => {
    const state = {}
    Array.from(e.target).forEach((input) => {
      if (input.value) state[input.name] = input.value
    })
    navigate(`/${sectionNav.sections[sectionNav.sections.length - 1].toLowerCase()}`, { state })
  }

  return (
    <div>
      <Navigation
        size={sectionNav.size}
        fullWidth
        relaxed
        split
        floating
        inverted
      >
        <Navigation.Logo as={Link} link='/' logoSize='large'>
          <NavLogo fixed={sectionNav.logoSecondary?.fixed} alt='logo' />
        </Navigation.Logo>
        <Flexbox>
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
        </Flexbox>
      </Navigation>
      {/* #region - hero */}
      <Hero
        overlay='darker'
        baseline='bottom'
        size='relaxed'
        secondary
        images={sectionHero.backgrounds.map((background) => (
          <GImage fluid={background.fluid} alt={background.title} key={background.title} />
        ))}
      >
        <Hero.Title>{sectionHero.subtitle}</Hero.Title>
        <Form onSubmit={handleSubmit}>
          <Flexbox align='center'>
            <SInput
              type='search'
              placeholder='Zip Code'
              name='zipcode'
            />
            <SInput
              min={0}
              type='number'
              placeholder='Min Price'
              name='min'
            />
            <SInput
              min={0}
              type='number'
              placeholder='Max Price'
              name='max'
            />
            <SHeroButton
              forwardedAs='button'
              type='submit'
              compact
            >
              {sectionHero.button}
            </SHeroButton>
          </Flexbox>
        </Form>

      </Hero>

      <main>
        {/* #region - About us */}
        <PageSegment id={sectionNav.sections[0]}>
          <Title textAlign='center'>{sectionMission.title}</Title>
          <Blurbs
            centered
            content={richTextToJsx(sectionMission.content?.json)}
          >
            {sectionMission.blurbs.map((blurb) => (
              <Blurbs.Item
                key={blurb.title}
                icon={<IconLink name={blurb.icon} inverted size='bigger' />}
                header={blurb.title}
              >
                {richTextToJsx(blurb.content?.json)}
              </Blurbs.Item>
            ))}
          </Blurbs>
        </PageSegment>

        {/* #region - Request tour */}
        <PageSegment id={sectionNav.sections[1]}>
          <Container text>
            <Header as='h3' textAlign='center'>{sectionTour.title}</Header>
            {sectionTour.icons && (
              <IconLink.Group padded='bottom' inverted size='large' justify='center'>
                <IconLink name='facebook' link='https://www.facebook.com/theconnectdoor/' />
                <IconLink name='twitter' link='https://twitter.com/ConnectDoor/' />
                <IconLink name='instagram' link='https://instagram.com/ConnectDoor/' />
                <IconLink name='linkedin' link='https://www.linkedin.com/company/connect-door/' />
              </IconLink.Group>
            )}
            <Header.Content css='text-align: justify;'>
              {richTextToJsx(sectionTour?.content?.json)}
            </Header.Content>
          </Container>
          <ContactForm
            name={sectionTour.form?.name}
            fields={sectionTour.form?.contentfulfields}
            textArea={sectionTour.form?.textarea}
            button={sectionTour.form?.button}
            padded='top'
          />
        </PageSegment>

        {/* @TODO extract to component (less undefined checking necessary) */}
        {/* #region - Process */}
        <PageSegment id={sectionNav.sections[2]}>
          <Container text>
            <ProcessHeader
              forwardedAs='h3'
              textAlign='center'
            >
              {sectionItems.title}
            </ProcessHeader>
            <Header.Content>{richTextToJsx(sectionItems.content?.json)}</Header.Content>
            <Item.Group divided relaxed>
              {sectionItems.steps.map((item, i) => (
                <Item key={item.title}>
                  <ProcessDarkenedImage size='medium' rounded>
                    <ProcessLabel ribbon size='huge'>{`#${i + 1}`}</ProcessLabel>
                    {item.image && (
                      <GImage
                        fixed={item.image.fixed}
                        $backgroundColor
                        alt={item.image.title}
                      />
                    )}
                  </ProcessDarkenedImage>

                  <Item.Content verticalAlign='middle'>
                    <Item.Header as='h4'>{item.title}</Item.Header>
                    <Item.Description>{richTextToJsx(item.content?.json)}</Item.Description>
                  </Item.Content>
                </Item>
              ))}
            </Item.Group>
            <Message compact floating size='huge'>
              <Message.Header>
                <ProcessLabel horizontal size='huge'>
                  {sectionItems.finalStepLabel}
                </ProcessLabel>
                {sectionItems.finalStep}
              </Message.Header>
            </Message>
          </Container>
        </PageSegment>

        {/* #region - Team */}
        {sectionTeam.title !== 'dummy' && (
          <TeamSegment basic>
            <Header as='h3' textAlign='center'>{sectionTeam.title}</Header>
            {sectionTeam.content && (
              <Header.Content css='text-align: justify;'>
                {richTextToJsx(sectionTeam.content?.json)}
              </Header.Content>
            )}
            <Card.Group
              itemsPerRow={sectionTeam.itemsPerRow}
              stackable
              doubling
              className='relaxed'
            >
              {sectionTeam.members.map((member) => (
                <Card centered key={member.name}>
                  {member.image && (
                    <GImage
                      fluid={member.image.fluid}
                      $backgroundColor
                      alt={member.image.title}
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
          </TeamSegment>
        )}

        {/* #region - Careers */}
        <PageSegment id={sectionNav.sections[3]} secondary>
          <Title textAlign='center'>{sectionCareers.title}</Title>
          <Blurbs
            content={richTextToJsx(sectionCareers.content?.json)}
            centered
          >
            {sectionCareers.blurbs.map((blurb) => (
              <Blurbs.Item
                key={blurb.title}
                icon={<IconLink name={blurb.icon} inverted size='bigger' />}
                header={blurb.title}
              >
                {richTextToJsx(blurb.content?.json)}
              </Blurbs.Item>
            ))}
          </Blurbs>
        </PageSegment>

        {/* #region - Contact form */}
        <PageSegment id={sectionNav.sections[4]}>
          <Title as='h3' textAlign='center'>{sectionContact.title}</Title>
          {sectionContact.icons && (
            <IconLink.Group padded='bottom' inverted size='large' justify='center'>
              <IconLink name='facebook' link='https://www.facebook.com/theconnectdoor/' />
              <IconLink name='twitter' link='https://twitter.com/ConnectDoor/' />
              <IconLink name='instagram' link='https://instagram.com/ConnectDoor/' />
              <IconLink name='linkedin' link='https://www.linkedin.com/company/connect-door/' />
            </IconLink.Group>
          )}
          <Container text>
            {richTextToJsx(sectionContact?.content?.json)}
          </Container>
          <ContactForm
            name={sectionContact.form?.name}
            fields={sectionContact.form?.contentfulfields}
            textArea={sectionContact.form?.textarea}
            button={sectionContact.form?.button}
            padded='top'
          />
        </PageSegment>

      </main>
      <SharedFooter />
    </div>
  )
}

export default RootIndex

export const query = graphql`
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
    sectionHero: contentfulHero(contentful_id: {eq: "4Xm7Mus18QeiygEOKQi60C"}) {
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
    sectionTeam: contentfulSectionTeam(contentful_id: {eq: "55zJ2eg2veSI86QI0OqySS"}) {
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
    sectionMission: contentfulSectionBlurb(contentful_id: {eq: "5LLFoCPMrYs4uGiyik204Q"}) {
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
    sectionCareers: contentfulSectionBlurb(contentful_id: {eq: "6vForGgTCg6qioCm8OoGSG"}) {
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
    sectionContact: contentfulSectionForm(contentful_id: {eq: "1nJlcIVOlmqGKKM2kSME8u"}) {
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
    sectionTour: contentfulSectionForm(contentful_id: {eq: "4viAPjDKxW8cqSCUwIACsW"}) {
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
    sectionItems: contentfulSectionItems(contentful_id: {eq: "3SrzH7lJvqKGsAWYiSS42y"}) {
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
`
