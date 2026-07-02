import express from "express"
import { chatController } from "../controllers/chat.controller.js"
const router = express.Router()


router.post('/sendMessage', chatController.chatMessage)


export default router