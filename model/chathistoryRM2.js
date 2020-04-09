const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
    //logType: {type: String, require:true},
    username: {type:String, require:true},
    message: {type: String, require:true},
    // userId: {type: Schema.Types.ObjectId, ref: 'Chat', require:true},
    date: {type: Date, default: Date.now}
})

const chatHistoryRM2 = mongoose.model('chatHistoryRM2', chatHistorySchema, 'chatHistoriesRM2');
module.exports = chatHistoryRM2