const { SYSTEM_RULES } = require('./prompt.rules')

const buildPrompt = ({ topic, level, action }) => {
  return `
${SYSTEM_RULES}

Topic: ${topic.title}
Description: ${topic.description || '-'}
Level: ${level}
Action: ${action}

Instruction:
- Explain clearly for the given level
- Use examples if needed
- Do not go outside the topic
`
}

const buildOutlinePrompt = ({ topicTitle, level }) => {
  return `
${SYSTEM_RULES}

You are an expert educator.

Create a structured learning OUTLINE for the topic below.

Topic: ${topicTitle}
Level: ${level}

Rules:
- Return ONLY valid JSON
- DO NOT wrap in markdown
- Use this exact structure:

[
  {
    "title": "Section title",
    "points": [
      "Point 1",
      "Point 2"
    ]
  }
]
`
}

function buildQuizPrompt({ topicTitle, outline, level, count }) {
  return `
You are an expert educator.

Create a multiple-choice quiz based on the learning outline below.

Topic: ${topicTitle}
Level: ${level}
Total Questions: ${count}

Outline:
${outline
  .map(
    (section, i) =>
      `${i + 1}. ${section.title}\n- ${section.points.join('\n- ')}`
  )
  .join('\n\n')}

Rules:
- Return ONLY valid JSON
- DO NOT wrap in markdown
- Each question must have:
  - question (string)
  - options (array of 4 strings)
  - answer (string, must match one option)

Format:
[
  {
    "question": "Question text",
    "options": ["A", "B", "C", "D"],
    "answer": "B"
  }
]
`
}

module.exports = {
  buildPrompt,
  buildOutlinePrompt,
  buildQuizPrompt,
}
