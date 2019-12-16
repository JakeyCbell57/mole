import React, { Component } from 'react'
import {Card, Row, Col} from 'react-bootstrap';
import api from '../api';
import * as Time from '../utils/time';
import qs from 'querystring';

export default class Overview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      orders: []
    }
  }

  componentDidMount = () => {
    const startOfDay = Time.startOfDay().valueOf();
    this.getData(startOfDay);
  }

  getData = (start, end) => {
    api.get(`/orders?${qs.stringify({ start, end })}`)
      .then(orders => orders && this.setState({ orders }))
      .catch(console.error)
  }

  render() {
    return (
      <div>
        <Row>
          <Col md={12} lg={4}>
            <Card>
              <Card.Body>
              </Card.Body>
            </Card>
          </Col>
          <Col md={12} lg={4}>
            <Card>
              <Card.Body></Card.Body>
            </Card>
          </Col>
          <Col md={12} lg={4}>
            <Card>
              <Card.Body></Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}