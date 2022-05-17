const { ethers } = require("ethers");
const storefrontContract = require("./StoreFront.json");

const supportChainId = 4002;

const RPCS = {
	1: "http://13.59.118.124/eth",
};
const providers = {
	1: new ethers.providers.JsonRpcProvider(RPCS[1])
};

const provider = providers[supportChainId];

const StoreFront = new ethers.Contract(
	storefrontContract.address,
	storefrontContract.abi,
	provider
);


module.exports = { provider, StoreFront};
