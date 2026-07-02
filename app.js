import express from 'express';
import 'dotenv/config'
import bodyParser from 'body-parser';
import route from './src/api/v1/routes/route.js';

const app = express();

// parse application/json
app.use(bodyParser.json())

// Route
route(app)

export default app