import path from "path"
import fs from "fs"

const STATE_FILE = path.join(import.meta.dirname, '..', '..', 'state.json')

// Get list
export async function loadState() {
  if (!fs.existsSync(STATE_FILE)) return {}
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"))
}

// Save state
export function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))
}

// Compare new manifest with old state
export function detectDelta(manifest, state) {
  const added = [] // slug of new articles
  const updated = [] // slug of articles which has been updated
  const skipped = [] // slug of articles which not update

  for (const [slug, info] of Object.entries(manifest)) {
    const prev = state[slug]

    if (!prev) added.push(slug)
    else if (prev.hash != info.hash) updated.push(slug)
    else skipped.push(slug)
  }

  return { added, updated, skipped }
}