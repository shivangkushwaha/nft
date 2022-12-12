require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("hardhat-gas-reporter")

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COIN_MARKET_API_KEY = process.env.COIN_MARKET_API_KEY
module.exports = {
  solidity: {
    compilers: [{ version: "0.8.17" }]
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockconfirmations: 1
    },
    goerli: {
      chainId: 5,
      blockconfirmations: 6,
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY
    }
  },
  namedAccounts: {
    deployer: 0,
    player: 1
  },
  mocha: {
    timeout: 80000000 //200 sec
  }
};
