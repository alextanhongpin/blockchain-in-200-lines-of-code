
const CryptoJS = require('crypto-js')

class Block {
  constructor (index, previousHash, timestamp, data, hash) {
    this.index = index
    this.previousHash = previousHash
    this.timestamp = timestamp
    this.data = data
    this.hash = hash.toString()
  }

  static calculateHashForBlock ({index, previousHash, timestamp, data}) {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString()
  }
}

class Blockchain {
  constructor () {
    this.blockchain = [this._getGenesisBlock()]
  }

  _getGenesisBlock () {
    return new Block(0, '0', 1465154705, 'my block', '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7')
  }

  static isValidNewBlock (newBlock, previousBlock) {
    if (previousBlock.index + 1 !== newBlock.index) {
      console.log('invalid index')
      return false
    } else if (previousBlock.hash !== newBlock.previousHash) {
      console.log('invalid previoushash')
      return false
    } else if (Block.calculateHashForBlock(newBlock) !== newBlock.hash) {
      console.log(`invalid hash: ${Block.calculateHashForBlock()}`)
      return false
    }
    return true
  }

  addBlock (newBlock) {
    if (Blockchain.isValidNewBlock(newBlock, this.getLatestBlock())) {
      this.blockchain.push(newBlock)
    }
  }

  generateNextBlock (blockData) {
    const previousBlock = this.getLatestBlock()
    const nextIndex = previousBlock.index + 1
    const nextTimestamp = new Date().getTime() / 10000
    const nextHash = Block.calculateHashForBlock({
      index: nextIndex,
      previousHash: previousBlock.hash,
      timestamp: nextTimestamp,
      data: blockData
    })
    return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash)
  }

  getLatestBlock () {
    return this.blockchain[this.blockchain.length - 1]
  }

  replaceChain (newBlocks) {
    if (Blockchain.isValidChain(newBlocks) && newBlocks.length > this.blockchain.length) {
      console.log('Received blockchain is valid. Replacing current blockchain with received blockchain.')
      this.blockchain = newBlocks
      console.log(this.responseLatestMsg())
    } else {
      console.log('Received blockchain invalid')
    }
  }
  static isValidChain (blockchainToValidate) {
    if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(getGenesisBlock())) {
      return false
    }

    const tempBlocks = [blockchainToValidate[0]]
    for (let i = 0; i < blockchainToValidate.length; i += 1) {
      if (Blockchain.isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
        tempBlocks.push(blockchainToValidate[i])
      } else {
        return false
      }
    }
    return true
  }
  responseLatestMsg () {
    return {
      type: 2,
      data: JSON.stringify([this.getLatestBlock()])
    }
  }
}

function main () {
  const blockchain = new Blockchain()

  const newBlock = blockchain.generateNextBlock('hello world')
  blockchain.addBlock(newBlock)
  console.log(blockchain.responseLatestMsg())
  console.log(JSON.stringify(newBlock))

  const newBlock2 = blockchain.generateNextBlock('hi')
  blockchain.addBlock(newBlock2)
  console.log(blockchain.responseLatestMsg())
  console.log(JSON.stringify(newBlock2))
}

main()
