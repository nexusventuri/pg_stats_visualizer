import React from 'react';
import {Container, Form} from 'semantic-ui-react'

export default class TableVisualizer extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <Container>
        <Form>
          <Form.Input fluid label='Table' placeholder='Table' />
        </Form>
        <MyLineChart />
      </Container>
    )
  }
}
