import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import './index.css';
import { NewOrder } from './newOrder';

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
          <NewOrder />
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

ReactDOM.render(
  <GasEstimator />,
  document.getElementById('root')
);