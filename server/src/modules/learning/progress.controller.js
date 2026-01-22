const progressService = require('./progress.service')
const { requireUUID } = require('../../utils/validation')

async function getMyProgress(req, res, next) {
  try {
    const userId = req.user.id
    const data = await progressService.getMyProgress({ userId })

    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

async function getProgress(req, res, next) {
  try {
    const { topicId } = req.params
    const userId = req.user.id

    requireUUID(topicId, 'topicId')

    const data = await progressService.getTopicProgress({
      userId,
      topicId,
    })

    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

async function getHistory(req, res, next) {
  try {
    const { topicId } = req.params
    const userId = req.user.id

    requireUUID(topicId, 'topicId')

    const history = await progressService.getQuizHistory({
      userId,
      topicId,
    })

    res.json({ success: true, data: history })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getMyProgress,
  getProgress,
  getHistory,
}
