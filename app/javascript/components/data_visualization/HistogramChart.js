import React, { Component } from 'react';
import {LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line} from 'recharts';
import {scaleLinear, scaleQuantize, scaleQuantile, scaleThreshold} from 'd3-scale'
import HistogramMap from './HistogramMap'


const uuidTypes = ['uuid']
const dateTypes = ["date", "timestamp without time zone", "timestamp with time zone", "time without time zone"]
const intTypes = ["bigint", "smallint", "oid", "integer"]
const floatTypes = ["money", "real","numeric", "double precision"]
const booleanTypes = ['boolean']


export default class HistogramChart extends Component {
  constructor(props) {
    super(props);
    let map = this.histogramAndFormatter(this.props.data);

    this.data = map.keys().map((val, i) => { return { name: val, cumulativePercentage: map.cumulativePercentage()[i] } })
    this.histogramBounds = map.keys();
    this.formatter = map.formatter;
    this.labelFormatter = map.labelFormatter;
  }

  histogramAndFormatter = (columnData) => {
    let {histogram_bounds, data_type} = columnData;
    return HistogramMap.fromHistogramBounds(histogram_bounds, data_type);
  }

  tooltipFormatter(value, name,  props) {
    return value + "%";
  }

  render () {
    var linear = scaleLinear(this.histogramBounds, [0, 100]);
    return (
      <LineChart width={800} height={300} data={this.data} margin={{top: 5, right: 30, left: 20, bottom: 5}} >
        <XAxis dataKey="name" scale={linear} tickFormatter={this.formatter}/>
        <YAxis/>
        <Tooltip labelFormatter={this.labelFormatter} formatter={this.tooltipFormatter}/>
        <Legend />
        <Line type="monotone" dataKey="cumulativePercentage" stroke="#8884d8"/>
      </LineChart>
    );
  }
}
