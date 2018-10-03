import React from 'react'
import PropTypes from 'prop-types'

import { Header } from 'semantic-ui-react'

const Blurb = ({
  icon,
  header,
  headerAs,
  content,
  children
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
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.element, PropTypes.string
    ]))
  ])
}

Blurb.defaultProps = {
  icon: '',
  header: '',
  headerAs: 'h4',
  children: []
}

export default Blurb
