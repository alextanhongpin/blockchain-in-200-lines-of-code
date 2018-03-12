
// https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js
class Block {
	constructor(index, previousHash, timestamp, data, hash) {
		this.index = index
		this.previousHash = previousHash
		this.timestamp = timestamp
		this.data = data
		this.hash = hash.toString()
	}
}

function calculateHash (index, previousHash, timestamp, data) {
	return CryptoJS.SHA256(index + previousHash + timestamp + data).toString()
}

function generateNextBlock(blockData) {
	const previousBlock = getLatestBlock()
	const nextIndex = previousBlock.index + 1
	const nextTimestamp = new Date().getTime() / 10000
	const nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData)
	return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash)
}

function getGenesisBlock() {
	return new Block(0, "0", 1465154705, "my block", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7")
}

const blockchain = [getGenesisBlock()]

function isValidNewBlock(newBlock, previousBlock) {
	if (previousBlock.index + 1 !== newBlock.index) {
		console.log('invalid index')
		return false
	} else if (previousBlock.hash !== newBlock.previousHash){
		console.log('invalid previoushash')
		return false
	} else if (calculateHashForBlock(newBlock) !== newBlock.hash)  {
		console.log(`invalid hash: ${calculateHashForBlock()}`)
	}
}