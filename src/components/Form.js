import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Form,
  Message,
  Transition,
  Header
} from 'semantic-ui-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faExclamation, faCheck } from '@fortawesome/free-solid-svg-icons'

import './Form.scss'

class CustomForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { success: false, error: false }
    const { name } = this.props

    props.fields.forEach((field) => {
      if (!field.includes(';')) { this.state[`${name}-${this.process(field)}`] = '' } else { this.state[`${name}-${this.process(field.slice(0, field.indexOf('(')))}`] = '' }
    })
    if (props.textArea) this.state[`${name}-field-text-area`] = ''
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

      this.setState({ ...newState, success: true, error: false })

      this.removeSuccessMessage()
    }

    evt.preventDefault()
  }

  handleChange = (e, { id, value }) => { this.setState({ [id]: value }) }

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
                {fieldGroup.map((field) => {
                  if (field.includes(';')) {
                    const title = field.slice(0, field.indexOf('(')) // get title
                    let options = field.slice(field.indexOf('(') + 1, field.indexOf(')')) // remove title
                    options = options.split('; ') // -> arr
                    options = options.map(op => ({ // --> arr of obj
                      text: op,
                      value: op
                    }))

                    return (
                      <Form.Select
                        error={state.error && state[`${name}-${this.process(title)}`] === ''}
                        id={`${name}-${this.process(title)}`}
                        key={`${name}-${this.process(title)}`}
                        fluid
                        placeholder={title}
                        label={title}
                        onChange={this.handleChange}
                        value={state[`${name}-${this.process(title)}`]}
                        options={options}
                        icon={<FontAwesomeIcon icon={faCaretDown} pull='right' title='Instagram' />}
                      />
                    )
                  }
                  return (
                    <Form.Input
                      error={state.error && state[`${name}-${this.process(field)}`] === ''}
                      id={`${name}-${this.process(field)}`}
                      key={this.process(field)}
                      fluid
                      placeholder={field}
                      label={field}
                      onChange={this.handleChange}
                      value={state[`${name}-${this.process(field)}`]}
                    />
                  )
                })}
              </Form.Group>
            ))
          }
          {textArea && (
            <Form.TextArea
              id={`${name}-field-text-area`}
              error={state.error && state[`${name}-field-text-area`] === ''}
              autoHeight
              placeholder='Message'
              label={textArea}
              style={{ minHeight: 125 }}
              onChange={this.handleChange}
              value={state[`${name}-field-text-area`]}
            />
          )}

          <Transition.Group className='form-messages' animation='fade down' duration={500}>
            {state.success && (
              <Message icon success className='form-message'>
                <FontAwesomeIcon icon={faCheck} size='2x' className='icon-message' title='Instagram' />
                <Message.Content>
                  <Message.Header>Form Submitted</Message.Header>
                    You&#39;ll hear back from our team shortly!
                </Message.Content>
              </Message>
            )}
            {state.error && (
              <Message icon error className='form-message'>
                <FontAwesomeIcon icon={faExclamation} size='2x' className='icon-message' title='Instagram' />
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
  children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  fields: PropTypes.arrayOf(PropTypes.string),
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
