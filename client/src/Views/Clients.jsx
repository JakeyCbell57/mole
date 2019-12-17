import React, { Component } from 'react';
import { Row, Col, Card, Table, Form, Button } from 'react-bootstrap';
import api from '../api';
import { Collapse } from 'react-collapse';

const rightAlign = {
  display: 'flex',
  justifyContent: 'flex-end'
};

const light = {
  color: '#495057',
  fontSize: '0.9rem',
};

export default class ClientsView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      clients: [],
      name: '',
      url: '',
      processingFee: '',
      editing: false,
      editName: '',
      editUrl: '',
      editClientId: '',
      editProcessingFee: ''
    }
  }

  componentDidMount = () => this.getData();

  updateInput = event => this.setState({ [event.target.name]: event.target.value });

  getData = () => {
    api.get('/clients')
      .then(clients => clients && this.setState({ clients: clients.sort((a, b) => a.name.localeCompare(b.name)) }))
      .then(console.error)
  }

  addClient = (e) => {
    e.preventDefault();

    const { name, url, processingFee } = this.state;

    api.post('/clients', { name, url, processingFee })
      .then(() => {
        this.getData();
        this.resetAddClientForm();
      })
      .catch(console.error)
  }

  editClient = (e) => {
    e.preventDefault();
    const { editClientId, editName, editUrl } = this.state;
    api.patch(`/clients/${editClientId}`, { name: editName, url: editUrl })
      .then(() => {
        this.getData();
        this.cancelEdit();
      })
      .catch(console.error)
  }

  resetAddClientForm = () => this.setState({ name: '', url: '', processingFee: '' });

  resetCredentials = () => {
    const name = this.state.editName;
    const id = this.state.editClientId;

    const confirmed = window.confirm(`DANGER: Are you sure you want to reset the credentials for ${name}?\nTheir previous credentials will become useless. \nThis cannot be undone.`)

    if (confirmed) {
      const doubleConfirmed = window.confirm('Are you really sure? They wont be able to process sales until they update their credentials.')

      if (doubleConfirmed) {
        api.patch(`/clients/${id}/resetCredentials`)
          .then(() => {
            setTimeout(() => {
              alert('Success. New credentials are available');
              this.cancelEdit();
            }, 1000)
          })
          .catch(console.error)
      }
    }
  }

  downloadCredentials = () => {
    const clientId = this.state.editClientId;
    api.post(`/clients/${clientId}/onboard`, { url: window.location.hostname })
      .then(response => {

      })
      .catch(console.error)
  }

  edit = client => () => this.setState({ editing: true, editName: client.name, editUrl: client.url, editProcessingFee: client.processingFee, editClientId: client.id })

  cancelEdit = () => this.setState({ editing: false, editName: '', editUrl: '', editClientId: '', editProcessingFee: '' })

  renderClients = clients => clients.map(this.renderClient)

  deleteClient = (id, name) => () => {
    const confirmed = window.confirm('Are you sure you want to delete client ' + name + '?')

    if (confirmed) {
      api.delete(`/clients/${id}`)
        .then(this.getData)
        .catch(console.error)
    }
  }

  toggleEnabled = (id, status) => () => {
    api.patch(`/clients/${id}/enabled`, { enabled: !status })
      .then(this.getData)
      .catch(console.error)
  }

  renderClient = client => (
    <tr key={client.userId} className="unread">
      <td>
        <h6 className="mb-1">{client.name}</h6>
      </td>
      <td>
        <h6 className="mb-1">{client.url}</h6>
      </td>
      <td>
        <h6 className="mb-1">{client.processingFee && (client.processingFee + '%')}</h6>
      </td>
      <td style={rightAlign}>
        <Button size='sm' variant="info" onClick={this.downloadCredentials(client.id)}>Onboard</Button>
        <Button size='sm' variant="warning" onClick={this.edit(client)}>Edit</Button>
        <Button size='sm' variant={client.enabled ? 'success' : 'warning'} onClick={this.toggleEnabled(client.id, client.enabled)}>{client.enabled ? 'Enabled' : 'Disabled'}</Button>
        <Button size='sm' variant="danger" onClick={this.deleteClient(client.id, client.name)}>Delete</Button>
      </td>
    </tr>
  )

  render() {
    const { name, url, processingFee, clients, editName, editUrl, editProcessingFee } = this.state;

    return (
      <div>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6} xl={6}>
            <Card className='Recent-Users'>
              <Card.Header>
                <Card.Title as='h5'>Add Client</Card.Title>
              </Card.Header>
              <Card.Body className='px-10 py-10'>
                <Form onSubmit={this.addClient}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control onChange={this.updateInput} name='name' type="text" placeholder="Enter client name" value={name} required />
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>URL</Form.Label>
                    <Form.Control onChange={this.updateInput} name='url' type="text" placeholder="Enter client URL" value={url} required />
                  </Form.Group>
                  <Button variant="primary" type='submit'>
                    Add Client
                      </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Collapse isOpened={this.state.editing}>
          <Card>
            <Card.Header>
              <Card.Title>Edit Client</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={this.editClient}>
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
                      Edit Client
                    </Button>
                    <Button variant="warning" onClick={this.cancelEdit}>
                      Cancel
                    </Button>
                  </div>
                  <Button variant='danger' onClick={this.resetCredentials}>
                    Reset Credentials
                </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Collapse>

        <Row>
          <Col md={12} lg={12} xl={12}>
            <Card className='Recent-Users'>
              <Card.Header>
                <Card.Title as='h5'>Current Clients</Card.Title>
              </Card.Header>
              <Card.Body className='px-0 py-0'>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>URL</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderClients(clients)}
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