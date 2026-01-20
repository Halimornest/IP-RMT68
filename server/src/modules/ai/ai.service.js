const Topic = require('../learning/topic.model')
const {
  buildPrompt,
  buildOutlinePrompt,
} = require('./prompt.builder')
const { generateContent } = require('./providers/openai.provider')
const { buildQuizPrompt } = require('./prompt.builder')

const runAI = async ({ topicId, action, level }) => {
  const topic = await Topic.findByPk(topicId)
  if (!topic) {
    throw new Error('Topic not found')
  }

  const prompt = buildPrompt({
    topic,
    action,
    level,
  })

  const aiResponse = await generateContent(prompt)
  return aiResponse
}

const generateTopics = async ({ subject, level }) => {
  const prompt = `
You are an education expert.

Create a structured list of learning topics.
Subject: ${subject}
Level: ${level}

Return ONLY a JSON array of strings.
DO NOT wrap the response in markdown.
`

  const response = await generateContent(prompt)

  let cleaned = response
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch (err) {
    console.error('JSON parse failed, fallback used:', err)
    return cleaned
      .split('\n')
      .map(t => t.replace(/^[\d\-\.\s"]+|"+$/g, '').trim())
      .filter(Boolean)
  }
}

const generateOutline = async ({ topicId, level }) => {
  const topic = await Topic.findByPk(topicId)
  if (!topic) {
    throw new Error('Topic not found')
  }

  const prompt = buildOutlinePrompt({
    topicTitle: topic.title,
    level,
  })

  const response = await generateContent(prompt)

  let cleaned = response
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch (err) {
    console.error('Outline JSON parse failed, fallback used:', err)
    return [
      {
        title: topic.title,
        points: cleaned
          .split('\n')
          .map(p => p.replace(/^[\-\d\.]+/, '').trim())
          .filter(Boolean),
      },
    ]
  }
}

const generateQuiz = async ({ topicId, level, count = 5 }) => {
  const topic = await Topic.findByPk(topicId)
  if (!topic) throw new Error('Topic not found')

  const outline = await generateOutline({ topicId, level })

  const prompt = buildQuizPrompt({
    topicTitle: topic.title,
    outline,
    level,
    count,
  })

  const response = await generateContent(prompt)

  let cleaned = response
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch (err) {
    console.error('Quiz JSON parse failed:', err)
    return []
  }
}

module.exports = {
  runAI,
  generateTopics,
  generateOutline,
  generateQuiz,
}

