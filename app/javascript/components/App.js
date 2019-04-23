import React from 'react'
import {Container, Form, Loader} from 'semantic-ui-react'
import MyLineChart from './MyLineChart'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  handleChange = (event, {name, value}) => this.setState({[name]: value})

  handleSubmit = () => {
    const { databaseUrl } = this.state;

    this.setState({loading: true});

    fetch('/api/v1/table', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({databaseUrl})
    }).then(() => {
      this.setState({loading: false});
    })
  }

  render () {
    return (
      <Container>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Input name='databaseUrl' placeholder='Connection string' onChange={this.handleChange}/>
            <Form.Button>Submit</Form.Button>
          </Form.Group>
        </Form>
        { this.state.loading && <Loader active inline='centered' /> }
      </Container>
    )
  }
}

        //<MyLineChart />
export default App
