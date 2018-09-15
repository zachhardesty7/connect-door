import React from 'react'
import { Link } from 'gatsby'
import {
  Container,
  Input,
  Menu
} from 'semantic-ui-react'
import { Logo } from '.'

export default class Navigation extends React.Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state
    return (
      <Container>
        <Menu id='nav' text secondary>
          <Menu.Item
            as={Link}
            to='/'
            name=''
            onClick={this.handleItemClick}
          >
            <Logo />
          </Menu.Item>
          <Menu.Item
            as={Link}
            name='About'
            to='/about/'
            active={activeItem === 'About'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            as={Link}
            name='Process'
            to='/process/'
            active={activeItem === 'Process'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            as={Link}
            name='Careers'
            to='/careers/'
            active={activeItem === 'Careers'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            as={Link}
            name='Contact'
            to='/contact/'
            active={activeItem === 'Contact'}
            onClick={this.handleItemClick}
          />
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
