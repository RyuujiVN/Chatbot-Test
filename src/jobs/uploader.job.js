import path from "path"
import fs, { stat } from "fs"
import { detectDelta, loadState, saveState } from "./delta.job.js";
import { logger } from "../utils/logger.js";
import openAI from "../configs/openAI.config.js";

const ARTICLES_DIR = path.join(import.meta.dirname, '..', '..', 'articles')
const VECTOR_STORE_ID = process.env.VECTOR_STORE_ID

// Upload file .md
async function uploadFile(fileName) {
  const filePath = path.join(ARTICLES_DIR, fileName);

  // Upload the file to OpenAI
  const file = await openAI.files.create({
    file: fs.createReadStream(filePath),
    purpose: "assistants",
  });

  // Attach the uploaded file to the Vector Store
  await openAI.vectorStores.files.create(VECTOR_STORE_ID, {
    file_id: file.id,
  });

  return file.id;
}

// Delete old file from Vector Store and OpenAI
async function deleteFile(openaiFileId) {
  // Delete from vector store first
  await openAI.vectorStores.files.del(VECTOR_STORE_ID, openaiFileId);
  // Then delete file
  await openAI.files.del(openaiFileId);
}

export async function runUploader(manifest) {
  // Get current state
  const state = await loadState();
  const { added, updated, skipped } = detectDelta(manifest, state)

  logger.info(`Delta: ${added.length} added, ${updated.length} updated, ${skipped.length} skipped`);

  // Upload new articles
  for (const slug of added) {
    const info = manifest[slug]
    const fileId = await uploadFile(info.file)
    state[slug] = { hash: info.hash, openaiFileId: fileId }
  }

  // Delete old file and upload changed articles
  for (const slug of updated) {
    const info = manifest[slug]
    const prevFileId = state[slug].openaiFileId

    // Delete file
    await deleteFile(prevFileId)
    // Upload file
    const fileId = await uploadFile(info.file)
    state[slug] = { hash: info.hash, openaiFileId: fileId }
  }

  // Save new state
  saveState(state)

  logger.success(
    `Upload done — added: ${added.length}, updated: ${updated.length}, skipped: ${skipped.length}`
  );
}