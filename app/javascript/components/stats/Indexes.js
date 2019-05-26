import React, {Component} from 'react'

import {Form, Grid, Container, Table} from 'semantic-ui-react'

export default class Indexes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      left: {},
      right: {},
      scansFilter: Infinity
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
      <Container>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              {this.renderForm('leftDatabaseUrl', 'A', this.handleChange, this.handleLeftSubmit)}
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

  renderForm = (name, dbRef, changeCallback, submitCallback) => {
    return (
    <Form onSubmit={submitCallback}>
      <Form.Group>
        <Form.Input name={name} inline placeholder={`Connection string for DB ${dbRef}`} label={`DB ${dbRef}`} onChange={changeCallback}/>
        <Form.Button>Submit</Form.Button>
      </Form.Group>
    </Form>
    );
  }

  renderFilters = () => {
    let leftIndexStats = this.state.left.all_index_stats || [];
    let rightIndexStats = this.state.right.all_index_stats || [];
    const totalCount = Math.max(leftIndexStats.length, rightIndexStats.length)

    leftIndexStats = this.filterIndexStats(this.state.left.all_index_stats);
    rightIndexStats = this.filterIndexStats(this.state.right.all_index_stats);
    const filteredCount = Math.max(leftIndexStats.length, rightIndexStats.length)

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
    const rightIndexStats = this.filterIndexStats(this.state.right.all_index_stats);

    let dataset = (leftIndexStats.length > 0 ? leftIndexStats : rightIndexStats);
    dataset = dataset.reduce((map, val) => {
      const key = `${val.schemaname}.${val.tablename}`
      let indexes = (map.get(key) || []);
      indexes.push(this.indexId(val));
      map.set(key, indexes);
      return map;
    }, new Map())

    const leftDict = leftIndexStats.reduce(this.convertToHash, {});
    const rightDict = rightIndexStats.reduce(this.convertToHash, {});

    let lastRowTable = null;
    return Array.from(dataset, ([key, indexIds], i) => {
      let leftVal = null;
      let rightVal = null;

      let tableContent = indexIds.map((indexId, row) => {
        leftVal = leftDict[indexId];
        rightVal = rightDict[indexId];
        const indexName = ((leftVal && leftVal.indexname) || (rightVal && rightVal.indexname)).replace(/_/g, ' ')
        const indexDef = (leftVal && leftVal.indexdef) || (rightVal && rightVal.indexdef)
        const indexSize = (leftVal && leftVal.index_size) || (rightVal && rightVal.index_size)

        return (
          <Table.Row key={row}>
            <Table.Cell> {indexName} </Table.Cell>
            { leftVal ? <Table.Cell>{leftVal.number_of_scans}</Table.Cell> : null}
            { rightVal ? <Table.Cell>{rightVal.number_of_scans}</Table.Cell> : null}
            { leftVal ? <Table.Cell>{leftVal.tuples_read}</Table.Cell> : null}
            { rightVal ? <Table.Cell>{rightVal.tuples_read}</Table.Cell> : null}
            { leftVal ? <Table.Cell>{leftVal.tuples_fetched}</Table.Cell> : null}
            { rightVal ? <Table.Cell>{rightVal.tuples_fetched}</Table.Cell> : null}
            <Table.Cell>{indexSize}</Table.Cell>
            <Table.Cell>{indexDef}</Table.Cell>
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
              { leftVal ? <Table.HeaderCell>Scans A</Table.HeaderCell> : null}
              { rightVal ? <Table.HeaderCell>Scans B</Table.HeaderCell> : null}
              { leftVal ? <Table.HeaderCell>Read A</Table.HeaderCell> : null}
              { rightVal ? <Table.HeaderCell>Read B</Table.HeaderCell> : null}
              { leftVal ? <Table.HeaderCell>Fetched A</Table.HeaderCell> : null}
              { rightVal ? <Table.HeaderCell>Fetched B</Table.HeaderCell> : null}
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
