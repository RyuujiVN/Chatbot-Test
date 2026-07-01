import express from 'express';
import { scrapeAndSaveArticles } from './convertMarkdown.js';
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  await scrapeAndSaveArticles()
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});