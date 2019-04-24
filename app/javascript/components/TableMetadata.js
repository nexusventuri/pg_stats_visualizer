import React, { Component } from 'react';

export default class TableMetadata extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let rows_view = this.props.data.map(row => {
      return (
        <div>
          {row.attname}
        </div>);
    });
    return (<div>{rows_view}</div>)
  }
}
