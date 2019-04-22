import React from 'react'
import {Container, Form} from 'semantic-ui-react'
import MyLineChart from './MyLineChart'

class App extends React.Component {
  render () {
    return (
      <Container>
        <Form>
          <Form.Input fluid label='Connection string' placeholder='Connection string' />
        </Form>
        <MyLineChart />
      </Container>
    )
  }
}
export default App
