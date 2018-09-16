import React from 'react'
import get from 'lodash/get'
import Helmet from 'react-helmet'
// import { Link } from 'gatsby'
// import Hero from '../components/hero'
// import ArticlePreview from '../components/article-preview'
import { IconContext } from 'react-icons'
import { FaHandshake, FaUserClock } from 'react-icons/fa'
import { MdHeadset } from 'react-icons/md'
import {
  Container,
  Grid,
  Segment,
  Header,
  Image,
  Card,
  Label,
  Message
} from 'semantic-ui-react'
// import 'semantic-ui/dist/semantic.min.css'

import './index.scss'

import {
  Blurb,
  Navigation,
  Logo,
  Hero,
  Footer,
  Form
} from '../components'

class RootIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    // const posts = get(this, 'props.data.allContentfulBlogPost.edges')
    // const [author] = get(this, 'props.data.allContentfulPerson.edges')
    return (
      <React.Fragment>
        <Helmet title={siteTitle} />
        <Navigation
          logo={<Logo />}
          pages={['About', 'Process', 'Careers', 'Contact']}
        />
        <Hero
          title='CONNECT DOOR'
          subtitle='Allow us to connect you to your dream home.'
          buttonText='Search Properties'
          buttonProps={{ basic: true, inverted: true, size: 'huge' }}
        />
        {/* REVIEW: use a Segment.Group? */}
        <Segment id='home' vertical basic>

          <Segment id='process' textAlign='center' vertical basic>
            <Container>
              <Header as='h3'>The Proccess</Header>
              <Card.Group centered>
                <Card>
                  <Image
                    src='https://via.placeholder.com/650x650'
                    label={{
                      content: '#1', ribbon: true, className: 'process-label', size: 'huge'
                    }}
                  />
                  <Card.Content>
                    <Card.Header>
                      Connect with one of our leasing agents so that we can understand your needs
                      in regards to timing, location(s), desired size, budget, etc.
                    </Card.Header>
                  </Card.Content>
                </Card>
                <Card>
                  <Image
                    src='https://via.placeholder.com/650x650'
                    label={{
                      content: '#2', ribbon: 'right', className: 'process-label', size: 'huge'
                    }}
                  />
                  <Card.Content>
                    <Card.Header>
                      Allow us to do the heavy-lifting with arranging and organizing a tour.
                    </Card.Header>
                  </Card.Content>
                </Card>
              </Card.Group>
              <Card.Group centered>
                <Card>
                  <Image
                    src='https://via.placeholder.com/650x650'
                    label={{
                      content: '#3', ribbon: true, className: 'process-label', size: 'huge'
                    }}
                  />
                  <Card.Content>
                    <Card.Header>
                      You let us know which you like best and checks all of the boxes.
                    </Card.Header>
                  </Card.Content>
                </Card>
                <Card>
                  <Image
                    src='https://via.placeholder.com/650x650'
                    label={{
                      content: '#4', ribbon: 'right', className: 'process-label', size: 'huge'
                    }}
                  />
                  <Card.Content>
                    <Card.Header>
                      We&#39;ll arrange getting the lease and forms signed and
                      processed with the landlord.
                    </Card.Header>
                  </Card.Content>
                </Card>
              </Card.Group>
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

          <Segment id='mission' vertical secondary basic>
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
          <Container id='blurbs'>
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
                    and easy search experience. Utilizing our in-house resources, we realiably
                    improve the user experience and execution.
                  </Blurb>
                </Grid.Column>
              </Grid>
            </IconContext.Provider>
          </Container>
        </Segment>
        <Footer />
      </React.Fragment>

    )
  }
}

export default RootIndex

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
//     allContentfulPerson(filter: { id: { eq: "c15jwOBqpxqSAOy2eOO4S0m" } }) {
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
