import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Form,
  Header
} from 'semantic-ui-react'

import './Form.scss'

const CustomForm = ({
  header,
  headerAs,
  children,
  fields,
  textArea,
  button
}) => (
  <Container className='customForm' text>
    <Container text>
      <Header as={headerAs} textAlign='center'>{header}</Header>
      <Header.Content>
        {children}
      </Header.Content>
    </Container>
    <Form>
      {fields.map(fieldGroup => (
        <Form.Group key={`group-${fieldGroup.join('-').toLowerCase().replace(/\W/g, '-')}`} widths='equal'>
          {fieldGroup.map(field => (
            <Form.Input
              key={`field-${field.toLowerCase().replace(/\W/g, '-')}`}
              id={`field-${field.toLowerCase().replace(/\W/g, '-')}`}
              fluid
              placeholder={field}
            />
          ))}
        </Form.Group>
      ))}
      {textArea && (
        <Form.TextArea autoHeight placeholder={textArea} style={{ minHeight: 125 }} />
      )}
      <Form.Button type='submit'>{button}</Form.Button>
    </Form>
  </Container>
)

CustomForm.propTypes = {
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
  header: '',
  headerAs: 'h3',
  children: [],
  fields: [[]],
  textArea: false,
  button: 'Submit'
}

export default CustomForm
