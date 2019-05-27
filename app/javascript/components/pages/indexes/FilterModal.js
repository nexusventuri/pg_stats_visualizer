import React, {Component} from 'react'
import {Button, Modal, Form} from 'semantic-ui-react'

export default class FilterModal extends Component {
  constructor(props) {
    super(props);
    console.log('modal constructor called')
    this.state = {
      test: 10
    }
  }

  handleChange = (event, {name, value}) => this.setState({[name]: value})

  filter =

  render() {
    let leftIndexStats = this.state.left.all_index_stats || [];
    const totalCount = leftIndexStats.length;

    leftIndexStats = this.filterIndexStats(this.state.left.all_index_stats);
    const filteredCount = leftIndexStats.length;

    return (
      <Modal trigger={<Button>Show Modal</Button>}>
        <Modal.Header>Select filters</Modal.Header>
          <Form.Input
            label={`Filter by the total number of scans: ${this.state.scansFilter}, showing ${filteredCount} indexes out of ${totalCount}`}
            min={0}
            max={100000}
            name='scansFilter'
            onChange={this.handleChange}
            step={1000}
            type='range'
            value={this.state.ScansFilter}
          />
        </Modal.Content>
      </Modal>
    )
  }
}
