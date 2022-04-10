const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const dbName = 'social';
const dburl=`mongodb+srv://Jyothsna:Jyothsna123@cluster0.toued.mongodb.net/test${dbName}`;

module.exports = {MongoClient,dburl,mongodb}