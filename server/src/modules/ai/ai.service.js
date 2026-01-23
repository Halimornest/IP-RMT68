const Topic = require('../learning/topic.model')
const {
  buildPrompt,
  buildOutlinePrompt,
  buildQuizPrompt,
} = require('./prompt.builder')
const { generateContent } = require('./providers/openai.provider')
const ApiError = require('../../utils/ApiError')

async function runAI({ topicId, action, level }) {
  const topic = await Topic.findByPk(topicId)
  if (!topic) {
    throw new ApiError(404, 'Topic not found')
  }

  const prompt = buildPrompt({
    topic,
    action,
    level,
  })

  return generateContent(prompt)
}

async function generateTopics({ subject, level }) {
  const prompt = `
You are an education expert.

Create a structured list of learning topics.
Subject: ${subject}
Level: ${level}

Return ONLY a JSON array of strings.
DO NOT wrap the response in markdown.
`

  const response = await generateContent(prompt)

  const cleaned = response
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    return cleaned
      .split('\n')
      .map(t => t.replace(/^[\d\-\.\s"]+|"+$/g, '').trim())
      .filter(Boolean)
  }
}

async function generateOutline({ topicId, level }) {
  const topic = await Topic.findByPk(topicId)
  if (!topic) {
    throw new ApiError(404, 'Topic not found')
  }

  const prompt = buildOutlinePrompt({
    topicTitle: topic.title,
    level,
  })

  const response = await generateContent(prompt)

  const cleaned = response
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
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

async function generateQuiz({ topicId, level, count }) {
  const topic = await Topic.findByPk(topicId)
  if (!topic) {
    throw new ApiError(404, 'Topic not found')
  }

  const outline = await generateOutline({ topicId, level })

  const prompt = buildQuizPrompt({
    topicTitle: topic.title,
    outline,
    level,
    count,
  })

  const response = await generateContent(prompt)

  const cleaned = response
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    return []
  }
}

async function generateExplanation(payload) {
  const {
    question,
    options,
    correctOptionIndex,
    selectedOptionIndex,
    level = 'beginner',
  } = payload

  const prompt = `
You are a teaching assistant.

Question:
${question}

Options:
${options.map((o, i) => `${i}. ${o}`).join('\n')}

Correct answer index: ${correctOptionIndex}
User selected index: ${selectedOptionIndex}

Explain briefly (2-3 sentences).
Level: ${level}
Return plain text only.
`

  return generateContent(prompt)
}

module.exports = {
  runAI,
  generateTopics,
  generateOutline,
  generateQuiz,
  generateExplanation,
}
