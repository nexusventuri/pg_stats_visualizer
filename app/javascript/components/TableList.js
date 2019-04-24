import React, { Component } from 'react';
import {Accordion, Icon} from 'semantic-ui-react'

export default class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      loadedIndexes: []
    }
  }

  handleClick = (e, titleProps) => {
    const { index, table, schema } = titleProps;
    console.log(table, schema);
    this.setState( { activeIndex: index } );
    fetch('/api/v1/table/pg_stats', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({table, schema})
    }).then(response => {
      debugger;
      return response.json();
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
          placeholder for {table_name}
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
