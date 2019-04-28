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

  renderPair(pair, index) {
    let [key, val] = pair;

    return (
      <List.Item key={index}>
        <List.Header>{key}</List.Header>
        {val}
      </List.Item>
    )
  }
}
