import express from 'express';
import 'dotenv/config'
import bodyParser from 'body-parser';
import route from './src/api/v1/routes/route.js';

const app = express();
const port = 3000;

// parse application/json
app.use(bodyParser.json())

// Route
route(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});