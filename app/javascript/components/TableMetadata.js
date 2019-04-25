import React, { Component } from 'react';
import {Tab, Header} from 'semantic-ui-react'
import MostCommonValuesChart from './data_visualization/MostCommonValuesChart'
import RawDataVisualizer from './data_visualization/RawDataVisualizer'

//null_frac              | 0
//avg_width              | 4
//n_distinct             | -1
//most_common_vals       |
//most_common_freqs      |
//histogram_bounds       | {1,208,416,624,832,1039,1247,1455,1663,1870,2078,2286,2494,2701,2909,3117,3325,3532,3740,3948,4156,4363,4571,4779,4987,5195,5402,5610,5818,6026,6233,6441,6649,6857,7064,7272,7480,7688,7895,8103,8311,8519,8726,8934,9142,9350,9557,9765,9973,10181,10389,10596,10804,11012,11220,11427,11635,11843,12051,12258,12466,12674,12882,13089,13297,13505,13713,13920,14128,14336,14544,14751,14959,15167,15375,15583,15790,15998,16206,16414,16621,16829,17037,17245,17452,17660,17868,18076,18283,18491,18699,18907,19114,19322,19530,19738,19945,20153,20361,20569,20777}
//correlation            | 1
//most_common_elems      |
//most_common_elem_freqs |
//elem_count_histogram   |
export default class TableMetadata extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const panes = [
    ]
    let rows_view = this.props.data.map(this.renderRow);
    return (<div>{rows_view}</div>)
  }

  renderRow = (row) => {
    return (
      <div>
        <Header as='h3'>{row.attname}</Header>
        {this.renderTabs(row)}
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
    if(row.histogramBounds === null) {
      return null;
    }
    return {menuItem: 'Histogram bounds', render: () => 'Not yet implemented'}
  }

  rawDataTab = (row) => {
    return {menuItem: 'Raw data', render: () => <RawDataVisualizer data={row} />}
  }
}
