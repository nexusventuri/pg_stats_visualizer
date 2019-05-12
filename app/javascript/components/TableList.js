import React, { Component } from 'react';
import {Accordion, Icon, Loader} from 'semantic-ui-react'
import TableInformation from './TableInformation'

export default class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndexes: new Set([]),
      loadedIndexes: [],
      tableInformation: new Map([])
    }
  }

  handleClick = (e, titleProps) => {
    const { index, table, schema } = titleProps;
    ;

    this.setState( { activeIndexes: this.toggleActiveIndex(new Set(this.state.activeIndexes), index) } );

    if(this.state.tableInformation.has(index)) {
      return;
    }

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
      let tableInformation = new Map(this.state.tableInformation).set(index, data);
      this.setState({tableInformation});
    })
  }

  toggleActiveIndex(set, index) {
    set.has(index) ? set.delete(index) : set.add(index);
    return set;
  }

  render () {
    let content = this.props.tables.map(({table_schema, table_name}, index) => {
      return (
        <div key={index}>
          <Accordion.Title active={this.state.activeIndexes.has(index)} table={table_name} schema={table_schema} index={index} onClick={this.handleClick}>
          <Icon name="dropdown" />
          {table_schema}.{table_name}
          </Accordion.Title>
          {this.renderAccordionContent(index)}
        </div>
      );
    })

    return(
      <Accordion fluid styled>
      {content}
      </Accordion>
    )
  }

  renderAccordionContent = (index) => {
    if (this.state.activeIndexes.has(index)) {
      return (
        <Accordion.Content active={true}>
          {
            this.state.tableInformation.has(index) ?
              <TableInformation data={this.state.tableInformation.get(index)} /> :
              <Loader active inline='centered' />
          }
        </Accordion.Content>
      );
    }

    return <Accordion.Content />
  }
}
