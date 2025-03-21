require('dotenv').config();
const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");

const chatModel = new ChatOpenAI({
  modelName: "gpt-4-turbo",
  temperature: 0,
  maxTokens: 4096,
  openAIApiKey: process.env.OPENAI_API_KEY
});

async function getCompletionFromMessages(messages) {
  try {
    // Convert to LangChain message format
    const langchainMessages = messages.map(msg => {
      if (msg.role === 'system') {
        return new SystemMessage(msg.content);
      } else {
        return new HumanMessage(msg.content);
      }
    });

    const response = await chatModel.call(langchainMessages);
    return response.content;
  } catch (err) {
    console.error("Error connecting to OpenAI via LangChain:", err.message);
    throw new Error("Failed to fetch classification from OpenAI.");
  }
}

module.exports = { getCompletionFromMessages };
