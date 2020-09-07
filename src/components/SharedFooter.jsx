import React from 'react'
import styled from 'styled-components'

import {
  Flexbox,
  Footer,
  IconLink,
  getColor,
  getHoverColor,
  margin,
} from 'semantic-styled-ui'

const S = {}

S.Link = styled.a`
  ${margin('horizontal')('0.5em')};
  text-decoration: underline;
  ${getColor('light')};
  ${getHoverColor('white')};
`

export const SharedFooter = () => (
  <Footer inverted>
    <Footer.Content
      copyright='ConnectDoor'
      developerName='Zach Hardesty'
      developerLink='https://zachhardesty.com'
    />
    <Flexbox>
      <IconLink.Group light justify='end'>
        <IconLink name='facebook' link='https://www.facebook.com/theconnectdoor/' />
        <IconLink name='twitter' link='https://twitter.com/ConnectDoor/' />
        <IconLink name='instagram' link='https://instagram.com/ConnectDoor/' />
        <IconLink name='linkedin' link='https://www.linkedin.com/company/connect-door/' />
      </IconLink.Group>
    </Flexbox>
  </Footer>
)
