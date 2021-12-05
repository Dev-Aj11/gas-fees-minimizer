import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import './index.css';

function GasEstimator() {
  const web3 = new Web3(Web3.givenProvider);
  const [connected, setConnected] = React.useState(false);

  useEffect(() => {
    web3.eth.getAccounts(function (err, accounts) {
      if (!err && accounts.length > 0) {
        setConnected(true);
      }
    });
  })

  async function connectWalletClick() {
    // https://docs.metamask.io/guide/create-dapp.html
    // Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    if (Boolean(ethereum && ethereum.isMetaMask)) {
      await ethereum.request({ method: 'eth_requestAccounts' });
      const nonceRes = await fetch('/get-nonce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sender_wallet: ethereum.selectedAddress }),
      });
      const nonce = await nonceRes.text();
      const signature = await ethereum.request({ method: 'personal_sign', params: [nonce, ethereum.selectedAddress] });
      await fetch('/verify-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sender_wallet: ethereum.selectedAddress, signature }),
      });

      setConnected(true);
    }
  }

  return (
    <div>
      <h1 className="header"> ETH Gas Fees Minimizer </h1>
      <Container className="outer-container">
        <Form className="gas-form">
          {!connected && <Wallet onClick={() => connectWalletClick()} ></Wallet>}
          {connected && <div>Wallet Connected</div>}
          <UserInput />
        </Form>
      </Container>
    </div>
  );
}

function Wallet(props) {
  return (
    <Form.Group className="mb-3">
      <Form.Text className="text-muted">From: </Form.Text>
      <Button variant="outline-primary" type="button" onClick={() => props.onClick()}>Connect Wallet</Button>
    </Form.Group>
  )
}

function UserInput() {
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


// input fields
// From: <connect wallet>, to: <address>
// Gas Limit: <in USD> 
// Amount to buy: <in USD>
// Currency: Ether
// Time: 24 hours / 48 hours

ReactDOM.render(
  <GasEstimator />,
  document.getElementById('root')
);