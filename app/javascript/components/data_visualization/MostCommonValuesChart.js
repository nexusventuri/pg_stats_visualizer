import React, { Component } from 'react';
import {BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer} from 'recharts';

export default class MostCommonValuesChart extends Component {
  constructor(props) {
    super(props);
    const {most_common_vals, most_common_freqs} = this.props.data;
    let values = this.valueToArray(most_common_vals);
    let freq = this.valueToArray(most_common_freqs);

    this.data = values.map((value, index) => {
        return { name: value, freq: (freq[index] * 100) };
    });
  }

  valueToArray(value) {
    return value.substring(1, value.length -1).split(',');
  }

  render () {
    return (
      <ResponsiveContainer width='100%' height={200}>
        <BarChart data={this.data} margin={{top: 5, right: 30, left: 20, bottom: 5}} >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={this.tooltipFormatter} />
          <Bar dataKey="freq" fill='#8884d8' />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  tooltipFormatter(value, name,  props) {
    return value + "%";
  }
}
