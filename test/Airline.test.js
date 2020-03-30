import { AssertionError } from "assert";

const Airline = artifacts.require("Airline");

let instance;

beforeEach(async () => {
  instance = await Airline.new();
});

contract("Airline", accounts => {
  it("Hay vuelos disponible", async () => {
    let total = await instance.totalFlights();
    assert(total > 0);
  });
});
