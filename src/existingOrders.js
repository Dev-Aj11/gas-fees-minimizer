import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import './index.css';

export function ExistingOrders() {
  const [orders, setOrders] = React.useState([]);

  useEffect(() => {
    const res = fetch('/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => res.json())
      .then(setOrders);
  }, []);

  return (
    <Table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Destination Address</th>
          <th>Amount</th>
          <th>Gas Limit</th>
          <th>Expires at</th>
          <th>Entered at</th>
          <th>Executed at</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.destination_wallet}</td>
            <td>{order.amount} {order.token}</td>
            <td>{order.gas_limit_dollars}</td>
            <td>{order.expires_at}</td>
            <td>{order.created_at}</td>
            <td>{order.executed_at}</td>
          </tr>))}
      </tbody>
    </Table>
  )
}
