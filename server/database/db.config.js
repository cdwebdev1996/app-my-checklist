const mysql = require('mysql');
const db_connection = require('../config/dotenv.config');

module.exports = mysql.createPool({ ...db_connection.db });