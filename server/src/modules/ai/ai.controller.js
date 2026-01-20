const aiService = require('./ai.service')

const askAI = async (req, res, next) => {
  try {
    const { topicId, action, level } = req.body

    const result = await aiService.runAI({
      topicId,
      action,
      level
    })

    res.json({
      answer: result
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  askAI
}
