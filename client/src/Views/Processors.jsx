import React, { Component } from 'react';
import { Row, Col, Card, Table, Form, Button, InputGroup } from 'react-bootstrap';
import api from '../api';
import { Collapse } from 'react-collapse';
import { ToastContainer } from 'react-toastify';

const rightAlign = {
  display: 'flex',
  justifyContent: 'flex-end'
};

const smallCol = {
  maxWidth: '200px'
};

const light = {
  color: '#495057',
  fontSize: '0.9rem'
};

export default class ProcessorsView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      processors: [],
      processorTypes: [],
      name: '',
      url: '',
      processorType: '',
      editing: false,
      editName: '',
      editUrl: ''
    }
  }

  componentDidMount = () => this.getData();

  updateInput = event => this.setState({ [event.target.name]: event.target.value });

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

    const { name, url, processorType } = this.state;

    api.post('/processors', { name, url, processorType })
      .then(() => {
        this.getData();
        this.resetAddProcessorForm();
      })
      .catch(console.error)
  }

  authenticate = id => () => {
    api.get(`/processors/${id}/ping`)
      .then(success => {
        this.getData();
        if(success) {
          alert('Processor authenticated successfully');
        } else {
          alert('Processor failed to authenticate.');
        }
      })
      .catch(console.error)
  }


  resetAddProcessorForm = () => this.setState({ name: '', url: '', processorType: '' })

  renderProcessors = processors => processors.map(this.renderProcessor)

  renderProcessor = processor => (
    <tr key={processor.id + processor.name} className="unread">
      <td>
        <h6 className="mb-1">{processor.name}</h6>
      </td>
      <td>
        <h6 className="mb-1">{processor.url}</h6>
      </td>
      <td style={smallCol}>
        <h6 className="mb-1">{processor.healthy ? 'yes' : 'no'}</h6>
      </td>
      <td>
        <h6 className="mb-1">{processor.type}</h6>
      </td>
      <td style={rightAlign}>
        <Button size='sm' variant="info" onClick={this.authenticate(processor.id)}>Authenticate</Button>
        <Button size='sm' variant="warning" onClick={this.edit(processor)}>Edit</Button>
        <Button size='sm' variant={processor.enabled ? 'success' : 'warning'} onClick={this.toggleEnabled(processor.id, processor.enabled)}>{processor.enabled ? 'Enabled' : 'Disabled'}</Button>
        <Button size='sm' variant="danger" onClick={this.deleteProcessor(processor.id, processor.name)}>Delete</Button>
      </td>
    </tr>
  )

  deleteProcessor = (id, name) => () => {
    const confirmed = window.confirm('Are you sure you want to delete client ' + name + '?')

    if (confirmed) {
      api.delete(`/processors/${id}`)
        .then(this.getData)
        .catch(console.error)
    }
  }

  editProcessor = (e) => {
    e.preventDefault();
    const { editProcessorId, editName, editUrl } = this.state;

    api.patch(`/processors/${editProcessorId}`, { name: editName, url: editUrl })
      .then(() => {
        this.cancelEdit()
        this.getData()
      })
      .catch(console.error)
  }

  edit = processor => () => this.setState({ editing: true, editName: processor.name, editUrl: processor.url, editProcessorId: processor.id })

  cancelEdit = () => this.setState({ editing: false, editName: '', editUrl: '', editProcessorId: '' })

  toggleEnabled = (id, status) => () => {
    api.patch(`/processors/${id}/enabled`, { enabled: !status })
      .then(this.getData)
      .catch(console.error)
  }

  updateProcessorSelect = (e) => {
    this.setState({ processorType: e.target.value })
  }

  renderProcessorTypes = types => types.map(type => (
    <option key={type.name + type.id} value={type.id}>{type.name}</option>
  ))

  render() {
    const { name, url, processors, processorTypes, editName, editUrl } = this.state;

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
                      {this.renderProcessorTypes(processorTypes)}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control onChange={this.updateInput} name='name' type="text" placeholder="Enter a processor name" value={name} required />
                  </Form.Group>

                  <Form.Group controlId="url">
                    <Form.Label>Bank Page Url</Form.Label>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text style={light}>https://</InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control onChange={this.updateInput} name='url' type="text" placeholder="Enter URL of associated bank page" value={url} required />
                    </InputGroup>
                  </Form.Group>

                  <Button variant="primary" type='submit'>
                    Add Processor
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Collapse isOpened={this.state.editing}>
              <Card>
                <Card.Header>
                  <Card.Title>Edit Client</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={this.editProcessor}>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>Name</Form.Label>
                      <Form.Control onChange={this.updateInput} name='editName' type="text" placeholder="Enter client name" value={editName} required />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>URL</Form.Label>
                      <Form.Control onChange={this.updateInput} name='editUrl' type="text" placeholder="Enter client URL" value={editUrl} required />
                    </Form.Group>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <Button variant="primary" type='submit'>
                          Edit Processor
                      </Button>
                        <Button variant="warning" onClick={this.cancelEdit}>
                          Cancel
                      </Button>
                      </div>
                      {/* <Button variant='danger' onClick={this.resetCredentials}>
                      Reset Credentials
                  </Button> */}
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Collapse>
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
                      <th>Url</th>
                      <th>Connected</th>
                      <th>Type</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderProcessors(processors)}
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