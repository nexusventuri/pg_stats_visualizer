import React, {Component} from 'react'

import {Form, Grid, Container, Segment} from 'semantic-ui-react'

export default class Indexes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      left: {},
      right: {}
    };
  }

  handleChange = (event, {name, value}) => this.setState({[name]: value})

  handleLeftSubmit = () => {
    this.handleSubmit('left', '/api/v1/all_index_stats')
  }

  handleRightSubmit = () => {
    this.handleSubmit('right', '/api/v1/all_index_stats')
  }

  handleSubmit = (column, url) => {
    const databaseUrl = this.state[`${column}DatabaseUrl`];

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
            {this.renderForm('leftDatabaseUrl', this.handleChange, this.handleLeftSubmit)}
          </Grid.Column>
          <Grid.Column>
            {this.renderForm('rightDatabaseUrl', this.handleChange, this.handleRightSubmit)}
          </Grid.Column>
        </Grid.Row>
        {this.renderData()}
      </Grid>
    )
  }

  renderForm = (name, changeCallback, submitCallback) => {
    return (
    <Form onSubmit={submitCallback}>
      <Form.Group>
        <Form.Input name={name} placeholder='Connection string' onChange={changeCallback}/>
        <Form.Button>Submit</Form.Button>
      </Form.Group>
    </Form>
    );
  }

  renderData = () => {
    const leftIndexStats = this.state.left.all_index_stats
    const rightIndexStats = this.state.right.all_index_stats

    let dataset = (leftIndexStats || rightIndexStats || []);
    let leftDict = (leftIndexStats || []).reduce(this.convertToHash, {});
    let rightDict = (rightIndexStats || []).reduce(this.convertToHash, {});
    console.log(dataset.length, Object.keys(leftDict).length, Object.keys(rightDict).length);

    console.log(leftDict);

    return dataset.map((val, i) => {
      let leftVal = leftDict[this.indexHashToId(val)];
      let rightVal = rightDict[this.indexHashToId(val)]
      return (
        <Grid.Row key={i}>
          <Grid.Column>
            {this.renderIndexHash(leftVal, rightVal)}
          </Grid.Column>
          <Grid.Column>
            {this.renderIndexHash(rightVal, leftVal)}
          </Grid.Column>
        </Grid.Row>
      )
    })
  }

  convertToHash = (dict, value) => {
    dict[this.indexHashToId(value)] = value;
    return dict;
  }

  indexHashToId = (hash) => {
    return `${hash.schemaname}.${hash.tablename} ${hash.indexname}`;
  }

  renderIndexHash = (hash) => {
    if(!hash) {
      return '';
    }
    return `${hash.schemaname}.${hash.tablename} ${hash.indexname}(scans:${hash.number_of_scans}, read: ${hash.tuples_read}, fetched: ${hash.tuples_fetched}, size: ${hash.index_size})`;
  }
}
