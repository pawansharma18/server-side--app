const express = require('express');
const Crypto = require('../models/Crypto');

const router = express.Router();

router.get('/', async (req, res) => {
    const { coin } = req.query;
    if (!coin) return res.status(400).send({ error: 'Coin is required' });

    try {
        const prices = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(100).select('price');
        if (prices.length === 0) return res.status(404).send({ error: 'Not enough data available' });

        const priceArray = prices.map(record => record.price);
        const mean = priceArray.reduce((sum, val) => sum + val, 0) / priceArray.length;

        const variance = priceArray.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / priceArray.length;
        const deviation = Math.sqrt(variance);

        res.json({ deviation: parseFloat(deviation.toFixed(2)) });
    } catch (error) {
        res.status(500).send({ error: 'Error calculating deviation' });
    }
});

module.exports = router;
