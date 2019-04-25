import React from 'react'
import { List } from 'semantic-ui-react'

export default class RawDataVisualizer extends React.Component {
  render() {
    <List.Item>
      <List.Header>New York City</List.Header>
      A lovely city
    </List.Item>
    return (
      <List>
        { Object.entries(this.props.data).map(this.renderPair) }
      </List>
    )
  }

  renderPair(pair) {
    let [key, val] = pair;

    return (
      <List.Item>
        <List.Header>{key}</List.Header>
        {val}
      </List.Item>
    )
  }
}
