const Topic = require('../learning/topic.model')
const { buildPrompt } = require('./prompt.builder')
const { generateContent } = require('./providers/openai.provider')

const runAI = async ({ topicId, action, level }) => {
  const topic = await Topic.findByPk(topicId)
  if (!topic) {
    throw new Error('Topic not found')
  }

  const prompt = buildPrompt({
    topic,
    action,
    level
  })

  // ✅ FIX DI SINI
  const aiResponse = await generateContent(prompt)

  return aiResponse
}

module.exports = {
  runAI
}
