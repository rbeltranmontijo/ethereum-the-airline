import React, { Component } from "react";
import Panel from "./Panel";

import getWeb3 from "./getWeb3";
import AirlineContract from "./airline";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: undefined
    };
  }

  async componentDidMount() {
    this.web3 = await getWeb3();
    this.airline = await AirlineContract(this.web3.currentProvider);
    console.log(this.airline);
    console.log(this.web3.eth);
    let accounts = await this.web3.eth.getAccounts();
    console.log(accounts);
    this.setState({ accounts }, () => this.load());
  }

  async load() {}

  render() {
    return (
      <React.Fragment>
        <div className="jumbotron">
          <h4 className="display-4">Welcome to the Airline!</h4>
        </div>

        <div className="row">
          <div className="col-sm">
            <Panel title="Balance"></Panel>
          </div>
          <div className="col-sm">
            <Panel title="Loyalty points - refundable ether"></Panel>
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <Panel title="Available flights"></Panel>
          </div>
          <div className="col-sm">
            <Panel title="Your flights"></Panel>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
