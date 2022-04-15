const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const dotenv = require('dotenv');
require('dotenv').config();
const dbName = 'social';
const dburl= process.env.MONGO_URL;

module.exports = {MongoClient,dburl,mongodb}
