import React from 'react'
import PropTypes from 'prop-types'
import { IconContext } from 'react-icons'
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa'
import { Container } from 'semantic-ui-react'
import './SocialMediaIcons.scss'

const SocialMediaIcons = ({ inverted }) => (
  <Container>
    <IconContext.Provider
      value={{
        size: '1.5em',
        className: `socialMediaIcons ${!!inverted && 'inverted'}`
      }}
    >
      <a href='https://www.facebook.com/theconnectdoor/'><FaFacebook /></a>
      <a href='https://twitter.com/ConnectDoor'><FaTwitter /></a>
      <a href='https://instagram.com/ConnectDoor'><FaInstagram /></a>
    </IconContext.Provider>
  </Container>
)

SocialMediaIcons.propTypes = {
  inverted: PropTypes.bool
}

SocialMediaIcons.defaultProps = {
  inverted: false
}

export default SocialMediaIcons
