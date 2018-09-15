import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import {
  Container,
  Input,
  Menu
} from 'semantic-ui-react'

export default class Navigation extends React.Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state
    const { pages, logo } = this.props
    return (
      <Container>
        <Menu id='nav' text secondary>
          {logo && (
            <Menu.Item
              as={Link}
              to='/'
              name=''
              onClick={this.handleItemClick}
            >
              {logo}
            </Menu.Item>
          )}

          {pages.map(page => (
            <Menu.Item
              as={Link}
              name={page}
              to={`/${page.toLowerCase()}/`}
              active={activeItem === page}
              onClick={this.handleItemClick}
            />
          ))}
          <Menu.Menu position='right'>
            <Menu.Item>
              <Input icon='search' placeholder='Search Properties...' />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </Container>
    )
  }
}

Navigation.propTypes = {
  logo: PropTypes.oneOfType([
    PropTypes.element, PropTypes.object
  ]),
  pages: PropTypes.arrayOf(PropTypes.string)
}

Navigation.defaultProps = {
  logo: {},
  pages: []
}
