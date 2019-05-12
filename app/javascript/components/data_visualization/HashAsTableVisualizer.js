import React from 'react'
import { Table } from 'semantic-ui-react'

export default class HashAsTableVisualizer extends React.Component {
  render() {
    return (
      <Table>
        <Table.Body>
          { Object.entries(this.props.data).map(this.renderPair) }
        </Table.Body>
      </Table>
    )
  }

  renderPair = (pair, index) => {
    let [key, val] = pair;

    return (
      <Table.Row>
        <Table.Cell><b>{key}</b></Table.Cell>
        <Table.Cell>{this.renderValue(val)}</Table.Cell>
      </Table.Row>
    )
  }

  renderValue = (value) => {
    if(Array.isArray(value)) {
      return `[${value.map(v => this.renderValue(v)).join(', ')}]`;
    } else if (typeof value === 'string' || value instanceof String) {
      return `"${value}"`;
    } else {
      return value;
    }
  }
}
