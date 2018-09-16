import React from 'react'
import PropTypes from 'prop-types'
import { IconContext } from 'react-icons'
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa'

import './SocialMediaIcons.scss'

const SocialMediaIcons = ({ inverted }) => (
  <IconContext.Provider
    value={{
      size: '1.5em',
      className: `socialMediaIcons ${!!inverted && 'inverted'}`
    }}
  >
    <a href='https://instagram.com'><FaInstagram /></a>
    <a href='https://twitter.com'><FaTwitter /></a>
    <a href='https://facebook.com'><FaFacebook /></a>
  </IconContext.Provider>
)

SocialMediaIcons.propTypes = {
  inverted: PropTypes.bool
}

SocialMediaIcons.defaultProps = {
  inverted: false
}

export default SocialMediaIcons
