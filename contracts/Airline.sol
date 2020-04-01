pragma solidity ^0.4.24;


contract Airline {
    address public owner;

    struct Customer {
        uint256 loyaltyPoints;
        uint256 totalFlights;
    }

    struct Flight {
        string name;
        uint256 price;
    }

    uint256 etherPerPoint = 0.5 ether;

    Flight[] public flights;

    mapping(address => Customer) public customers;
    mapping(address => Flight[]) public customerFlights;
    mapping(address => uint256) public customerTotalFlights;

    event FlightPurchased(address indexed customer, uint256 price);

    constructor() public {
        owner = msg.sender;
        flights.push(Flight("Tokio", 4 ether));
        flights.push(Flight("Germany", 3 ether));
        flights.push(Flight("Madrid", 3 ether));
    }

    function buyFlight(uint256 flightIndex) public payable {
        Flight flight = flights[flightIndex];
        require(msg.value == flight.price, "Need value of flight");

        Customer storage customer = customers[msg.sender];
        customer.loyaltyPoints += 5;
        customer.totalFlights += 1;
        customerFlights[msg.sender].push(flight);
        customerTotalFlights[msg.sender]++;

        emit FlightPurchased(msg.sender, flight.price);
    }

    function totalFlights() public view returns (uint256) {
        return flights.length;
    }

    function redeemLoyaltyPoints() public {
        Customer storage customer = customers[msg.sender];
        uint256 etherToRefund = etherPerPoint * customer.loyaltyPoints;
        msg.sender.transfer(etherToRefund);
        customer.loyaltyPoints = 0;
    }

    function getRefundablEther() public view returns (uint256) {
        return etherPerPoint * customers[msg.sender].loyaltyPoints;
    }

    function getAirlineBalance() public view isOWner returns (uint256) {
        address airlineAddress = this;
        return airlineAddress.balance;
    }

    modifier isOWner() {
        require(msg.sender == owner, "Solo el owner puede ver");
        _;
    }
}
