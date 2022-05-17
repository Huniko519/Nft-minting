const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
const fs = require('fs');

const upload_IPFS = async ({ imageDatas, resPath }) => {
    const basic_ipfs_url = "https://ipfs.io/ipfs/";
    var ipfsHashes = [];
    for (var i = 0; i < imageDatas.length; i++) {
        const contents = fs.readFileSync(imageDatas[i]);
        var result = await ipfs.files.add(contents);
        var ipfsHash = basic_ipfs_url + result[0].hash;
        ipfsHashes.push(ipfsHash);
        await delay(10000);
    }
    fs.writeFileSync(resPath, JSON.stringify({ ipfsHashes: ipfsHashes }, null, 4), function (err, content) {
        if (err) throw err;
        console.log('complete');
    });
}
module.exports = { upload_IPFS };
