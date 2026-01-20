const progressService = require('./progress.service')

async function getProgress(req, res, next) {
  try {
    const { topicId } = req.params
    const userId = req.user.id

    const progress = await progressService.getTopicProgress({
      userId,
      topicId,
    })

    res.json(progress)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getProgress,
}
