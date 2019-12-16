import React, { Component } from 'react'
import {Row, Col, Card, Table, Form, Button} from 'react-bootstrap';
import api from '../api';
import { formatLocalTime } from '../utils/time';

const rightAlign = {
  display: 'flex',
  justifyContent: 'flex-end'
}

export default class Users extends Component {

  constructor(props) {
    super(props)
    this.state = {
      users: [],
      username: '',
      password: '',
      passwordConfirmation: ''
    }
  }

  componentDidMount = () => {
    this.getData();
  }

  getData = () => {
    api.get('/users')
      .then(users => users && this.setState({ users }))
      .catch(console.error)
  }

  addUser = (e) => {
    e.preventDefault();
    const { username, password, passwordConfirmation } = this.state;

    if(password !== passwordConfirmation) {
      return alert('Passwords do not match')
    }

    api.post('/users', { username, password })
      .then(this.getData)
      .catch(console.error)
  }

  updateInput = event => this.setState({ [event.target.name]: event.target.value })

  deleteUser = userId => () => api.delete(`/users/${userId}`).then(this.getData).catch(console.error)

  renderUsers = users => users.map(this.renderUser)

  renderUser = user => (
    <tr key={user.userId} className="unread">
      <td>
          <h6 className="mb-1">{user.username}</h6>
      </td>
      <td>
        <h6 className="text-muted">{user.lastLogin && formatLocalTime(user.lastLogin)}</h6>
      </td>
      <td style={rightAlign}>
      <Button size='sm' variant="danger" onClick={this.deleteUser(user.userId)}>Delete</Button>
      </td>
    </tr>
  )

  render() {
    const { users, username, password, passwordConfirmation } = this.state;

    return (
      <div>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6} xl={6}>
            <Card className='Recent-Users'>
                <Card.Header>
                  <Card.Title as='h5'>Add User</Card.Title>
                </Card.Header>
                <Card.Body className='px-10 py-10'>
                    <Form onSubmit={this.addUser}>
                      <Form.Group controlId="formBasicEmail">
                          <Form.Label>Username</Form.Label>
                          <Form.Control 
                            onChange={this.updateInput} 
                            name='username' 
                            type="text" 
                            placeholder="Enter username" 
                            value={username}
                            minLength={6}
                            required
                          />
                      </Form.Group>
                      <Form.Group controlId="formBasicPassword">
                          <Form.Label>Enter Password</Form.Label>
                          <Form.Control 
                            onChange={this.updateInput} 
                            name='password' 
                            minLength={8} 
                            type="password" 
                            placeholder="Enter Password"  
                            value={password} 
                            required
                          />
                      </Form.Group>
                      <Form.Group controlId="formBasicPassword">
                          <Form.Label>Confirm Password</Form.Label>
                          <Form.Control 
                            isValid={password && password === passwordConfirmation} 
                            isInvalid={password !== passwordConfirmation} 
                            onChange={this.updateInput} 
                            name='passwordConfirmation' 
                            minLength={8} 
                            type="password" 
                            placeholder="Confirm Password"  
                            value={passwordConfirmation} 
                            required
                          />
                      </Form.Group>
                        <Button variant="primary" type='submit'>
                          Add User
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
                    <Card.Title as='h5'>Current Users</Card.Title>
                </Card.Header>
                <Card.Body className='px-0 py-0'>
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Last Login</th>
                          <th></th>
                        </tr>
                      </thead>
                        <tbody>
                          { this.renderUsers(users) }
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