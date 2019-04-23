import React from 'react'
import {Container, Form, Loader} from 'semantic-ui-react'
import MyLineChart from './MyLineChart'
import TableList from './TableList'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tables: []
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
    }).then(response => {
      return response.json();
    }).then((data) => {
      this.setState({loading: false});
      this.setState({tables: data})
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
        { this.state.tables.length > 0 && <TableList databaseUrl={this.state.databaseUrl} tables={this.state.tables}/>}
      </Container>
    )
  }
}

        //<MyLineChart />
export default App
