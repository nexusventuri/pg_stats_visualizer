import React, { Component } from 'react';
import {Tab, Header, Container, Segment} from 'semantic-ui-react'
import MostCommonValuesChart from './data_visualization/MostCommonValuesChart'
import RawDataVisualizer from './data_visualization/RawDataVisualizer'
import HistogramChart from './data_visualization/HistogramChart'

export default class TableMetadata extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let rowsRender = this.props.data.map(this.renderRow);

    return ( <div>{rowsRender}</div>);
  }

  renderRow = (row, key) => {
    return (
      <Container style={{ paddingBottom: '5em' }}>
        <Header as='h4' attached='top' block>{row.attname}</Header>
        <Segment attached style={{paddingLeft: 0, paddingRight: 0}}>
          {this.renderTabs(row)}
        </Segment>
      </Container>
    );
  }

  renderTabs = (row) => {
    const panes = [
      this.histogramTab(row),
      this.mostCommonValuesTab(row),
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
