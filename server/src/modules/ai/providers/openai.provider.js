const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const generateContent = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.3
  })

  return response.choices[0].message.content
}

module.exports = {
  generateContent
}
