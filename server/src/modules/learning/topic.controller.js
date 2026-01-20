const {
  generateTopics
} = require('./topic-generator.service')

const generateLearningTopics = async (req, res, next) => {
  try {
    const { subject, level } = req.body

    if (!subject || !level) {
      throw new Error('subject and level are required')
    }

    const topics = await generateTopics({ subject, level })

    res.status(201).json({
      topics
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  generateLearningTopics
}
