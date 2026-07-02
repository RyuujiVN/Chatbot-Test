import { chatService } from "../../../services/chat.service.js"
import { logger } from "../../../utils/logger.js"

const chatMessage = async (req, res) => {
  const { message, threadId } = req.body

  if (!message || typeof (message) != "string")
    return res.status(400).json({ error: 'Message is required' })

  try {
    const result = await chatService.chat(message, threadId)

    return res.status(200).json({
      answer: result.answer,
      threadId: result.threadId
    })
  } catch (error) {
    logger.error(error.message)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const chatController = {
  chatMessage
}