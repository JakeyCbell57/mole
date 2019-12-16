import React, { Component } from 'react';
import {Row, Col, Card, Table, Form, Button} from 'react-bootstrap';
import api from '../api';

const rightAlign = {
  display: 'flex',
  justifyContent: 'flex-end'
}

const smallCol = {
  maxWidth: '200px'
}

export default class ProcessorsView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      processors: [],
      processorTypes: [],
      name: '',
      apiId: '',
      apiKey: '',
      processorType: '',
      currentParams: []
    }
  }

  componentDidMount = () => this.getData();

  updateInput = event => this.setState({ [event.target.name]: event.target.value })

  getData = () => {
    api.get('/processors')
      .then(processors => processors && this.setState({ processors: processors.sort((a, b) => a.name.localeCompare(b.name)) }))
      .then(console.error)

    api.get('/processors/types')
      .then(processorTypes => processorTypes && this.setState({ processorTypes }))
      .then(console.error)
  }

  addProcessor = (e) => {
    e.preventDefault();

    const { name, apiId, apiKey, processorType } = this.state;

    if(!name) {
      return alert('Please enter a name');
    }

    if(!processorType) {
      return alert('Please select a processor type');
    }

    api.post('/processors', { name, apiId, apiKey, processorType })
      .then(this.getData)
      .catch(console.error)
  }

  renderProcessors = processors => processors.map(this.renderProcessor)

  renderProcessor = processor => (
    <tr key={processor.id+processor.name} className="unread">
      <td>
        <h6 className="mb-1">{processor.name}</h6>
      </td>
      <td style={smallCol}>
        <h6 className="mb-1">{processor.healthy ? 'yes' : 'no'}</h6>
      </td>
      <td>
        <h6 className="mb-1">{processor.type}</h6>
      </td>
      <td style={rightAlign}>
        <Button size='sm' variant={processor.enabled ? 'success' : 'warning'} onClick={this.toggleEnabled(processor.id, processor.enabled)}>{processor.enabled ? 'Enabled' : 'Disabled'}</Button>
        <Button size='sm' variant="danger" onClick={this.deleteProcessor(processor.id, processor.name)}>Delete</Button>
      </td>
    </tr>
  )

  deleteProcessor = (id, name) => () => {
    const confirmed = window.confirm('Are you sure you want to delete client ' + name + '?')

    if(confirmed) {
      api.delete(`/processors/${id}`)
        .then(this.getData)
        .catch(console.error)
    }
  }

  toggleEnabled = (id, status) => () => {
    api.patch(`/processors/${id}/enabled`, { enabled: !status })
      .then(this.getData)
      .catch(console.error)
  }

  updateProcessorSelect = (e) => {
    const value = e.target.value;

    this.setState({ processorType: value })
    const { processorTypes } = this.state;

    console.log(processorTypes)
    const currentType = processorTypes.find(type => type.id === parseInt(value))

    console.log(currentType)

    if(currentType) {
      this.setState({ currentParams: currentType.parameters })
    } else {
      this.setState({ currentParams: [] })

    }
  }

  renderProcessorTypes = types => types.map(type => (
    <option key={type.name + type.id} value={type.id}>{type.name}</option>
  ))

  render() {
    const { name, apiId, apiKey, processors, processorTypes, currentParams } = this.state;

    return (
      <div>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6} xl={6}>
            <Card className='Recent-Users'>
                <Card.Header>
                  <Card.Title as='h5'>Add Processor</Card.Title>
                </Card.Header>
                <Card.Body className='px-10 py-10'>
                    <Form onSubmit={this.addProcessor}>
                      <Form.Group>
                          <Form.Control onChange={this.updateProcessorSelect} as="select" className="mb-3" required>
                            <option value='' selected disabled>Select processor type</option>
                            { this.renderProcessorTypes(processorTypes) }
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control onChange={this.updateInput} name='name' type="text" placeholder="Enter a processor name" value={name} required/>
                        </Form.Group>
  
                        { currentParams.includes('apiId') && (
                          <Form.Group controlId="apiId">
                            <Form.Label>Api Id</Form.Label>
                            <Form.Control onChange={this.updateInput} name='apiId' type="text" placeholder="Enter processor's api id" value={apiId} required/>
                          </Form.Group>
                        )}
  
                        { currentParams.includes('apiKey') && (
                          <Form.Group controlId="apiKey">
                            <Form.Label>Api Key</Form.Label>
                            <Form.Control onChange={this.updateInput} name='apiKey' type="text" placeholder="Enter processor's api key" value={apiKey} required/>
                          </Form.Group>
                        )}
  
                        <Button variant="primary" type='submit'>
                          Add Processor
                      </Button>
                    </Form>
                </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={12} xl={12}>
            <Card className='Recent-Users'>
                <Card.Header>
                    <Card.Title as='h5'>Current Processors</Card.Title>
                </Card.Header>
                <Card.Body className='px-0 py-0'>
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Connected</th>
                          <th>Type</th>
                          <th></th>
                        </tr>
                      </thead>
                        <tbody>
                          { this.renderProcessors(processors) }
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}