require('dotenv').config()
const mongoose = require('mongoose')




async function connectToDb() {
	try {
		const { MONGODB_URI, NODE_ENV } = process.env;

		if (!MONGODB_URI) {
			throw new Error('MONGODB_URI is not defined in environment variables');
		}



		await mongoose.connect(MONGODB_URI);

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