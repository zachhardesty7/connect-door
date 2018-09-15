import React from 'react'
import {
  Button,
  Container,
  Header,
  Icon,
  Segment
} from 'semantic-ui-react'

import './Hero.scss'

export default () => (
  <Segment
    vertical
    id='hero'
  >
    <Container>
      <Header
        as='h1'
        content='CONNECT DOOR'
      />
      <Header
        as='h2'
        content='Allow us to connect you to your dream home.'
      />
      <Button basic inverted size='huge'>
        Search Properties
        <Icon name='right arrow' />
      </Button>
    </Container>

  </Segment>
)
