require('dotenv').config()
const mongoose = require('mongoose')




async function connectToDb() {
	try {
		const { DATABASE_URL, NODE_ENV } = process.env;

		if (!DATABASE_URL) {
			throw new Error('DATABASE_URL is not defined in environment variables');
		}



		await mongoose.connect(DATABASE_URL);

		if (NODE_ENV !== 'production') {
			mongoose.set('debug', true);
		}

		mongoose.connection.on('error', err => {
			console.error('MongoDB connection error:', err);
		});

		mongoose.connection.on('disconnected', () => {
			console.log('MongoDB disconnected');
		});

		return mongoose.connection;
	} catch (err) {
		console.error('Database connection error:', err);
		throw err;
	}
};

module.exports = connectToDb;