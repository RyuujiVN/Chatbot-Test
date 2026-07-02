import path from 'path';
import fs from 'fs';
import { logger } from '../utils/logger.js';
import axios from 'axios';
import crypto from "crypto"
import { convertHtmlToMarkdown, slugify } from '../utils/convertMarkdown.util.js';

const ZENDESK_BASE_URL = 'https://support.optisigns.com';
const OUTPUT_DIR = path.join(import.meta.dirname, '..', '..', 'articles')

async function fetchAllArticles() {
  let url = `${ZENDESK_BASE_URL}/api/v2/help_center/en-us/articles.json?per_page=50`
  const articles = []

  while (url) {
    const { data } = await axios.get(url)
    articles.push(...data.articles)
    url = data.next_page
  }

  return articles
}

export async function scrapeAndSaveArticles() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR)

  logger.info("Fetching articles from Zendesk...")
  const articles = await fetchAllArticles()
  logger.success(`Fetched success ${articles.length} articles`)

  const manifest = {}

  for (const article of articles) {
    const markdownBody = convertHtmlToMarkdown(article.body)
    const slug = slugify(article.title)
    const fullContent = `# ${article.title}\n\nArticle URL: ${article.html_url}\n\n${markdownBody}`;

    const filePath = path.join(OUTPUT_DIR, `${slug}.md`)
    fs.writeFileSync(filePath, fullContent, 'utf-8')

    const hash = crypto.createHash('sha256').update(fullContent).digest('hex')

    manifest[slug] = {
      hash,
      file: `${slug}.md`
    }
  }

  logger.success(`Saved ${articles.length} markdown files`)

  return manifest
}