const mysql = require('mysql');
const ENVIRONMENT_VARIABLES = require('../config/dotenv.config');

module.exports = mysql.createPool({ ...ENVIRONMENT_VARIABLES.db });