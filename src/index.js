import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
        // submit data to backend --> confirm message to user
        // refresh state
    }

    render() {
        console.log("statement 1");
        return (
            <div>
                <h1> ETH Gas Fees Minimizer </h1>
                <form>
                    <Wallet onClick={() => this.connectWalletClick()} ></Wallet>
                    <UserInput onClick={() => this.submitUserInputClick()}></UserInput>
                </form>
            </div>
        );
    }
}

function Wallet(props) {
    return (
        <label>
            From:
            <button type="button" onClick={() => props.onClick()}>Connect Wallet</button>
            <br></br>
        </label>
    )
}

function UserInput(props) {
    return (
        <div>
            <label>
                To:
            <input type="text" name="to" />
                <br></br>
            </label>
            <label>
                Gas limit (in USD):
            <input type="number" name="gaslimit" />
                <br></br>
            </label>
            <label>
                ETH amount (in USD):
            <input type="number" name="ethamount" />
                <br></br>
            </label>
            <label>
                Time limit (in hours):
            <input type="number" name="timelimit" />
                <br></br>
            </label>
            <input type="button" value="Submit" onClick={() => props.onClick()} />
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