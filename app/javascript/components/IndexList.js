import React, { Component } from 'react';
import {Container, Header, Segment} from 'semantic-ui-react'
import HashAsTableVisualizer from './data_visualization/HashAsTableVisualizer'

export default class IndexList extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    const res = this.props.index_stats.map((indexData, key) => this.renderIndex(indexData, key));
    return (
      <Container style={{ paddingBottom: '5em' }} text>
        {res}
      </Container>
    )
  }

  renderIndex = (indexData, key) => {
    let {indexname, indexdef, ...data} = indexData
    return (
      <div key={key}>
        <Header as='h4' attached block>
        {indexname}
        </Header>
        <Segment attached>
        {indexdef}
        </Segment>
        <HashAsTableVisualizer data={data} attached />
      </div>
    )
  }
}
