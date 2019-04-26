import React, { Component } from 'react';
import {LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line} from 'recharts';

export default class HistogramChart extends Component {
  constructor(props) {
    super(props);
    let histogramBounds = this.valueToArray(this.props.histogram_bounds);
    let percentage = 100.0 / histogramBounds.length;

    this.data = histogramBounds.map((val) => { {name: val, percentage} })
  }

  valueToArray = (value) => {
    return value.substring(1, value.length -1).split(',');
  }

  render () {
    return (
      <LineChart width={600} height={300} data={this.data} margin={{top: 5, right: 30, left: 20, bottom: 5}} >
        <XAxis dataKey="name"/>
        <YAxis/>
        <Tooltip/>
        <Legend />
        <Line type="monotone" dataKey="percentage" stroke="#8884d8"/>
      </LineChart>
    );
  }
}
