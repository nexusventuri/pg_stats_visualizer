import React from 'react'
import {Container, Form} from 'semantic-ui-react'

class App extends React.Component {
  render () {
    return (
      <Container>
        <Form>
          <Form.Input fluid label='Connection string' placeholder='Connection string' />
        </Form>
      </Container>
    )
  }
}
export default App
