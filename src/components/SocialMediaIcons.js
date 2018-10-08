import React from 'react'
import PropTypes from 'prop-types'

import { Container } from 'semantic-ui-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'

import './SocialMediaIcons.scss'

const SocialMediaIcons = ({ inverted }) => (
  <Container className={`socialMediaIcons ${!!inverted && 'inverted'}`}>
    <a href='https://www.facebook.com/theconnectdoor/' rel='noopener noreferrer' target='_blank'>
      <FontAwesomeIcon icon={faFacebook} className='button-icon' size='lg' title='Facebook' />
    </a>
    <a href='https://twitter.com/ConnectDoor' rel='noopener noreferrer' target='_blank'>
      <FontAwesomeIcon icon={faTwitter} className='button-icon' size='lg' title='Twitter' />
    </a>
    <a href='https://instagram.com/ConnectDoor' rel='noopener noreferrer' target='_blank'>
      <FontAwesomeIcon icon={faInstagram} className='button-icon' size='lg' title='Instagram' />
    </a>
  </Container>
)

SocialMediaIcons.propTypes = {
  inverted: PropTypes.bool
}

SocialMediaIcons.defaultProps = {
  inverted: false
}

export default SocialMediaIcons
