const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fetchCryptoData = require('./jobs/fetchCryptoData');
const statsRoute = require('./routes/stats');
const deviationRoute = require('./routes/deviation');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB Connection Error:', err));

// Middleware
app.use(express.json());

// Routes
app.use('/stats', statsRoute);
app.use('/deviation', deviationRoute);

// Run the background job every 2 hours
setInterval(fetchCryptoData, 2 * 60 * 60 * 1000); // 2 hours in milliseconds
fetchCryptoData(); // Run immediately on startup

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
