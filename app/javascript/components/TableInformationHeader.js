import React, { Component } from 'react';
import {Tab, Menu} from 'semantic-ui-react'
import HashAsTableVisualizer from './data_visualization/HashAsTableVisualizer'
import IndexList from './IndexList'

export default class TableInformationHeader extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    const panes = [
      this.pgStatUserTables(),
      this.pgStatioUserTables(),
      this.pgStatUserIndex()
    ]
    return (
      <Tab menu={{vertical: true, fluid: true}} panes={panes} style={{paddingBottom: '5em'}}/>
    )
  }

  pgStatUserTables = () => {
    return {
      menuItem: 'Stats (pg_stat_user_tables)',
      render: () => <HashAsTableVisualizer data={this.props.data.pg_stat_user_tables} />
    }
  }

  pgStatioUserTables = () => {
    return {
      menuItem: 'IO stats (pg_statio_user_tables)',
      render: () => <HashAsTableVisualizer data={this.props.data.pg_statio_user_tables} />
    }
  }

  pgStatUserIndex = () => {
    return {
      menuItem: 'Index Stats (pg_stat_user_indexes)',
      render: () => <IndexList index_stats={this.props.data.index_stats} />
    }
  }

}
