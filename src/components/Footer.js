import React from 'react'
import {
  Container,
  Grid,
  Segment,
  Header,
  List
} from 'semantic-ui-react'

import { IconContext } from 'react-icons'
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa'

import './Footer.scss'

const Footer = () => (
  <>
    <Segment inverted vertical style={{ padding: '5em 0em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='About' />
              <List link inverted>
                <List.Item as='a'>Sitemap</List.Item>
                <List.Item as='a'>Contact Us</List.Item>
                <List.Item as='a'>Religious Ceremonies</List.Item>
                <List.Item as='a'>Gazebo Plans</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Services' />
              <List link inverted>
                <List.Item as='a'>Banana Pre-Order</List.Item>
                <List.Item as='a'>DNA FAQ</List.Item>
                <List.Item as='a'>How To Access</List.Item>
                <List.Item as='a'>Favorite X-Men</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as='h4' inverted>
                Footer Header
              </Header>
              <p>
                Extra space for a call to action inside the footer that could help re-engage users.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
    <Segment inverted vertical>
      <Container>
        <Grid colums={2}>
          <Grid.Column id='attribution' width={8}>
            copyright &#169; 2018 connectdoor | designed and developed by
            {' '}
            <a href='https://zachhardesty.com'>Zach Hardesty</a>
          </Grid.Column>
          <Grid.Column width={8} floated='right' textAlign='right'>
            <IconContext.Provider
              value={{
                size: '1.5em',
                className: 'footerIcons'
              }}
            >
              <a href='https://instagram.com'><FaInstagram /></a>
              <a href='https://twitter.com'><FaTwitter /></a>
              <a href='https://facebook.com'><FaFacebook /></a>
            </IconContext.Provider>
          </Grid.Column>
        </Grid>
      </Container>
    </Segment>
  </>
)

export default Footer
