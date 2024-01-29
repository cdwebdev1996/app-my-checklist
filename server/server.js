// fileName : server.js 
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

const apiContext = {
  servers: {
    production: "/api/v1",
    test: "/test/api/v1",
    development: "/dev/api/v1"
  }
};

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

//API CONSUMPTION BASED ON NODE ENVIRONMENT
const env = process.env.NODE_ENV; 
if (env === 'production') {
  app.use(`${apiContext.servers.production}/checklist`, checklists);
} else if (env === 'test') {
  app.use(`${apiContext.servers.test}/checklist`, checklists);
} else {
  app.use(`${apiContext.servers.development}/checklist`, checklists);
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});