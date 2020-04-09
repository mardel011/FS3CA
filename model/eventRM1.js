const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventType: {type: String, require: true},
    username: {type: String, require: false},
    date: {type: Date, default: Date.now}
})

const EventRM1 = mongoose.model('EventRM1', eventSchema, 'EventLogRM1');
module.exports = EventRM1;