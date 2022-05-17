
const BlockNumController = require('./controllers/blockController');

const {	provider, StoreFront} = require('./contracts');

const handleBuy = () => {
	const handler = async (tx) => {
		var tokenDatas = {
			address: tx.args._address,
			tokens: tx.args._tokens,
			price: tx.args._price
		};
		try {
            BlockNumController.confirmEvent(tokenDatas.tokens, tokenDatas.address)
		} catch (err) {
			console.log(
				"buy handle error:", err.message
			)
		}
	}

	handleEvent({
		id: "buy",
		provider: provider,
		contract: StoreFront,
		event: "Buy",
		times: 15,
		handler: handler
	});
}

const handleEvent = (props) => {
    const { id, provider, contract, event, times, handler} = props;

    var latestblocknumber;
    const handletransactions = async () => {
        try {
            let blockNumber = await provider.getBlockNumber();
            if (blockNumber > latestblocknumber) {
                console.log("currenct block: ", blockNumber, "latest block", latestblocknumber);
                blockNumber = blockNumber - latestblocknumber > 20 ? latestblocknumber + 20 : blockNumber;
                console.log("handle transactions : ", latestblocknumber, blockNumber);
                var txhistory = contract.queryFilter(event, latestblocknumber + 1, blockNumber);
                await txhistory.then(async (res) => {
                    for (var index in res) {
                        handler(res[index]);
                    }
                });
                latestblocknumber = blockNumber;

                await BlockNumController.update({
                    id: id,
                    latestBlock: blockNumber
                });
            }
        } catch (err) {
            console.log("handleEvent err", err)
        }
    }

    const handleEvent = async () => {
        var blockNumber = 0;
        try {
            blockNumber = (await BlockNumController.find({ id: id }))[0].latestBlock;
            if (!blockNumber) throw new Error("not find");
        } catch (err) {
            try {
                blockNumber = await provider.getBlockNumber();
                await BlockNumController.create({
                    id: id,
                    latestBlock: blockNumber
                });
            } catch (err) {
                console.log("provider err,", err.message);
            }
        }
        latestblocknumber = Number(blockNumber);
        setTimeout(() => {
            handletransactions();
        }, times);
    }

    handleEvent();
}


module.exports = {handleBuy}