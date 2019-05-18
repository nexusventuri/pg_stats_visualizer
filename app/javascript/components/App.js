import React from 'react'
import {Container, Form, Loader, Header, Responsive, Menu} from 'semantic-ui-react'
import TableList from './TableList'
import Stats from './stats/Stats'
import Indexes from './stats/Indexes'
import HistogramChart from './data_visualization/HistogramChart'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'stats'
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name.toLocaleLowerCase() })

  render () {
    let {activeItem} = this.state;
    return (
      <Responsive>
        <Menu>
          <Menu.Item as='a'
            name='Stats'
            active={activeItem == 'stats'}
            onClick={this.handleItemClick}
          />
          <Menu.Item as='a'
            name='Indexes'
            active={activeItem == 'indexes'}
            onClick={this.handleItemClick}
          />
        </Menu>
        <Stats active={activeItem == 'stats'}/>
        <Indexes active={activeItem == 'indexes'}/>
     </Responsive>
    )
  }
}

export default App
