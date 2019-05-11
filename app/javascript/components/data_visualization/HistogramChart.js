import React, { Component } from 'react';
import {LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line} from 'recharts';
import {scaleLinear, scaleQuantize, scaleQuantile, scaleThreshold} from 'd3-scale'


const uuidTypes = ['uuid']
const dateTypes = ["date", "timestamp without time zone", "timestamp with time zone", "time without time zone"]
const intTypes = ["bigint", "smallint", "oid", "integer"]
const floatTypes = ["money", "real","numeric", "double precision"]
const booleanTypes = ['boolean']


export default class HistogramChart extends Component {
  constructor(props) {
    super(props);
    let {histogramBounds, formatter, labelFormatter} = this.histogramAndFormatter(this.props.data);
    let percentage = 100.0 / (histogramBounds.length - 1);
    let cumulativePercentage = [percentage];

    histogramBounds.forEach((value, index) => { cumulativePercentage.push(cumulativePercentage[index] + percentage)})

    this.data = histogramBounds.map((val, i) => { return { name: val, percentage, cumulativePercentage: cumulativePercentage[i] } })
    this.histogramBounds = histogramBounds;
    this.formatter = formatter;
    this.labelFormatter = labelFormatter;
  }

  histogramAndFormatter = (columnData) => {
    let {histogram_bounds, data_type} = columnData;
    let valueDistances = this.calculateValuesDistance(histogram_bounds, data_type);
    // TODO: remove this thing
    valueDistances = [...new Set(valueDistances)];

    let formatter = (value) => { return histogram_bounds[valueDistances.indexOf(value)]};
    let labelFormatter = (value) => {
      // need to add the range
      let index = valueDistances.indexOf(value);
      return histogram_bounds[index];
    };

    return {histogramBounds: valueDistances, formatter, labelFormatter};
  }

  calculateValuesDistance = (histogramValues, dataType) => {
    if(dateTypes.indexOf(dataType) >= 0) {
      return histogramValues.map(val => { return new Date(val).getTime() });
    } else if(uuidTypes.indexOf(dataType) >= 0) {
      return histogramValues.map(val => this.uuidValueDistance(val));
    } else if(intTypes.indexOf(dataType) >= 0) {
      return histogramValues.map(val => parseInt(val));
    } else if (floatTypes.indexOf(dataType) >= 0) {
      return histogramValues.map(val => parseFloat(val));
    } else if (booleanTypes.indexOf(dataType) >= 0) {
      return histogramValues.map(val => val == 't');
    } else {
      return histogramValues.map(val => { return this.genericStringValueDistance(val); });
    }
  }

  uuidValueDistance = (uuid) => {
    return parseInt(`0x${uuid}`);
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
