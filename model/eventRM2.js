const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventType: {type: String, require: true},
    username: {type: String, require: false},
    date: {type: Date, default: Date.now}
})

const EventRM2 = mongoose.model('EventRM2', eventSchema, 'EventLogRM2');
module.exports = EventRM2;