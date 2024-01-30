// fileName : server.js 
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const ENVIRONMENT_VARIABLES = require('./config/dotenv.config');

const app = express();
const context = '/api/v1/checklist';
const env = ENVIRONMENT_VARIABLES.env || 'dev';
const port = process.env.PORT || 5000;

//ROUTES
const checklists = require('./routes/checklists.api');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(`/${env}${context}`, checklists);

app.listen(port, () => {
  console.log(`Server running on PORT = ${port}`);
  console.log(`Server running on ${env.toUpperCase()} ENVIRONMENT`);
  console.log(`All rights reserved`);
});