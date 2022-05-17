const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlockSchema = new Schema(
	{
		id:String,
		latestBlock: Number
	}, { timestamps: true }
)


const BlockNumber = mongoose.model('blocknumber', BlockSchema);
module.exports = {BlockNumber}
