import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Web3 from 'web3';
import abi from "./abi.json";
import './index.css';
const Tx = require("@ethereumjs/tx");

const supportedTokenTypes = {
  'WETH': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  'BNB': '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
  'BUSD': '0x4fabb145d64652a948d72533023f6e7a623c7c53',
  'CRO': '0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b',
  'DAI': '0x6b175474e89094c44da98b954eedeac495271d0f',
  'HEX': '0x2b591e99afe9f32eaa6214f7b7629768c40eeb39',
  'MATIC': '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
  'SHIB': '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
  'USDT': '0xdac17f958d2ee523a2206206994597c13d831ec7',
  'USDC': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  'WBTC': '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
}

const erc20ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_spender",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  }
];
export function NewOrder() {
  const web3 = new Web3(Web3.givenProvider);

  const [submitting, setSubmitting] = React.useState(false);
  const [succeeded, setSucceeded] = React.useState(false);

  const [destinationWallet, setDestinationWallet] = React.useState('');
  const [gasLimitDollars, setGasLimitDollars] = React.useState(0);
  const [tokenAmount, setTokenAmount] = React.useState(0);
  const [tokenType, setTokenType] = React.useState("WETH");
  const [timeLimitHours, setTimeLimitHours] = React.useState(24);

  async function addOrder() {
    setSubmitting(true);
    await fetch('/add-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        destination_wallet: destinationWallet,
        amount: tokenAmount,
        token: tokenType,
        gas_limit_dollars: gasLimitDollars,
        expires_at: new Date(new Date().getTime() + timeLimitHours * 60 * 60 * 1000).toISOString(),
      }),
    });
    const approvedRes = await fetch('/get-approval', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: tokenType }),
    });
    const approvedResJson = await approvedRes.json();
    const { ethereum } = window;
    if (!approvedResJson) {
      // var erc20Instance = new web3.eth.Contract(erc20ABI, supportedTokenTypes[tokenType]);
      // this is LINK on rinkeby
      var erc20Instance = new web3.eth.Contract(erc20ABI, "0x01BE23585060835E02B77ef475b0Cc51aA1e0709");
      // our smart contract on rinkeby
      erc20Instance.methods.approve("0x7feb6F5c883071C62E00E96603214CF7f73CAb59", 100)
        .send({ from: ethereum.selectedAddress })
        .on('transactionHash', function (hash) {
          console.log(hash)
          return fetch('/save-approval', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: tokenType }),
          });
        });
    }

    const smartContract = new web3.eth.Contract(abi.abi, "0x7feb6F5c883071C62E00E96603214CF7f73CAb59");
    const rawTx = {
      from: ethereum.address,
      // target address, this could be a smart contract address
      to: "0x7feb6F5c883071C62E00E96603214CF7f73CAb59",
      data: smartContract.methods.transferERC20("0x01BE23585060835E02B77ef475b0Cc51aA1e0709", ethereum.selectedAddress, destinationWallet, tokenAmount).encodeABI(),
      chainId: 4,
    };
    const tx = new Tx.Transaction(rawTx, { chain: 'rinkeby' });
    const serializedTx = web3.utils.sha3(tx.serialize().toString('hex'));
    console.log(serializedTx);
    const signed = await ethereum.request({ method: 'eth_sign', params: [ethereum.selectedAddress, serializedTx] });
    console.log('signed: ' + signed);
    setSubmitting(false);
    setSucceeded(true);
  }

  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Text className="text-muted">To:</Form.Text>
        <Form.Control type="text" placeholder="Wallet address" value={destinationWallet} onChange={e => setDestinationWallet(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Text className="text-muted">Gas Limit (in USD)</Form.Text>
        <Form.Control type="number" min="0" placeholder="" value={gasLimitDollars} onChange={e => setGasLimitDollars(Number(e.target.value))} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Row>
          <Col>
            <Form.Text className="text-muted">Amount</Form.Text>
            <Form.Control type="number" min="0" placeholder="" value={tokenAmount} onChange={e => setTokenAmount(Number(e.target.value))} />
          </Col>
          <Col>
            <Form.Text className="text-muted">Token</Form.Text>
            <Form.Select value={tokenType} onChange={e => setTokenType(e.target.value)}>
              {Object.keys(supportedTokenTypes).map(token => <option value={token}>{token}</option>)};
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Text className="text-muted">Time limit (in hours) </Form.Text>
        <Form.Control type="number" min="0" placeholder="" value={timeLimitHours} onChange={e => setTimeLimitHours(Number(e.target.value))} />
      </Form.Group>

      <Button variant="primary" type="button" onClick={addOrder} disabled={submitting}>Submit</Button>
      {succeeded && <div className="mt-3">Order submitted!</div>}

    </div>
  )
}
