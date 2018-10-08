import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Form,
  Message,
  Transition,
  Icon,
  Header
} from 'semantic-ui-react'

import './Form.scss'

class CustomForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { success: false, error: false }

    props.fields.forEach((field) => {
      this.state[this.process(field)] = ''
    })
    if (props.textArea) this.state['field-text-area'] = ''
  }

  removeSuccessMessage = () => {
    setTimeout(() => {
      this.setState({ success: false })
    }, 6000)
  }

  process = str => `field-${str.toLowerCase().replace(/\W/g, '-')}`

  encode = data => Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')

  handleSubmit = (evt) => {
    const { state } = this

    if (Object.keys(state).some(key => state[key] === '')) {
      this.setState({ success: false, error: true })
    } else {
      fetch('/', { // eslint-disable-line no-undef
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.encode({ 'form-name': 'contact', ...state })
      })
        .catch(err => console.log(err)) // eslint-disable-line no-console

      const newState = {}

      Object.keys(state).forEach((key) => { newState[key] = '' })

      this.setState({ success: true, error: false, ...newState })

      this.removeSuccessMessage()
    }

    evt.preventDefault()
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

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

    const { state } = this

    return (
      <Container className='customForm' text>
        <Container text>
          <Header as={headerAs} textAlign='center'>{header}</Header>
          <Header.Content>{children}</Header.Content>
        </Container>
        <Form
          name={name}
          onSubmit={this.handleSubmit}
          data-netlify='true'
          data-netlify-honeypot='bot-field'
          success={state.success}
          error={state.error}
        >
          <input type='hidden' name='bot-field' />
          {fields
            .map((item, i) => (i % 2 === 0 && fields.slice(i, i + 2))) // group fields
            .filter(item => item) // remove false (null) entries
            .map(fieldGroup => (
              <Form.Group key={`group-${fieldGroup.join('-').toLowerCase().replace(/\W/g, '-')}`} widths='equal'>
                {fieldGroup.map(field => (
                  <Form.Input
                    error={state.error && state[this.process(field)] === ''}
                    key={this.process(field)}
                    name={this.process(field)}
                    fluid
                    placeholder={field}
                    onChange={this.handleChange}
                    value={state[this.process(field)]}
                  />
                ))}
              </Form.Group>
            ))
          }
          {textArea && (
            <Form.TextArea
              error={state.error && state['field-text-area'] === ''}
              name='field-text-area'
              autoHeight
              placeholder={textArea}
              style={{ minHeight: 125 }}
              onChange={this.handleChange}
              value={state['field-text-area']}
            />
          )}

          <Transition.Group className='form-messages' animation='fade down' duration={500}>
            {state.success && (
              <Message icon success className='form-message'>
                <Icon name='check' />
                <Message.Content>
                  <Message.Header>Form Submitted</Message.Header>
                    You&#39;ll hear back from our team shortly!
                </Message.Content>
              </Message>
            )}
            {state.error && (
              <Message icon error className='form-message'>
                <Icon name='x' />
                <Message.Content>
                  <Message.Header>Error</Message.Header>
                    Please fill out all fields!
                </Message.Content>
              </Message>
            )}
          </Transition.Group>

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
