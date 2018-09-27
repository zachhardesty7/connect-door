import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
// import GImage from 'gatsby-image'

// ui framework
import { IconContext } from 'react-icons'
import {
  FaHandshake, FaUserClock, FaMoneyBillWave, FaUser, FaChartLine
} from 'react-icons/fa'
import { MdHeadset } from 'react-icons/md'
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
  Logo,
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
    // const siteTitle = data.site.siteMetadata.title
    const images = {}
    data.allContentfulAsset.edges.forEach((i) => {
      images[i.node.title] = i.node
    })

    return (
      <React.Fragment>
        {/* <Helmet title={siteTitle} /> */}
        <Navigation
          logo={<Logo />}
          pages={['About', 'Property Tour', 'Process', 'Careers', 'Contact']}
          centered
        />
        <Hero
          title='CONNECT DOOR'
          subtitle='Allow us to connect you to your dream home.'
          buttonText='Request a Property Tour'
          buttonProps={{ basic: true, inverted: true, size: 'huge' }}
        />
        {/* REVIEW: use a Segment.Group? */}
        <Segment id='home' vertical basic>

          <Segment id='about' vertical basic>
            <Container text>
              <Header as='h3' textAlign='center'>Our Mission</Header>
              <Header.Content>
                Connect Door was founded in 2018 with the goal and mission of serving others in
                their residential real estate needs. We are a free service to our clients.
                We only get compensated once we successfully locate and secure your next home.
                We are committed to first-class service and representation to our clients in
                order to ensure the experience is not only successful, but enjoyable.
              </Header.Content>
            </Container>
            <Container className='blurbs'>
              <IconContext.Provider value={{ color: '#749AD3', size: '4em' }}>
                <Grid relaxed columns={3} divided padded>
                  <Grid.Column>
                    <Blurb
                      icon={<MdHeadset />}
                      header='Customer Service'
                      headerAs='h4'
                    >
                    Our mission is your mission. We understand that the search process can be
                    tough, but as market professionals, we cater to your needs and help you
                    avoid unnecessary hurdles while finding a new home.
                    </Blurb>
                  </Grid.Column>
                  <Grid.Column>
                    <Blurb
                      icon={<FaHandshake />}
                      header='Commitment'
                    >
                    We are committed to you. Your needs are at the forefront of our priorities.
                    We listen, we plan, we execute, and we deliver results. Allow us to prove
                    our worth to you.
                    </Blurb>
                  </Grid.Column>
                  <Grid.Column>
                    <Blurb
                      icon={<FaUserClock />}
                      header='Reliability'
                    >
                    The search process requires organization and efficiency to ensure a smooth
                    and easy search experience. Utilizing our in-house resources, we reliably
                    improve the user experience and execution.
                    </Blurb>
                  </Grid.Column>
                </Grid>
              </IconContext.Provider>
            </Container>
          </Segment>

          <Segment id='property-tour' vertical secondary basic>
            <Form
              name='property-tour'
              header='Request a Property Tour'
              fields={[
                ['First name', 'Last name'],
                ['Email', 'Phone number']
              ]}
              textArea={'Tell us more about what you\'re looking for'}
              button='Connect with team'
            >
              Connect Door is a residential leasing company that assists those in search of
              their new home. Please fill out the form below to connect with one of our
              leasing agents. We&#39;ll be in touch within 24 hours.
            </Form>
          </Segment>

          <Segment id='process' vertical basic>
            <Container className='container-items' text>
              <Header as='h3' textAlign='center'>The Process</Header>
              <Item.Group divided relaxed>
                <Item>
                  <Item.Image
                    src={images.lookingAtLaptop.fluid.src}
                    size='medium'
                    rounded
                    label={{
                      content: '#1', ribbon: true, className: 'process-label', size: 'huge'
                    }}
                  />
                  <Item.Content verticalAlign='middle'>
                    <Item.Header>Connect</Item.Header>
                    <Item.Description>
                      Connect with one of our leasing agents so that we can understand your needs
                      in regards to timing, location(s), desired size, budget, etc.
                    </Item.Description>
                  </Item.Content>
                </Item>
                <Item>
                  <Item.Image
                    className='darken-25'
                    src={images.forklift.fluid.src}
                    size='medium'
                    rounded
                    label={{
                      content: '#2', ribbon: true, className: 'process-label', size: 'huge'
                    }}
                  />
                  <Item.Content verticalAlign='middle'>
                    <Item.Header>Tour</Item.Header>
                    <Item.Description>
                      Allow us to do the heavy-lifting with arranging and organizing a tour.
                    </Item.Description>
                  </Item.Content>
                </Item>
                <Item>
                  <Item.Image
                    className='darken-25'
                    src={images.checklist.fluid.src}
                    size='medium'
                    rounded
                    label={{
                      content: '#3', ribbon: true, className: 'process-label', size: 'huge'
                    }}
                  />
                  <Item.Content verticalAlign='middle'>
                    <Item.Header>Evaluate</Item.Header>
                    <Item.Description>
                      You let us know which you like best and checks all of the boxes.
                    </Item.Description>
                  </Item.Content>
                </Item>
                <Item>
                  <Item.Image
                    className='darken-25'
                    src={images.contract.fluid.src}
                    size='medium'
                    rounded
                    label={{
                      content: '#4', ribbon: true, className: 'process-label', size: 'huge'
                    }}
                  />
                  <Item.Content verticalAlign='middle'>
                    <Item.Header>Sign</Item.Header>
                    <Item.Description>
                      We&#39;ll arrange getting the lease and forms signed and
                      processed with the landlord.
                    </Item.Description>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Container>
            <Container text textAlign='center'>
              <Message compact floating size='huge'>
                <Message.Header>
                  <Label
                    content='#5'
                    horizontal
                    className='process-label'
                    size='huge'
                  />
                  You&#39;re all done, it&#39;s that easy!
                </Message.Header>
              </Message>
            </Container>

          </Segment>

          <Segment id='careers' vertical basic secondary>
            <Container text>
              <Header as='h3' textAlign='center'>Interested in Working for Us?</Header>
              <Header.Content>
                Connect Door was founded in 2018 with the goal and mission of serving others in
                their residential real estate needs. We are a free service to our clients.
                We only get compensated once we successfully locate and secure your next home.
                We are committed to first-class service and representation to our clients in
                order to ensure the experience is not only successful, but enjoyable.
              </Header.Content>
            </Container>
            <Container className='blurbs'>
              <IconContext.Provider value={{ color: '#749AD3', size: '4em' }}>
                <Grid relaxed columns={3} divided padded>
                  <Grid.Column>
                    <Blurb
                      icon={<FaMoneyBillWave />}
                      header='Potential for High Income'
                      headerAs='h4'
                    >
                      Our leasing agents benefit from a healthy income as a product of living
                      and practicing out our core mission and values by executing for our clients.
                      Compensation can vary in large sums, but ultimately can net a considerable
                      amount of money for those committed to helping.
                    </Blurb>
                  </Grid.Column>
                  <Grid.Column>
                    <Blurb
                      icon={<FaUser />}
                      header='Personal & Professional Enrichment'
                    >
                      The Connect Door management team is committed to investing in each of our
                      leasing agents in a variety of ways outside of the residential leasing arena.
                      Personal and professional development is a complement to the monetary
                      compensation that our leasing agents generate. Ultimately, this provides
                      additional tools and resources outside of the leasing space.
                    </Blurb>
                  </Grid.Column>
                  <Grid.Column>
                    <Blurb
                      icon={<FaChartLine />}
                      header='Autonomy & Growth'
                    >
                      We believe that our leasing agents are equipped and prepared to handle
                      more than most with the tools, training, and resources that we provide,
                      but ultimately what we provide is autonomy. This is an entrepreneurial
                      business - we hire, train, and ultimately trust individuals that we feel
                      are equipped to assist their clients in a fun, and successful manner, that
                      could do so with our without us.
                    </Blurb>
                  </Grid.Column>
                </Grid>
              </IconContext.Provider>
            </Container>
          </Segment>

          <Segment id='contact' vertical basic>
            <Form
              name='contact'
              header='Get in Contact With Us'
              fields={[
                ['First name', 'Last name'],
                ['Email', 'Phone number']
              ]}
              textArea='Your Message'
              button='Submit'
            >
              <Container textAlign='center'><SocialMediaIcons /></Container>
              We would love to hear from you! Whether it&#39;s interest in a job with us,
              a recommendation on something that we can do better, something we should add
              to our services, or simply stopping in to say hi - please give us a shout and
              we&#39;d love to connect.
            </Form>
          </Segment>

        </Segment>
        <Footer />
      </React.Fragment>
    )
  }
}

export default RootIndex

export const imageQuery = graphql`
  query {
    allContentfulAsset {
      edges {
        node {
          id
          title
          file {
            url
          }
          fluid(maxWidth: 613) {
            sizes
            src
            srcSet
            srcWebp
            srcSetWebp
          }
        }
      }
    }
  }
`

// export const pageQuery = graphql`
//   query HomeQuery {
//     allContentfulBlogPost(sort: { fields: [publishDate], order: DESC }) {
//       edges {
//         node {
//           title
//           slug
//           publishDate(formatString: "MMMM Do, YYYY")
//           tags
//           heroImage {
//             sizes(maxWidth: 350, maxHeight: 196, resizingBehavior: SCALE) {
//              ...GatsbyContentfulSizes_tracedSVG
//             }
//           }
//           description {
//             childMarkdownRemark {
//               html
//             }
//           }
//         }
//       }
//     }
//     allContentfulPerson(filter: { id: { eq: "" } }) {
//       edges {
//         node {
//           name
//           shortBio {
//             shortBio
//           }
//           title
//           heroImage: image {
//             sizes(
//               maxWidth: 1180
//               maxHeight: 480
//               resizingBehavior: PAD
//               background: "rgb:000000"
//             ) {
//               ...GatsbyContentfulSizes_tracedSVG
//             }
//           }
//         }
//       }
//     }
//   }
// `
