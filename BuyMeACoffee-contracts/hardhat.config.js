require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config()


const POLYGON_URL = process.env.POLYGON_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;


module.exports = {
  solidity: "0.8.9",
  networks: {
    polygon: {
      url: POLYGON_URL,
      accounts: [PRIVATE_KEY]
    }
  }
};