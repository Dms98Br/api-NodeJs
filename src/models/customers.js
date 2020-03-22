'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    
    name:{
        type: String,
        required: [true, 'O nome é obrigatório'],
        trim: true
    },
    email:{
        type: String,
        required: [true, 'O email é obrigatório'],
        trim: true
    },
    password:{
        type: String,
        required: [true, 'A senha é obrigatória'],
        trim: true
    },
    roles: [{
        type: String,
        required: true,
        enum:['user', 'admin'],
        default:'user'
    }]

});

module.exports = mongoose.model('customers',schema);