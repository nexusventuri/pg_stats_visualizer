import React, {Component} from 'react'

import {Container, Form, Loader, Header, Responsive, Menu} from 'semantic-ui-react'

export default class Indexes extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(!this.props.active) {
      return (<div></div>);
    }
    return (
      <Container>
        something somethinng indexes
      </Container>
    )
  }
}
