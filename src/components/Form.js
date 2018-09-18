import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Form,
  Header
} from 'semantic-ui-react'

import './Form.scss'

class CustomForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    props.fields.forEach(fieldGroup => fieldGroup.forEach((field) => {
      this.state[this.process(field)] = ''
    }))
    if (props.textArea) this.state['field-text-area'] = ''
  }

  process = str => `field-${str.toLowerCase().replace(/\W/g, '-')}`

  encode = data => Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')

  handleSubmit = (evt) => {
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: this.encode({ 'form-name': 'contact', ...this.state })
    })
      .catch(err => console.log(err))

    evt.preventDefault()
  };

  handleChange = e => this.setState({ [e.target.id]: e.target.value });

  render() {
    const {
      name,
      header,
      headerAs,
      children,
      fields,
      textArea,
      button
    } = this.props

    return (
      <Container className='customForm' text>
        <Container text>
          <Header as={headerAs} textAlign='center'>{header}</Header>
          <Header.Content>
            {children}
          </Header.Content>
        </Container>
        <Form
          name={name}
          onSubmit={this.handleSubmit}
          data-netlify='true'
          data-netlify-honeypot='bot-field'
        >
          <input type='hidden' name='bot-field' />
          {fields.map(fieldGroup => (
            <Form.Group key={`group-${fieldGroup.join('-').toLowerCase().replace(/\W/g, '-')}`} widths='equal'>
              {fieldGroup.map(field => (
                <Form.Input
                  onChange={this.handleChange}
                  key={this.process(field)}
                  id={this.process(field)}
                  name={this.process(field)}
                  fluid
                  placeholder={field}
                />
              ))}
            </Form.Group>
          ))}
          {textArea && (
            <Form.TextArea
              id='field-text-area'
              name='field-text-area'
              autoHeight
              placeholder={textArea}
              style={{ minHeight: 125 }}
              onChange={this.handleChange}
            />
          )}
          <Form.Button type='submit'>{button}</Form.Button>
        </Form>
      </Container>
    )
  }
}

CustomForm.propTypes = {
  name: PropTypes.string,
  header: PropTypes.string,
  headerAs: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.element, PropTypes.string
    ]))
  ]),
  fields: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  textArea: PropTypes.oneOfType([
    PropTypes.string, PropTypes.bool
  ]),
  button: PropTypes.string
}

CustomForm.defaultProps = {
  name: '',
  header: '',
  headerAs: 'h3',
  children: [],
  fields: [[]],
  textArea: false,
  button: 'Submit'
}

export default CustomForm
