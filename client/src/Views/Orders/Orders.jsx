import React, { Component } from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import api from '../../api';
import qs from 'querystring';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css'
import * as Time from '../../utils/time';
import TableColumns from './TableColumns';

const metric = {
  paddingLeft: '15px',
  paddingRight: '0'
}

export default class OrdersView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      byProcessors: [],
      byClients: [],
      aggregate: false,
      totalProcessed: '',
      totalFees: '',
      totalTransactions: ''
    }
  }

  componentDidMount = () => {
    const startOfDay = Time.startOfDay().valueOf();
    this.getData(startOfDay);
  }

  getData = (start, end) => {
    api.get(`/orders?${qs.stringify({ start, end })}`)
      .then(orders => {
        if (orders) {
          this.setState({ orders })
          const totalProcessed = orders.reduce((acc, cur) => acc + parseFloat(cur.orderTotal), 0);
          const totalFees = orders.reduce((acc, cur) => acc + parseFloat(cur.processingFee), 0);
          const totalTransactions = orders.length
          this.setState({
            orders,
            totalProcessed,
            totalFees,
            totalTransactions
          })
        }
      })
      .catch(console.error)

    api.get(`/processors/metrics?${qs.stringify({ start, end })}`)
      .then(byProcessors => byProcessors && this.setState({ byProcessors }))
      .catch(console.error)

    api.get(`/clients/metrics?${qs.stringify({ start, end })}`)
      .then(byClients => byClients && this.setState({ byClients }))
      .catch(console.error)
  }


  renderByProcessor = processors => processors.map((processor, i) => (
    <tr key={processor.id}>
      <th scope="row">{i + 1}</th>
      <td>{processor.name}</td>
      <td>{processor.type}</td>
      <td>{processor.balance && ('$' + processor.balance)}</td>
      <td>{processor.transactions}</td>
    </tr>
  ))

  renderByClient = clients => clients.map((client, i) => (
    <tr key={client.id}>
      <th scope="row">{i + 1}</th>
      <td>{client.name}</td>
      <td>{client.balance && ('$' + client.balance)}</td>
      <td>{client.transactions}</td>
    </tr>
  ))

  toggleAggregation = current => () => this.setState({ aggregate: !current })

  render() {
    const { orders, byProcessors, byClients, aggregate, totalProcessed, totalFees, totalTransactions } = this.state;
    return (
      <div>
        <Row>
          <Col xs={12} sm={4} md={4} lg={4}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Processed</Card.Title>
              </Card.Header>
              <Card.Body>
                <Card.Title as="h4" style={{ ...metric, color: '#24b017' }}>{totalProcessed && '$' + totalProcessed.toFixed(2)}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={4} md={4} lg={4}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Processing Fees</Card.Title>
              </Card.Header>
              <Card.Body>
                <Card.Title as="h4" style={{ ...metric, color: '#e82323' }}>{totalFees && '$' + totalFees.toFixed(2)}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={4} md={4} lg={4}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Transactions</Card.Title>
              </Card.Header>
              <Card.Body>
                <Card.Title as="h4" style={metric}>{totalTransactions}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title as="h5">By Processor</Card.Title>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Processed</th>
                      <th>Transactions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderByProcessor(byProcessors)}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title as="h5">By Client</Card.Title>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Processed</th>
                      <th>Transactions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderByClient(byClients)}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Card.Title as="h5">Orders</Card.Title>
                <Button size='sm' variant={aggregate ? 'outline-info' : 'info'} onClick={this.toggleAggregation(aggregate)}>{aggregate ? 'Flatten' : 'Aggregate'}</Button>
              </Card.Header>
              <Card.Body style={{ padding: '0' }}>
                <ReactTable
                  defaultPageSize={10}
                  pivotBy={aggregate ? ["clientName", "processorName"] : []}
                  filterable={true}
                  className="-striped -highlight"
                  data={orders}
                  columns={TableColumns}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

      </div>
    )
  }
}