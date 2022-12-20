const { network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")
const imagestLocations = "./images/randomNft"
const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: 'cuteness',
            value: 100
        }
    ]
}
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let vrfcoordinatorV2Adress, subscriptionId;
    let tokenUris;
    if (process.env.UPLOAD_TO_PINATA == 'true') {
        tokenUris = await handleTokenUris()
    }
    // get the IPFS hashes of our images.
    // 1. with our own IPFS Node.
    // 2.Pinata or nft.storage
    if (developmentChains.includes(network.name)) {

        const vrfCoordinatorv2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfcoordinatorV2Adress = vrfCoordinatorv2Mock.address;
        const tx = await vrfCoordinatorv2Mock.createSubscription();
        const txRecipt = await tx.wait(1);
        subscriptionId = txRecipt.events[0].args.subId;
    }
    else {
        vrfcoordinatorV2Adress = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }
    console.log("All values Found....")
    // await storeImages(imagestLocations)
    const args = [
        vrfcoordinatorV2Adress,
        subscriptionId,
        networkConfig[chainId].gasLane,
        networkConfig[chainId].callBackGasLimit,
        tokenUris,
        networkConfig[chainId].mintFee,
    ]
    const randomIpfsNft = await deploy("RandomIpfsNft", {
        from: deployer,
        args,
        log: true,
        waitConfirmations: networkConfig.blockConfirmations || 1
    })

    if (!(developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY)) {
        console.log('Verifying My Contract-----------')
        await verify(randomIpfsNft.address, args)
    }

}
module.exports.tags = ["all", "basicnft", "main"]





const handleTokenUris = async () => {
    tokrnUris = []
    // string Image On IPFS
    // Store the metadata in IPFS
    const { responses: imageUploadedResponses, files } = await storeImages(imagestLocations);
    for (const i in imageUploadedResponses) {
        // create matadat 
        // upload metadata
        let tokenUriMetaData = { ...metadataTemplate }
        tokenUriMetaData.name = files[i].replace(".png", "")
        tokenUriMetaData.description = `An adorable ${tokenUriMetaData.name} pup!`
        tokenUriMetaData.image = `ipfs://${imageUploadedResponses[i].IpfsHash}`
        console.log(`Uploadding File ${tokenUriMetaData.name}....`)
        // store json
        const metadataUploadresponse = await storeTokenUriMetadata(tokenUriMetaData)
        tokrnUris.push(`ipfs://${metadataUploadresponse.IpfsHash}`)
    }
    console.log('*********Token Uris uploaded**********')
    console.log(tokrnUris)
    return tokenUris;
}


module.exports.tags = ['all', 'randomipfs', 'main']