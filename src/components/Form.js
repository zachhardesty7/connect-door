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
  <Container text>
    <Header id='blurbHeader' as={headerAs} textAlign='center'>{header}</Header>
    <Header.Content>
      {children}
    </Header.Content>
    <Form id='requestForm'>
      {fields.map(fieldGroup => (
        <Form.Group widths='equal'>
          {fieldGroup.map(field => (
            <Form.Input
              fluid
              id={`field-${field.toLowerCase().replace(' ', '-')}`}
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
  children: PropTypes.arrayOf(PropTypes.element),
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
