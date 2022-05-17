
const fs = require('fs');

async function main() {
	const [signer] = await ethers.getSigners();
	const StoreFront = await ethers.getContractFactory("StoreFront");

	const storeFront = await StoreFront.deploy()
	
	const contract = storeFront.address
	fs.writeFileSync(__dirname + '/../src/config/v1.json', JSON.stringify({ contract }, null, '\t'))
}

main().then(() => {
}).catch((error) => {
	console.error(error);
	process.exit(1);
});
