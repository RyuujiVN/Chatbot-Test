import TurndownService from 'turndown';
const turndownService = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })

export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
}

export function convertHtmlToMarkdown(html) {
  // Remove script, style, nav element
  turndownService.remove(['script', 'style', 'nav'])
  return turndownService.turndown(html)
}

