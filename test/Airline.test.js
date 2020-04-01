const Airline = artifacts.require("Airline");

let instance;

beforeEach(async () => {
  instance = await Airline.new();
});

contract("Airline", accounts => {
  it("Hay vuelos disponible", async () => {
    let total = await instance.totalFlights();
    // console.log(total);
    assert(total > 0);
  });

  it("Los customers debe permitir comprar un vuelo si lo pagan", async () => {
    let flight = await instance.flights(0);
    let flightName = flight[0],
      flightPrice = flight[1];

    await instance.buyFlight(0, { from: accounts[0], value: flightPrice });
    let customerFlight = await instance.customerFlights(accounts[0], 0);
    let customerTotalFlights = await instance.customerTotalFlights(accounts[0]);

    assert(customerFlight[0], flightName);
    assert(customerFlight[1], flightPrice);
    assert(customerTotalFlights, 1);
  });

  it("No deberia permitir comprar un vuelo por debajo del precio", async () => {
    let flight = await instance.flights(0);
    let price = flight[1] - 5000;
    try {
      await instance.buyFlight(0, { from: accounts[0], value: price });
    } catch (error) {
      return;
    }
    assert.fail();
  });

  it("Obtener el balance real del contrato", async () => {
    let flight1 = await instance.flights(0);
    let price1 = flight1[1];

    let flight2 = await instance.flights(1);
    let price2 = flight2[1];
    await instance.buyFlight(0, { from: accounts[1], value: price1 });
    await instance.buyFlight(1, { from: accounts[1], value: price2 });

    let newAirlineBalance = await instance.getAirlineBalance();

    assert.equal(
      parseFloat(newAirlineBalance),
      parseFloat(price1) + parseFloat(price2)
    );
  });

  it("canjear puntos de lealtad", async () => {
    let flight = await instance.flights(0);
    let price = flight[1];

    await instance.buyFlight(1, { from: accounts[0], value: price });

    let balance = await web3.eth.getBalance(accounts[0]);

    await instance.redeemLoyaltyPoints({ from: accounts[0] });

    let finalBalance = await wb3.eth.getBalance(accounts[0]);

    let customer = await instance.customers(accounts[0]);
    let loyaltiPoints = customer[0];

    assert(loyaltiPoints, 0);
    assert(finalBalance > balance);
  });
});
