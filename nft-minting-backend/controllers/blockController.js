
const BlockNumber = require('../models/Blocks')


const blockNumController = {
    create: async (props) => {
        var { latestBlock, id } = props;
        const blockNumber = new BlockNumber({ id: id, latestBlock: latestBlock });
        var res = await blockNumber.save();
        return {
            latestBlock: res.latestBlock,
        };
    },
    update: async (props) => {
        var { latestBlock, id } = props;
        await BlockNumber.updateOne(
            { id:id},
            {
                $set: { latestBlock: latestBlock },
                $currentDate: { lastModified: true },
            }
        );
        return true;
    },
    find: async (props) => {
        var { id } = props;
        var res = await BlockNumber.findOne({ id:id });
        return res;
    },
    confirmEvent: async (tokenIds, address) => {
        try {
            await update({ tokenId:{ $in:tokenIds } }, { $set:{ address:address, status:10 } })
            return { err: 0, msg: 'success' }
        } catch (ex) {
            return { err: 1, msg: ex }
        }
    }
};

module.exports = { blockNumController }