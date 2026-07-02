import OpenAI from "openai";
import 'dotenv/config'


const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default openAI