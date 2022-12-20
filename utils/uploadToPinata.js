const pinataSDk = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET
const pinata = new pinataSDk(pinataApiKey, pinataApiSecret)
async function storeImages(imageFilePath) {
    const fullImagesPath = path.resolve(imageFilePath)

    const files = fs.readdirSync(fullImagesPath)
    let responses = []
    for (const fileIndex in files) {
        console.log('fileIndex', fileIndex)
        console.log(`File Name`, `${fullImagesPath}/${files[fileIndex]}`)
        const redableStramFromFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)
        try {
            const response = await pinata.pinFileToIPFS(redableStramFromFile)
            responses.push(response)
        }
        catch (error) {
            console.log('Error in saving file on puinata ', error)
        }
    }
    return { responses, files }
}

async function storeTokenUriMetadata(metadata) {
    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    }
    catch (error) {
        console.error('Error in saving Data for this file')
        return null
    }
}
module.exports = { storeImages, storeTokenUriMetadata }