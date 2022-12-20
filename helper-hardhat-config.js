const { ethers } = require("hardhat")

const networkConfig = {
    5: {
        name: 'goerli',
        vrfCoordinatorV2: '0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D',
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        subscriptionId: "7477",
        callBackGasLimit: "50000",
        interval: "30",
        mintFee: "10000000000000000"
    },
    31337: {
        name: 'hardhat',
        vrfCoordinatorV2: '0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D',
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        callBackGasLimit: "50000",
        interval: "30",
        mintFee: "10000000000000000"
    }
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    developmentChains, networkConfig
}