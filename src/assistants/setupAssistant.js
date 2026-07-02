
import path from "path"
import fs from "fs"
import openAI from "../configs/openAI.config.js";
import { logger } from "../utils/logger.js";

const ARTICLES_DIR = path.join(import.meta.dirname, '..', '..', 'articles')
const SYSTEM_INTRUCTION = `You are OptiBot, the customer-support bot for OptiSigns.com.
- Tone: helpful, factual, concise.
- Only answer using the uploaded docs.
- Max 5 bullet points; else link to the doc.
- Cite up to 3 "Article URL:" lines per reply.`



const createVectorStore = async () => {
  const vectorStore = await openAI.vectorStores.create({
    name: "OptiSigns AI Support FAQ"
  });

  logger.success(`Created vector store: ${vectorStore.id}`);

  return vectorStore
}

const uploadFiletoVectorStore = async () => {
  // 1. Create vector store
  const vectorStore = await createVectorStore();

  // 2. Create Assistant and attach vector store
  const assistant = await openAI.beta.assistants.create({
    name: "OptiSigns AI Support",
    model: "gpt-4o-mini",
    instructions: SYSTEM_INTRUCTION,
    tools: [{ type: "file_search" }],
    tool_resources: {
      file_search: { vector_store_ids: [vectorStore.id] }
    }
  })

  logger.info(`Assistant id: ${assistant.id}`)
  logger.info(`Vector store id: ${vectorStore.id}`)
}

uploadFiletoVectorStore()