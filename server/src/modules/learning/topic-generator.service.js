const Topic = require('./topic.model')
const { generateContent } = require('../ai/providers/openai.provider')
const {
  buildTopicGeneratorPrompt
} = require('../ai/topic-generator.prompt')

const generateTopics = async ({ subject, level }) => {
  const prompt = buildTopicGeneratorPrompt({ subject, level })

  const aiResponse = await generateContent(prompt)

  let topics
  try {
    topics = JSON.parse(aiResponse)
  } catch (err) {
    throw new Error('AI response is not valid JSON')
  }

  const savedTopics = []

  for (const topic of topics) {
    if (!topic.title || !topic.description) continue

    const newTopic = await Topic.create({
      title: topic.title,
      description: topic.description,
      subject,
      level
    })

    savedTopics.push(newTopic)
  }

  return savedTopics
}

module.exports = {
  generateTopics
}
