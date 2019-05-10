import React, { Component } from 'react';
import {Tab, Header} from 'semantic-ui-react'
import MostCommonValuesChart from './data_visualization/MostCommonValuesChart'
import RawDataVisualizer from './data_visualization/RawDataVisualizer'
import HistogramChart from './data_visualization/HistogramChart'

export default class TableMetadata extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let rowsRender = this.props.data.map(this.renderRow);

    return (
      <div class="ui celled grid">
        {rowsRender}
      </div>);
  }

  renderRow = (row, key) => {
    return (
      <div key={key} class="row">
        <div class="two wide column">
          <Header as='h3'>{row.attname}</Header>
        </div>
        <div class="fourteen wide column">
          {this.renderTabs(row)}
        </div>
      </div>
    );
  }

  renderTabs = (row) => {
    const panes = [
      this.mostCommonValuesTab(row),
      this.histogramTab(row),
      this.rawDataTab(row)
    ].filter(pane => pane != null);

    return ( <Tab panes={panes} /> );
  }

  mostCommonValuesTab = (row) => {
    if(row.most_common_vals === null) {
      return null;
    }

    return {menuItem: 'Most common values', render: () => <MostCommonValuesChart data={row} />}
  }

  histogramTab = (row) => {
    if(row.histogram_bounds === null) {
      return null;
    }
    return {menuItem: 'Histogram bounds', render: () => <HistogramChart data={row} />}
  }

  rawDataTab = (row) => {
    return {menuItem: 'Raw data', render: () => <RawDataVisualizer data={row} />}
  }
}
