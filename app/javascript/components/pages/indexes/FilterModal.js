import React, {Component} from 'react'
import {Grid, Container, Sticky, Button, Modal, Form, Icon} from 'semantic-ui-react'

export default class FilterModal extends Component {
  constructor(props) {
    super(props);
    console.log('modal constructor called')
    let defaultSettings = {
      scansFilter: Infinity
    }
    this.state = {
      modalOpen: false,
      localSettings: {...defaultSettings},
      settings: defaultSettings
    }
  }

  handleLocalChange = (event, {name, value}) => {
    let localSettings = this.state.localSettings;
    localSettings[name] = value;
    console.log('localSettings assignment', {localSettings})
    this.setState({localSettings});
  }

  handleOpen = () => {
    this.setState({ modalOpen: true, localSettings: {...this.state.settings} })
  }

  handleClose = () => {
    this.setState({ modalOpen: false })
  }

  handleCloseAndSave = () => {
    this.setState({ modalOpen: false, settings: {...this.state.localSettings} });
    this.props.onFiltersUpdated(this.filter(this.state.localSettings));
  }

  filter = (settings) => {
    return (elements) => {
      console.log('applying filters', settings, elements, elements.length)
      elements = (elements || []).filter(el => el.number_of_scans <= settings.scansFilter)

      return elements;
    }
  }

  render() {
    let elements = this.props.elements || [];
    let totalNumberOfIndexes = elements.length;

    console.log('settings', this.state.localSettings, this.state.settings, this.state.localSettings === this.state.settings);
    if(totalNumberOfIndexes == 0) {
      return null;
    }

    const filter = this.filter(this.state.localSettings);

    const filteredCount = filter(elements).length;


    return (
      <Modal
        trigger={
          <Sticky context={this.props.contextRef} offset={24}>
            <Container>
              <Button onClick={this.handleOpen} color='green'>
                <Icon name='filter' />
              </Button>
            </Container>
          </Sticky>
        }
        onClose={this.handleClose}
        open={this.state.modalOpen}
      >
        <Modal.Header>Select filters</Modal.Header>
        <Modal.Content>
          <Grid.Column as={Form}>
            <Form.Input
              label={`Filter by the total number of scans: ${this.state.localSettings.scansFilter}`}
              min={0}
              max={100000}
              name='scansFilter'
              onChange={this.handleLocalChange}
              step={1000}
              type='range'
              value={this.state.localSettings.scansFilter}
            />
          </Grid.Column>
        </Modal.Content>
        <Modal.Actions>
          Will show {filteredCount} indexes out of {totalNumberOfIndexes}
          <Button color='green' onClick={this.handleCloseAndSave}>
            <Icon name='checkmark' /> Apply filters
          </Button>
          <Button onClick={this.handleClose}>
            <Icon name='remove' /> Close
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
