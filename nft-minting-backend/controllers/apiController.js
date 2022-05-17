require('dotenv').config()

const bs58 = require('bs58')
const ethers = require('ethers')
/* const keccak256 = require('keccak256') */
const {NftModal} = require('../models/Nfts')
const config = require('../config/config')
const Price = ethers.utils.parseEther(config.NFT_price).toHexString();
const signerKey = process.env.SIGNERKEY || ''

exports.sign = async (tokens, price) => {
    try {
        const wallet = new ethers.Wallet(signerKey) 
        let messageHash = ethers.utils.solidityKeccak256(["uint256[]", "uint"], [tokens, price]);
        let signature = await wallet.signMessage(ethers.utils.arrayify(messageHash));
        return signature
    } catch (err) {
        console.log(err)
    }
    return null
}

exports.getBuyParams = async (count) =>{
    try{
        const tokens = []
        var rows = await NftModal.find({status:{$ne:10}}).sort({ tokenId:1 }).limit(count);    
        if(rows.length <count)return {err:2, msg:'balance is less than count'}
        if(rows) {
            for(let i of rows) tokens.push('0x' + i.tokenId)
        }
        const signature = await exports.sign(tokens, Price)
        return {err:0, msg : { tokens, price:Price, signature } };
    }catch(ex){
        console.log(ex)
        return {err:1, msg:ex}
    }
}

exports.insertData = async (props) => {
    try{
        const instance = new NftModal(props);
        var res = await instance.save();
        return {err:0, msg:'success', data:res}
    }catch(ex){
        return {err:1, msg:ex}
    }
}
exports.updateJsonHash = async (id, metahash, meta) => {
    try{
        const bytes = bs58.decode(metahash)
        const hex = Buffer.from(bytes).toString('hex')
        const tokenId = hex.slice(4)
        await NftModal.updateOne({ _id: id }, { metahash, tokenId, meta });
        console.log(`Created new token (tokenId: ${tokenId})`)
        return {err:0, msg:'success'}
    }catch(ex){
        return {err:1, msg:ex}
    } 
}