import React, {Component} from 'react'

import {Form, Grid, Container, Table} from 'semantic-ui-react'

export default class Indexes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      left: {},
      right: {},
      scansFilter: Infinity,
      leftError: false
    };
  }

  handleChange = (event, {name, value}) => this.setState({[name]: value})

  handleLeftSubmit = () => {
    this.handleSubmit('left', '/api/v1/all_index_stats')
  }

  handleRightSubmit = () => {
    if(Object.keys(this.state.left).length == 0) {
      this.setState({leftError: true})
    } else {
      this.handleSubmit('right', '/api/v1/all_index_stats')
    }
  }

  handleSubmit = (column, url) => {
    const databaseUrl = this.state[`${column}DatabaseUrl`];
    if(!databaseUrl) {
      return;
    }

    this.setState({loading: true});
    this.setState({leftError: false});

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
      <Container>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              {this.renderForm('leftDatabaseUrl', 'A', this.handleChange, this.handleLeftSubmit, this.state.leftError)}
            </Grid.Column>
            <Grid.Column>
              {this.renderForm('rightDatabaseUrl', 'B', this.handleChange, this.handleRightSubmit)}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {this.renderFilters()}
        <Grid columns={2}>
          {this.renderData()}
        </Grid>
      </Container>
    )
  }

  renderForm = (name, dbRef, changeCallback, submitCallback, error) => {
    return (
    <Form onSubmit={submitCallback}>
      <Form.Group>
        <Form.Input name={name} inline placeholder={`Connection string for DB ${dbRef}`} label={`DB ${dbRef}`} onChange={changeCallback} error={error}/>
        <Form.Button>Submit</Form.Button>
      </Form.Group>
    </Form>
    );
  }

  renderFilters = () => {
    let leftIndexStats = this.state.left.all_index_stats || [];
    const totalCount = leftIndexStats.length;

    leftIndexStats = this.filterIndexStats(this.state.left.all_index_stats);
    const filteredCount = leftIndexStats.length;

    if(totalCount > 0) {
      return (
        <Grid.Column as={Form}>
          <Form.Input
            label={`Filter by the total number of scans: ${this.state.scansFilter}, showing ${filteredCount} indexes out of ${totalCount}`}
            min={0}
            max={100000}
            name='scansFilter'
            onChange={this.handleChange}
            step={1000}
            type='range'
            value={this.state.ScansFilter}
          />
        </Grid.Column>
      )
    }
    return '';
  }

  filterIndexStats = (index_stats) => {
    return (index_stats || []).filter(el => el.number_of_scans <= this.state.scansFilter)
  }

  renderData = () => {
    const leftIndexStats = this.filterIndexStats(this.state.left.all_index_stats);
    const rightIndexStats = (this.state.right.all_index_stats || []);
    const hasRightIndexStats = rightIndexStats.length > 0;

    let indexesGroupedByTable = leftIndexStats.reduce((map, val) => {
      const key = `${val.schemaname}.${val.tablename}`
      let indexes = (map.get(key) || []);
      indexes.push(this.indexId(val));
      map.set(key, indexes);
      return map;
    }, new Map())

    const leftDict = leftIndexStats.reduce(this.convertToHash, {});
    const rightDict = rightIndexStats.reduce(this.convertToHash, {});

    return Array.from(indexesGroupedByTable, ([key, indexIds], i) => {

      let tableContent = indexIds.map((indexId, row) => {
        let leftVal = leftDict[indexId];
        let rightVal = rightDict[indexId];

        return (
          <Table.Row key={row}>
            <Table.Cell> {leftVal.indexname.replace(/_/g, ' ')} </Table.Cell>
            <Table.Cell>{leftVal.number_of_scans}</Table.Cell>
            { hasRightIndexStats ? <Table.Cell>{rightVal.number_of_scans}</Table.Cell> : null}
            <Table.Cell>{leftVal.tuples_read}</Table.Cell>
            { hasRightIndexStats ? <Table.Cell>{rightVal.tuples_read}</Table.Cell> : null}
            <Table.Cell>{leftVal.tuples_fetched}</Table.Cell>
            { hasRightIndexStats ? <Table.Cell>{rightVal.tuples_fetched}</Table.Cell> : null}
            <Table.Cell>{leftVal.index_size}</Table.Cell>
            <Table.Cell>{leftVal.indexdef}</Table.Cell>
          </Table.Row>
        );
      })

      return (
        <Table celled structured key={i}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan='10'>Table {key}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Index name</Table.HeaderCell>
              <Table.HeaderCell>Scans A</Table.HeaderCell>
              { hasRightIndexStats ? <Table.HeaderCell>Scans B</Table.HeaderCell> : null}
              <Table.HeaderCell>Read A</Table.HeaderCell>
              { hasRightIndexStats ? <Table.HeaderCell>Read B</Table.HeaderCell> : null}
              <Table.HeaderCell>Fetched A</Table.HeaderCell>
              { hasRightIndexStats ? <Table.HeaderCell>Fetched B</Table.HeaderCell> : null}
              <Table.HeaderCell>Index Size</Table.HeaderCell>
              <Table.HeaderCell>Index Definition</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tableContent}
          </Table.Body>
        </Table>
      )
    })
  }

  convertToHash = (dict, value) => {
    dict[this.indexId(value)] = value;
    return dict;
  }

  indexId = (hash) => {
    return `${hash.schemaname}.${hash.tablename}#${hash.indexname}`;
  }
}
