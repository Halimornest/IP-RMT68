const { SYSTEM_RULES } = require('./prompt.rules')

const buildPrompt = ({ topic, level, action }) => {
  return `
${SYSTEM_RULES}

Topic: ${topic.title}
Description: ${topic.description}
Level: ${level}
Action: ${action}

Instruction:
- Explain clearly for the given level
- Use examples if needed
- Do not go outside the topic
`
}

module.exports = {
  buildPrompt
}
