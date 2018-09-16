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
  Header
} from 'semantic-ui-react'
// import 'semantic-ui/dist/semantic.min.css'

import './index.scss'

import {
  Blurb, Navigation, Logo, Hero, Footer
} from '../components'

class RootIndex extends React.Component {
  render() {
    // const { classes } = this.props

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
        <Segment id='home' vertical>
          <Container id='blurbHeader' text>
            <Header as='h3' textAlign='center'>Let&#39;s Talk What We Do.</Header>
            <Header.Content>
              Connect Door is a residential leasing service serving students, young professionals,
              and all others in search for their new home. We pride ourselves on service,
              reliability, and commitment. Allow us to show you!
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
              <Grid container>
                <Grid>
                  Connect Door is a residential leasing company that assists those in search of
                  their new home. Please fill out the form below to connect with one of our
                  leasing agents. We&#39;ll be in touch within 24 hours. Same drill - full name,
                  phone number, email address, and comment box where we could say
                  &quot;Tell us more about what you&#39;re looking for!
                </Grid>
                <Grid>
                  Form
                </Grid>
              </Grid>
              {/* <div className='wrapper'>
              <h2 className='section-headline'>Recent articles</h2>
              <ul className='article-list'>
                {posts.map(({ node }) => (
                <li key={node.slug}>
                  <ArticlePreview article={node} />
                </li>
              ))}
              </ul>
            </div> */}
            </IconContext.Provider>
          </Container>
          <Container id='process'>
            <Grid relaxed columns={3} divided padded>
              <Grid.Row width={4}>
              </Grid.Row>
              <Grid.Row width={4}>
              </Grid.Row>
              <Grid.Row width={4}>
              </Grid.Row>
            </Grid>
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
