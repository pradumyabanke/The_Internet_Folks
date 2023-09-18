const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    owner: { type: String, required: true },
}, { timestamps: true });


module.exports = mongoose.model("CreateCommunity", communitySchema);
