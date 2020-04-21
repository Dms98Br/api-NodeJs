const express = require('express')
const router = express.Router();

exports.get = async (req, res) => {
    
    res.send({ ok: 'Token válidado', user: req.userId });    
}

