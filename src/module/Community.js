const mongoose = require("mongoose");
const { Snowflake } = require('@theinternetfolks/snowflake');

const workerId = 1;
const dataCenterId = 1;

function generateSnowflakeId() {
    const timestamp = new Date().getTime() - 1609459200000;
    const uniqueId = (timestamp << 22) | (workerId << 17) | (dataCenterId << 12) | (Math.floor(Math.random() * 4096));
    return uniqueId.toString();
}

const communitySchema = new mongoose.Schema({
    id: {type: String,default: generateSnowflakeId},
    name: { type: String, required: true },
    slug: { type: String, required: true },
    owner: { type: String, required: true },
}, { timestamps: true });


module.exports = mongoose.model("CreateCommunity", communitySchema);
