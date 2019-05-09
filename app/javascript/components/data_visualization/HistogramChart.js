import React, { Component } from 'react';
import {LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line} from 'recharts';
import {scaleLinear, scaleQuantize, scaleQuantile, scaleThreshold} from 'd3-scale'

const dateMatch = /^"[0-9]{4}-[0-9]{2}-[0-9]{2}/
const uuidMatch = /^([0-9a-f]{8})-/
const numberMatch = /^[0-9]*$/

export default class HistogramChart extends Component {
  constructor(props) {
    super(props);
    let {histogramBounds, formatter, labelFormatter} = this.histogramAndFormatter(this.props.data.histogram_bounds);
    let percentage = 100.0 / (histogramBounds.length - 1);
    let cumulativePercentage = [percentage];

    histogramBounds.forEach((value, index) => { cumulativePercentage.push(cumulativePercentage[index] + percentage)})

    this.data = histogramBounds.map((val, i) => { return { name: val, percentage, cumulativePercentage: cumulativePercentage[i] } })
    this.histogramBounds = histogramBounds;
    this.formatter = formatter;
    this.labelFormatter = labelFormatter;
  }

  histogramAndFormatter = (histogramBounds) => {
    let valueDistances = this.calculateValuesDistance(histogramBounds);

    let formatter = (value) => { return histogramBounds[valueDistances.indexOf(value)]};
    let labelFormatter = (value) => {
      // need to add the range
      let index = valueDistances.indexOf(value);
      return histogramBounds[index];
    };

    return {histogramBounds: valueDistances, formatter, labelFormatter};
  }

  calculateValuesDistance = (histogramValues) => {
    let firstValue = histogramValues[0].toLowerCase();

    if(firstValue.match(dateMatch)) {
      return histogramValues.map(val => { return new Date(val.replace(/"/g, '')).getTime() });
    } else if(firstValue.match(uuidMatch)) {
      return histogramValues.map(val => this.uuidValueDistance(val));
    } else if(firstValue.match(numberMatch)) {
      return histogramValues.map(val => parseInt(val));
    } else {
      return histogramValues.map(val => this.genericStringValueDistance(val));
    }
  }

  uuidValueDistance = (string) => {
    let [match, uuidStart] = string.match(uuidMatch);
    return parseInt(`0x${uuidStart}`);
  }

  genericStringValueDistance = (string) => {
    let validChars = string.toLowerCase().replace(/[^a-z0-9]+/g, '');

    let result = 0;
    for (let i = 0; i < 5; ++i) {
      let charCode = validChars.charCodeAt(i) || 0;
      if(charCode >= 97) { // any char between a-z
        result += charCode - 97 + 11;
      } else if(charCode == 0) { // no char available
        result += 0
      } else { // numeric char
        result += charCode - 48 + 1;
      }
      result *= 36;
    }
    return result;
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
