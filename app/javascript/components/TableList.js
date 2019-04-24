import React, { Component } from 'react';
import {Accordion, Icon, Loader} from 'semantic-ui-react'
import TableMetadata from './TableMetadata'

export default class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      loadedIndexes: [],
      tableMetadata: []
    }
  }

  handleClick = (e, titleProps) => {
    const { index, table, schema } = titleProps;
    this.setState( { activeIndex: index, tableMetadata: [] } );
    fetch(`/api/v1/table/pg_stats`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({table, schema, databaseUrl: this.props.databaseUrl})
    }).then(response => {
      return response.json();
    }).then(data => {
      this.setState({tableMetadata: data});
    })
  }

  render () {
    let { activeIndex } = this.state;
    let content = this.props.tables.map(({table_schema, table_name}, index) => {
      return (
        <div key={index}>
          <Accordion.Title active={activeIndex === index} table={table_name} schema={table_schema} index={index} onClick={this.handleClick}>
            <Icon name="dropdown" />
            {table_schema}.{table_name}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === index}>
            {
              this.state.tableMetadata.length === 0 ?
              <Loader active inline='centered' /> :
              <TableMetadata data={this.state.tableMetadata} />
            }
          </Accordion.Content>
        </div>
      );
    })

    return(
      <Accordion fluid styled>
        {content}
      </Accordion>
    )
  }
}
