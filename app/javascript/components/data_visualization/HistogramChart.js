import React, { Component } from 'react';
import {LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ResponsiveContainer} from 'recharts';
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
    let {histogram_bounds, data_type} = this.props.data;
    this.map = HistogramMap.fromHistogramBounds(histogram_bounds, data_type);
  }

  labelFormatter = (value) => {
    let {previous, current} = this.map.labelData(value);
    if(previous) {
      return <span><b>{previous}</b> - <b>{current}</b></span>
    } else {
      return <span><b>{current}</b></span>
    }
  }

  render () {
    var linear = scaleLinear(this.map.keys, [0, 100]);
    return (
      <ResponsiveContainer width='100%' height={400}>
        <LineChart data={this.map.graphData()} margin={{top: 5, right: 30, left: 20, bottom: 5}} >
          <XAxis dataKey="name" scale={linear} tickFormatter={this.map.formatter}/>
          <YAxis/>
          <Tooltip labelFormatter={this.labelFormatter} formatter={this.map.tooltipFormatter}/>
          <Legend />
          <Line type="monotone" dataKey="cumulativePercentage" stroke="#8884d8"/>
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
