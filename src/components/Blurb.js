import React from 'react'
import PropTypes from 'prop-types'

import {
  Header,
  HeaderContent
} from 'semantic-ui-react'

const Blurb = ({
  icon,
  header,
  headerAs,
  children
}) => (
  <div>
    {icon}
    <Header as={headerAs} textAlign='center'>{header}</Header>
    <HeaderContent>
      {children}
    </HeaderContent>
  </div>
)

Blurb.propTypes = {
  icon: PropTypes.element,
  header: PropTypes.string,
  headerAs: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element)
}

Blurb.defaultProps = {
  icon: '',
  header: '',
  headerAs: 'h4',
  children: []
}

export default Blurb
