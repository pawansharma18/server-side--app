const axios = require('axios');
const Crypto = require('../models/Crypto');

const fetchCryptoData = async () => {
    try {
        const coins = ['bitcoin', 'matic-network', 'ethereum'];
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(',')}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`;

        const response = await axios.get(url);
        const data = response.data;

        for (const coin of coins) {
            const record = new Crypto({
                coin: coin,
                price: data[coin].usd,
                marketCap: data[coin].usd_market_cap,
                change24h: data[coin].usd_24h_change,
            });
            await record.save();
        }
        console.log('Crypto data fetched and stored successfully.');
    } catch (error) {
        console.error('Error fetching crypto data:', error);
    }
};

module.exports = fetchCryptoData;
