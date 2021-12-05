import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import './index.css';

export function NewOrder() {
  const [destinationWallet, setDestinationWallet] = React.useState('');
  const [gasLimitDollars, setGasLimitDollars] = React.useState(0);
  const [tokenAmount, setTokenAmount] = React.useState(0);
  const [timeLimitHours, setTimeLimitHours] = React.useState(24);

  async function addOrder() {
    await fetch('/add-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        destination_wallet: destinationWallet,
        amount: tokenAmount,
        token: "wETH",
        gas_limit_dollars: gasLimitDollars,
        expires_at: new Date(new Date().getTime() + timeLimitHours * 60 * 60 * 1000).toISOString(),
      }),
    });
  }

  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Text className="text-muted">To: </Form.Text>
        <Form.Control type="text" placeholder="Provide public key" value={destinationWallet} onChange={e => setDestinationWallet(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Text className="text-muted">Gas Limit (in USD) </Form.Text>
        <Form.Control type="number" min="0" placeholder="" value={gasLimitDollars} onChange={e => setGasLimitDollars(Number(e.target.value))} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Text className="text-muted">wETH tokens </Form.Text>
        <Form.Control type="number" min="0" placeholder="" value={tokenAmount} onChange={e => setTokenAmount(Number(e.target.value))} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Text className="text-muted">Time limit (in hours) </Form.Text>
        <Form.Control type="number" min="0" placeholder="" value={timeLimitHours} onChange={e => setTimeLimitHours(Number(e.target.value))} />
      </Form.Group>

      <Button variant="primary" type="button" onClick={addOrder}>Submit</Button>
    </div>
  )
}
