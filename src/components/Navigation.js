import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-scroll'
import GImage from 'gatsby-image'
import {
  Container,
  Input,
  Menu
} from 'semantic-ui-react'

import './Navigation.scss'

export default class Navigation extends React.Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  calcDuration = (scrollDistanceInPx) => {
    const min = 800
    const max = 2000

    return Math.min(Math.max(Math.abs(scrollDistanceInPx), min), max)
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { activeItem } = this.state // REVIEW: stick header?
    const {
      pages,
      logo,
      logoAlt,
      search,
      centered
    } = this.props

    return (
      <Container textAlign={centered && 'center'}>
        <Menu id='nav' size='large' compact stackable text secondary>
          {logo && (
            <Menu.Item
              as={Link}
              to=''
              key='logo'
              spy
              smooth
              duration={this.calcDuration}
              tabIndex='0'
              name=''
            >
              <GImage fluid={logo} alt={logoAlt} className='logo' />
            </Menu.Item>
          )}

          {pages.map(page => (
            <Menu.Item
              as={Link}
              to={`${page.toLowerCase().replace(' ', '-')}`}
              key={`${page.toLowerCase().replace(' ', '-')}`}
              spy
              smooth
              duration={this.calcDuration}
              tabIndex='0'
              name={page}
            />
          ))}

          {search && (
            <Menu.Menu position='right'>
              <Menu.Item>
                <Input icon='search' placeholder='Search Properties...' />
              </Menu.Item>
            </Menu.Menu>
          )}
        </Menu>
      </Container>
    )
  }
}

Navigation.propTypes = {
  logo: PropTypes.oneOfType([
    PropTypes.element, PropTypes.object
  ]),
  logoAlt: PropTypes.string,
  search: PropTypes.bool,
  centered: PropTypes.bool,
  pages: PropTypes.arrayOf(PropTypes.string)
}

Navigation.defaultProps = {
  logo: {},
  logoAlt: '',
  search: false,
  centered: false,
  pages: []
}
