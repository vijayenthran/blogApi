'use strict';

const mongoose = require('mongoose');

const GeneralBlogSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    author: {firstName:{type: String, required: true},lastName:{type: String, required: true}},
    publishDate: { type: Date, default: Date.now }
});


const general = mongoose.model('general', GeneralBlogSchema);

exports.general = general;