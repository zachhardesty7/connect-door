import React from 'react'
import {
  Container,
  Grid,
  Segment
} from 'semantic-ui-react'

import SocialMediaIcons from './SocialMediaIcons'
import './Footer.scss'

const Footer = () => (
  <Segment inverted vertical id='bottom-bar'>
    <Container>
      <Grid columns={2} verticalAlign='middle'>
        <Grid.Column id='attribution' width={8}>
          copyright &#169; 2018 ConnectDoor | designed and developed by
          {' '}
          <a href='https://zachhardesty.com'>Zach Hardesty</a>
        </Grid.Column>
        <Grid.Column width={8} id='bottom-bar-icons' floated='right' textAlign='right'>
          <SocialMediaIcons inverted />
        </Grid.Column>
      </Grid>
    </Container>
  </Segment>
)

export default Footer
