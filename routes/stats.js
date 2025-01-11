const express = require('express');
const Crypto = require('../models/Crypto');

const router = express.Router();

// GET /stats
router.get('/', async (req, res) => {
    const { coin } = req.query;
    try {
        const latestRecord = await Crypto.findOne({ coin }).sort({ timestamp: -1 });
        if (!latestRecord) {
            return res.status(404).json({ message: 'No data found for the requested cryptocurrency.' });
        }

        res.json({
            price: latestRecord.price,
            marketCap: latestRecord.marketCap,
            '24hChange': latestRecord.change24h,
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
