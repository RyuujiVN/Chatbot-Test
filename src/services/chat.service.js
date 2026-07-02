import openAI from "../configs/openAI.config.js"

const ASSISTANT_ID = process.env.ASSISTANT_ID

async function chat(message, threadId) {

  // If threadId is provided, reuse the existing thread
  // Otherwise, create a new thread
  const thread = threadId
    ? await openAI.beta.threads.retrieve(threadId)
    : await openAI.beta.threads.create()


  // Add message of user to thread
  await openAI.beta.threads.messages.create(thread.id, {
    role: 'user',
    content: message
  })

  // Create run and auto poll when the status is completed
  const run = await openAI.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: ASSISTANT_ID
  })

  if (run.status != "completed")
    throw new Error(`Run failed with status: ${run.status}`)

  const messages = await openAI.beta.threads.messages.list(thread.id)

  const latestMessage = messages.data[0]?.content

  const answer = latestMessage[0]?.text?.value

  return {
    answer: answer,
    threadId: thread.id
  }
}

export const chatService = {
  chat
}