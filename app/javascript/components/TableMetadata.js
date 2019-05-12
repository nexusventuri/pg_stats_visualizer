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
    let tableColumnsRenderer = this.props.data.map(this.renderTableColumn);

    return ( <div>{tableColumnsRenderer}</div>);
  }

  renderTableColumn = (tableColumn, key) => {
    return (
      <Container key={key} style={{ paddingBottom: '5em' }}>
        <Header as='h4' attached='top' block>{tableColumn.attname}</Header>
        <Segment attached style={{paddingLeft: 0, paddingRight: 0}}>
          {this.renderTabs(tableColumn)}
        </Segment>
      </Container>
    );
  }

  renderTabs = (tableColumn) => {
    const panes = [
      this.histogramTab(tableColumn),
      this.mostCommonValuesTab(tableColumn),
      this.rawDataTab(tableColumn)
    ].filter(pane => pane != null);

    return ( <Tab panes={panes} /> );
  }

  mostCommonValuesTab = (tableColumn) => {
    if(tableColumn.most_common_vals === null) {
      return null;
    }

    return {menuItem: 'Most common values', render: () => <MostCommonValuesChart data={tableColumn} />}
  }

  histogramTab = (tableColumn) => {
    if(tableColumn.histogram_bounds === null) {
      return null;
    }
    return {menuItem: 'Histogram bounds', render: () => <HistogramChart data={tableColumn} />}
  }

  rawDataTab = (tableColumn) => {
    return {menuItem: 'Raw data', render: () => <RawDataVisualizer data={tableColumn} />}
  }
}
