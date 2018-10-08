import React from 'react'
import PropTypes from 'prop-types'
import GImage from 'gatsby-image'

import {
  Button,
  Container,
  Header,
  Segment
} from 'semantic-ui-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'

import './Hero.scss'

const Hero = ({
  title,
  subtitle,
  background,
  buttonText,
  buttonProps
}) => (
  <Segment
    vertical
    id='hero'
  >
    {/* background image */}
    <GImage
      fluid={background}
      style={{ position: `absolute` }}
      className='background'
    />

    <Container>
      <Header
        as='h1'
        content={title}
      />
      <Header
        as='h2'
        content={subtitle}
      />
      <Button {...buttonProps}>
        {buttonText}
        <FontAwesomeIcon icon={faAngleRight} className='button-icon' />
      </Button>
    </Container>
  </Segment>
)

Hero.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  buttonText: PropTypes.string,
  buttonProps: PropTypes.shape({
    basic: PropTypes.bool,
    inverted: PropTypes.bool,
    size: PropTypes.string
  })
}

Hero.defaultProps = {
  title: '',
  subtitle: '',
  buttonText: 'Click Here',
  buttonProps: {}
}

export default Hero
