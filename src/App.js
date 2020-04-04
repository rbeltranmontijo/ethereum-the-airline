import React, { Component } from "react";
import Panel from "./Panel";

import getWeb3 from "./getWeb3";
import AirlineContract from "./airline";
import { AirlineServices } from "./airlineService";

const converter = web3 => value =>
  web3.utils.fromWei(value.toString(), "ether");

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: undefined,
      balance: 0,
      flights: [],
      customerFlights: [],
      refundableEther: 0
    };
  }

  async componentDidMount() {
    this.web3 = await getWeb3();
    this.toEther = converter(this.web3);
    this.airline = await AirlineContract(this.web3.currentProvider);
    this.airlineService = new AirlineServices(this.airline);

    console.log(this.web3.eth);
    let accounts = (await this.web3.eth.getAccounts())[0];

    this.web3.currentProvider.publicConfigStore.on(
      "update",
      async function(event) {
        this.setState(
          {
            accounts: event.selectedAddress
          },
          () => this.load()
        );
      }.bind(this)
    );
    this.setState({ accounts }, () => this.load());
  }

  async getBalance() {
    let weiBalance = await this.web3.eth.getBalance(this.state.accounts);
    console.log(weiBalance);
    this.setState({
      balance: this.toEther(weiBalance)
    });
  }

  async getFlights() {
    let flights = await this.airlineService.getFlights();
    this.setState({
      flights
    });
  }

  async getRefundableEther() {
    console.log(this.state.accounts);
    let refundableEther = await this.airlineService.getRefundableEther(
      this.state.accounts
    );
    refundableEther = this.toEther(refundableEther.toNumber());

    console.log(refundableEther);
    this.setState({
      refundableEther
    });
  }

  async getCustomerFlights() {
    let customerFlights = await this.airlineService.getCustomerFlights(
      this.state.accounts
    );
    this.setState({
      customerFlights
    });
  }

  async buyFlight(flightIndex, flight) {
    // console.log(flightIndex);
    // console.log(flight);
    await this.airlineService.buyFlight(
      flightIndex,
      this.state.accounts,
      flight.price
    );
  }

  async load() {
    this.getBalance();
    this.getFlights();
    this.getCustomerFlights();
    this.getRefundableEther();
  }

  render() {
    return (
      <React.Fragment>
        <div className="jumbotron">
          <h4 className="display-4">Welcome to the Airline!</h4>
        </div>

        <div className="row">
          <div className="col-sm">
            <Panel title="Balance">
              <p>
                <strong>{this.state.accounts}</strong>
              </p>
              <span>
                <strong>Balance:</strong> {this.state.balance}
              </span>
            </Panel>
          </div>
          <div className="col-sm">
            <Panel title="Loyalty points - refundable ether">
              <span>{this.state.refundableEther} eth</span>
            </Panel>
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <Panel title="Available flights">
              {this.state.flights.map((flight, i) => (
                <div key={i}>
                  <span>
                    {flight.name} - const: {this.toEther(flight.price)} eth
                  </span>
                  <button
                    onClick={() => this.buyFlight(i, flight)}
                    className="btn btn-sm btn-success text-white"
                  >
                    Purchase
                  </button>
                </div>
              ))}
            </Panel>
          </div>
          <div className="col-sm">
            <Panel title="Your flights">
              {this.state.customerFlights.map((flight, i) => (
                <div key={i}>
                  {flight.name} - cost: {flight.price}
                </div>
              ))}
            </Panel>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
