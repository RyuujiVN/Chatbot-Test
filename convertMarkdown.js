import axios from "axios";
import TurndownService from 'turndown';
import path from 'path';
import fs from 'fs';
import crypto from "crypto"

const ZENDESK_BASE_URL = 'https://support.optisigns.com';
const turndownService = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })
const OUTPUT_DIR = path.join(import.meta.dirname, 'articles')

async function fetchAllArticles() {
  let url = `${ZENDESK_BASE_URL}/api/v2/help_center/en-us/articles.json?per_page=50`
  const articles = []

  const { data } = await axios.get(url)
  articles.push(...data.articles)

  return articles
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
}

function convertHtmlToMarkdown(html) {
  turndownService.remove(['script', 'style', 'nav'])
  return turndownService.turndown(html)
}

export async function scrapeAndSaveArticles() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR)

  const articles = await fetchAllArticles()
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

  fs.writeFileSync(path.join(import.meta.dirname, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8')
  
  console.log(`Saved ${articles.length} markdown files`)

  return manifest
}