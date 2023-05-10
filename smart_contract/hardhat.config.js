//https://eth-goerli.g.alchemy.com/v2/KcvUQjFSFWqary1D4QGWfdThB_hMWDQJ


require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: '0.8.0', 
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/KcvUQjFSFWqary1D4QGWfdThB_hMWDQJ", 
      accounts: ["ef36fcf5dfee1e70d943da224e2eb083733eeca7f8441c5f464afc6eb6f8e08a"]
    }
  }
}