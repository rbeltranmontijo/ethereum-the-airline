const HDWalletProvider = require("truffle-hdwallet-provider");

const mnemonic = "mnemonic here";
const urlRinkeby = "infura url and api rinkeby";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*",
      gas: 5000000
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, urlRinkeby),
      network_id: 4
    }
  },
  compilers: {
    solc: {
      version: "0.4.24"
    }
  }
};
