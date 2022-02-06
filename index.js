const Mnemonic =require("bitcore-mnemonic");
const elliptic =require("elliptic");
const { pubToAddress } =require("ethereumjs-util");


function padTo32(msg) {
    while (msg.length < 32) {
      msg = Buffer.concat([Buffer.from([0]), msg])
    }
    if (msg.length !== 32) {
      throw new Error(`invalid key length: ${msg.length}`)
    }
    return msg
  }

function createPrivateKey(seedPhrase){
    const mnemonic = new Mnemonic(seedPhrase)
    const phrase = mnemonic.toString()
  
    const derived = mnemonic.toHDPrivateKey().derive("m/44'/60'/0'/0/0")
  
    const key = derived.privateKey.toBuffer().toString("hex")
    const publicKey = derived.publicKey.toBuffer()
    const ecPublic = new elliptic.ec("secp256k1").keyFromPublic(publicKey).getPublic().toJSON()
    const ethPublic = Buffer.concat([
      padTo32(Buffer.from(ecPublic[0].toArray())),
      padTo32(Buffer.from(ecPublic[1].toArray()))
    ])
    const address = `0x${pubToAddress(ethPublic).toString("hex")}`
  
    console.log(`
      Mnemonic phrase: ${phrase}
      Address: ${address}
      Private Key : ${key}
      `)
  }

  createPrivateKey('Your secret mnemonic seed phrase')