import React from 'react'
import PropTypes from 'prop-types'

import { Header } from 'semantic-ui-react'

const Blurb = ({
  icon,
  header,
  headerAs,
  content
}) => (
  <div>
    {icon}
    <Header as={headerAs} textAlign='center'>{header}</Header>
    <Header.Content content={content} />
  </div>
)

Blurb.propTypes = {
  icon: PropTypes.element,
  header: PropTypes.string,
  headerAs: PropTypes.string,
  content: PropTypes.string
}

Blurb.defaultProps = {
  icon: '',
  header: '',
  headerAs: 'h4',
  content: ''
}

export default Blurb
