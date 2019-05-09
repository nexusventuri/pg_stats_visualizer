import React from 'react'
import { List } from 'semantic-ui-react'

export default class RawDataVisualizer extends React.Component {
  render() {
    return (
      <List>
        { Object.entries(this.props.data).map(this.renderPair) }
      </List>
    )
  }

  renderPair = (pair, index) => {
    let [key, val] = pair;

    return (
      <List.Item key={index}>
        <List.Header>{key}</List.Header>
        {this.renderValue(val)}
      </List.Item>
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
