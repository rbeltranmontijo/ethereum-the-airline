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

  it('Obtener el balance real del contrato' async () => {
    let flight = await instance.buyFlight(0);
    let price = flight[1];
    let flight2 = await instance.buyFlight(1);
    let price2 = flight2[1]

    await instance.buyFlight(0, { from: accounts[0], value: price})
    await instance.buyFlight(1, { from: accounts[0], value: price2})

    // let newAirlineBalance = await instance.getAi
  })
});
