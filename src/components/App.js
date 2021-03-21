import { Tabs, Tab } from "react-bootstrap";
import dBank from "../abis/dBank.json";
import React, { Component } from "react";
import Token from "../abis/Token.json";
import dbank from "../dbank.png";
import Web3 from "web3";
import "./App.css";

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {
  async componentDidMount() {
    await this.loadBlockchainData(this.props.dispatch);
  }

  async loadBlockchainData(dispatch) {
    if (!window.ethereum) {
      window.alert("Please install MetaMask");
      return;
    }
    let web3 = new Web3("ws://localhost:7545");

    const netId = await web3.eth.net.getId();
    const accounts = await web3.eth.getAccounts();

    // const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    if (!account) {
      window.alert("Please login with MetaMask");
      return;
    }

    const balance = await web3.eth.getBalance(account);
    console.log(balance);
    try {
      const token = new web3.eth.Contract(
        Token.abi,
        Token.networks[netId].address
      );

      const dBankAddress = dBank.networks[netId].address;
      const dbank = new web3.eth.Contract(dBank.abi, dBankAddress);
      this.setState({ account, balance, web3, token, dbank, dBankAddress });
    } catch (error) {
      console.log("Error", error);
      window.alert("Contracts not deployed to the current network");
    }

    //check if MetaMask exists

    //assign to values to variables: web3, netId, accounts

    //check if account is detected, then load balance&setStates, elsepush alert

    //in try block load contracts

    //if MetaMask not exists push alert
  }

  async deposit(amount) {
    try {
      await this.state.dbank.methods
        .deposit()
        .send({ value: amount.toString(), from: this.state.account });
    } catch (error) {
      console.log(error);
    }
  }

  async withdraw(e) {
    e.preventDefault();
    try {
      await this.state.dbank.methods
        .withdraw()
        .send({ from: this.state.account, gas: 3000000 });
    } catch (error) {
      console.log(error);
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      web3: "undefined",
      account: "",
      token: null,
      dbank: null,
      balance: 0,
      dBankAddress: null,
    };
  }

  render() {
    return (
      <div className="text-monospace">
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={dbank} className="App-logo" alt="logo" height="32" />
            <b>dBank</b>
          </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
          <br></br>
          <h1>Welcome to Decentralized Bank!</h1>
          <h2>{this.state.account}</h2>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                  <Tab eventKey="deposit" title="Deposit">
                    <br></br>
                    How much do you want to deposit?
                    <br></br>
                    (min. amount is 0.01 ETH)
                    <br></br>
                    (1 deposit is possible at the time)
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const amountWei = this.depositAmount.value * 10 ** 18;
                        await this.deposit(amountWei);
                      }}
                    >
                      <div className="form-group mr-sm-2">
                        <br></br>
                        <input
                          ref={(input) => {
                            this.depositAmount = input;
                          }}
                          required
                          placeholder="amount..."
                          type="number"
                          min="0.01"
                          step="0.01"
                          className="form-control form-control-md"
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">
                        DEPOSIT
                      </button>
                    </form>
                  </Tab>
                  <Tab eventKey="withdraw" title="Withdraw">
                    <div>
                      <br></br>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={(e) => this.withdraw(e)}
                      >
                        Withdraw
                      </button>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
