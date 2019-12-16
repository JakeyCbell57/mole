import React from 'react';
import * as Time from '../../utils/time';

const alignRight = {
  textAlign: 'right'
};

const alignCenter = {
  textAlign: 'center'
};

const columns = [

  {
    Header: "Client",
    accessor: "clientName"
  },
  {
    Header: "Processor",
    accessor: "processorName",
    Aggregated: row => (<div></div>)
  },
  {
    Header: "Amount",
    id: "orderTotal",
    style: alignRight,
    accessor: d => parseFloat(d.orderTotal).toFixed(2),
    Cell: row => (<span>${row.value}</span>),
    aggregate: formatDecimals,
    Aggregated: row => (<span>${row.value}</span>)
  },
  {
    Header: "Order Id",
    accessor: "orderId",
    style: alignCenter,
    Aggregated: row => (<span></span>)
  },
  {
    Header: "Date",
    id: 'createdAt',
    style: alignCenter,
    accessor: d => Time.formatLocalTime(d.createdAt),
    Aggregated: row => (<span></span>)
  }
]

function formatDecimals(vals) {
  const total = vals.reduce((acc, cur) => acc + parseFloat(cur), 0);
  return total.toFixed(2)
}
export default columns;
