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
      setConnected(true);
    }
  }

  function submitUserInputClick() {
    // ensure user entered valid values
    for (const key in this.state) {
      if (this.state[key] == null) {
        alert("invalid state");
        return;
      }
    }
  }

  return (
    <div>
      <h1 className="header"> ETH Gas Fees Minimizer </h1>
      <Container className="outer-container">
        <Form className="gas-form">
          {!connected && <Wallet onClick={() => connectWalletClick()} ></Wallet>}
          {connected && <div>Wallet Connected</div>}
          <UserInput onClick={() => submitUserInputClick()}></UserInput>
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

function UserInput(props) {
  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Text className="text-muted">To: </Form.Text>
        <Form.Control type="text" placeholder="Provide public key" />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Text className="text-muted">Gas Limit (in USD) </Form.Text>
        <Form.Control type="number" min="0" placeholder="" />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Text className="text-muted">ETH amount (in USD) </Form.Text>
        <Form.Control type="number" min="0" placeholder="" />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Text className="text-muted">Time limit (in hours) </Form.Text>
        <Form.Control type="number" min="0" placeholder="" />
      </Form.Group>

      <Button variant="primary" type="button" onClick={() => props.onClick()}>Submit</Button>
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