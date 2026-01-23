const buildTopicGeneratorPrompt = ({ subject, level }) => {
  return `
You are an educational curriculum designer.

Generate a list of learning topics for the subject: "${subject}"
Target level: "${level}"

Rules:
- Only educational topics
- Beginner friendly
- Each topic must be concise
- Do NOT include explanations
- Do NOT include numbering
- Return JSON ONLY in this format:

[
  {
    "title": "Topic title",
    "description": "Short description"
  }
]

Return ONLY valid JSON.
`
}

module.exports = {
  buildTopicGeneratorPrompt
}
