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
    const { index } = titleProps;
    this.setState( { activeIndex: index } );
  }

  render () {
    let { activeIndex } = this.state;

    let content = this.props.tables.map(({table_schema, table_name}, index) => {
      return (
        <div key={index}>
          <Accordion.Title active={activeIndex === index} index={index} onClick={this.handleClick}>
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
