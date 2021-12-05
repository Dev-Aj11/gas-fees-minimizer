import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Button, Container, FormControl, FormGroup, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


class GasEstimator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            from: null,
            to: null,
            gasLimit: null,
            ethAmt: null,
            timeLimit: null,
        };
    }

    connectWalletClick() {
        console.log('hello');
    }

    submitUserInputClick() {
        // ensure user entered valid values
        for (const key in this.state) {
            if (this.state[key] == null) {
                alert("invalid state");
                return;
            }
        }
    }

    render() {
        return (
            <div>
                <h1 className="header"> ETH Gas Fees Minimizer </h1>
                <Container className="outer-container">
                    <Form className="gas-form">
                        <Wallet onClick={() => this.connectWalletClick()} ></Wallet>
                        <UserInput onClick={() => this.submitUserInputClick()}></UserInput>
                    </Form>
                </Container>
            </div>
        );
    }
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