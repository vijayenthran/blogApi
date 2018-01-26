'use strict';

const mongoose = require('mongoose');

const animalBlogSchema = mongoose.Schema({
    name: {type: String, required: true},
    breed: {type: String, required: true},
    content: {type: String, required: true},
    author: {firstName:{type: String, required: true},lastName:{type: String, required: true}},
    publishDate: { type: Date, default: Date.now }
});


const animal = mongoose.model('animal', animalBlogSchema);

exports.animal = animal;