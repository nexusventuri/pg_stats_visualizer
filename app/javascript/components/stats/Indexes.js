import React, {Component} from 'react'

import {Form, Grid, Container, Segment} from 'semantic-ui-react'

export default class Indexes extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = (event, {name, value}) => this.setState({[name]: value})

  handleLeftSubmit = () => {
    this.handleSubmit('left', '/api/v1/all_index_stats')
  }

  handleRightSubmit = () => {
    this.handleSubmit('left', '/api/v1/all_index_stats')
  }

  handleSubmit = (column, url) => {
    const { databaseUrl } = this.state;

    this.setState({loading: true});

    fetch(url, {
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
      let columnData = {}
      columnData[column] = data
      this.setState(columnData)
    })
  }

  render() {
    if(!this.props.active) {
      return (<div></div>);
    }
    return (
      <Grid columns={2} container divided stackable>
        <Grid.Row>
          <Grid.Column>
            {this.renderForm(this.handleChange, this.handleLeftSubmit)}
          </Grid.Column>
          <Grid.Column>
            {this.renderForm(this.handleChange, this.handleRightSubmit)}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  renderForm = (changeCallback, submitCallback) => {
    return (
    <Form onSubmit={submitCallback}>
      <Form.Group>
        <Form.Input name='databaseUrl' placeholder='Connection string' onChange={changeCallback}/>
        <Form.Button>Submit</Form.Button>
      </Form.Group>
    </Form>
    );
  }
}
