require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
const ALCHEMY_API_KEY = "1swcbrxABEmfMryTj2YNLk2VLAJwRuzY";
const SEPOLIA_PRIVATE_KEY = "801671f7e7e7d71c99300c475e72596d6f4bbc346f7bf1afec5cc370cb51afa9"

module.exports = {
  solidity: "0.8.17",
  etherscan: {
    apiKey: "SUTK6EUYX6JSAVTB9FC6TDSIRGG3FDWCMA",
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts:[SEPOLIA_PRIVATE_KEY]
    }
  }
};
