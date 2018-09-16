import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Input,
  Menu
} from 'semantic-ui-react'

import './Navigation.scss'

export default class Navigation extends React.Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state
    const {
      pages, logo, search, centered
    } = this.props
    return (
      <Container textAlign={centered && 'center'}>
        <Menu id='nav' compact text secondary>
          {logo && (
            <Menu.Item
              as='a'
              href='#'
              name=''
              onClick={this.handleItemClick}
            >
              {logo}
            </Menu.Item>
          )}

          {pages.map(page => (
            <Menu.Item
              as='a'
              name={page}
              href={`#${page.toLowerCase().replace(' ', '-')}`}
              active={activeItem === page}
              onClick={this.handleItemClick}
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
  search: PropTypes.bool,
  centered: PropTypes.bool,
  pages: PropTypes.arrayOf(PropTypes.string)
}

Navigation.defaultProps = {
  logo: {},
  search: false,
  centered: false,
  pages: []
}
