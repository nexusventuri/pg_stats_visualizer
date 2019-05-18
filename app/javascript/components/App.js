import React from 'react'
import {Container, Form, Loader, Header, Responsive, Menu} from 'semantic-ui-react'
import TableList from './TableList'
import Stats from './stats/Stats'
import HistogramChart from './data_visualization/HistogramChart'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tables: []
    };
  }

  render () {
    return (
      <Responsive>
        <Menu>
          <Menu.Item as='a' active>Stats</Menu.Item>
          <Menu.Item as='a' active>Indexes</Menu.Item>
        </Menu>
        <Stats />
      </Responsive>
    )
  }
}

export default App
