import React, { Component } from 'react';
import {LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line} from 'recharts';
import {scaleLinear, scaleQuantize, scaleQuantile, scaleThreshold} from 'd3-scale'

export default class HistogramChart extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.data.histogram_bounds, this.valueToArray(this.props.data.histogram_bounds));
    let histogramBounds = this.valueToArray(this.props.data.histogram_bounds);
    let percentage = 100.0 / histogramBounds.length;
    let cumulativePercentage = [0];

    histogramBounds.forEach((value, index) => { cumulativePercentage.push(cumulativePercentage[index] + percentage)})
    console.log(cumulativePercentage);

    this.data = histogramBounds.map((val, i) => { return { name: val, percentage, cumulativePercentage: cumulativePercentage[i] } })
    this.histogramBounds = histogramBounds;
  }

  valueToArray = (value) => {
    return value.substring(1, value.length -1).split(', ').map(val => parseInt(val));
  }

  render () {
    //var quantize = scaleQuantize(this.histogramBounds, [this.histogramBounds[0], this.histogramBounds[this.histogramBounds.length - 1]]);
    //console.log([this.histogramBounds[0], this.histogramBounds[this.histogramBounds.length - 1]])
    var quantile = scaleQuantile(this.histogramBounds, this.histogramBounds.map((x, i) => { return i; }));
    console.log('data', this.data);
    console.log('quantile', this.histogramBounds, this.histogramBounds.map((x, i) => { return i == 0 ? 0:1; }), quantile.quantiles())
    var linear = scaleLinear(this.histogramBounds, [0, 100]);
    //var threshold = scaleThreshold([0,100], this.histogramBounds);
    //console.log(this.data);
    return (
      <div key='play-around'>
        <LineChart width={800} height={300} data={this.data} margin={{top: 5, right: 30, left: 20, bottom: 5}} >
          <XAxis dataKey="name" scale={linear}/>
          <YAxis/>
          <Tooltip/>
          <Legend />
          <Line type="monotone" dataKey="cumulativePercentage" stroke="#8884d8"/>
        </LineChart>
      </div>
    );
        //<LineChart width={800} height={300} data={this.data} margin={{top: 5, right: 30, left: 20, bottom: 5}} >
        //  <XAxis dataKey="name" scale={quantize} />
        //  <YAxis/>
        //  <Tooltip/>
        //  <Legend />
        //  <Line type="monotone" dataKey="percentage" stroke="#8884d8"/>
        //</LineChart>
        //<LineChart width={800} height={300} data={this.data} margin={{top: 5, right: 30, left: 20, bottom: 5}} >
        //  <XAxis dataKey="name" scale={threshold}/>
        //  <YAxis/>
        //  <Tooltip/>
        //  <Legend />
        //  <Line type="monotone" dataKey="percentage" stroke="#8884d8"/>
        //</LineChart>
  }
}
