const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const dbName = 'social';
const dburl= process.env.MONGO_URL;

module.exports = {MongoClient,dburl,mongodb}
