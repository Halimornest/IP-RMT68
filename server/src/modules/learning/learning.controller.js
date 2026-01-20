const learningService = require('./learning.service')
const { getTopicProgress } = require('./learning.service')

const getTopics = async (req, res, next) => {
  try {
    const topics = await learningService.getAllTopics()
    res.json(topics)
  } catch (err) {
    next(err)
  }
}

const getTopicDetail = async (req, res, next) => {
  try {
    const topic = await learningService.getTopicById(req.params.id)
    res.json(topic)
  } catch (err) {
    next(err)
  }
}

const updateProgress = async (req, res, next) => {
  try {
    const result = await learningService.updateProgress({
      userId: req.user.id,
      ...req.body
    })
    res.json(result)
  } catch (err) {
    next(err)
  }
}

async function getProgress(req, res, next) {
  try {
    const { topicId } = req.params
    const userId = req.user.id

    const progress = await getTopicProgress({
      userId,
      topicId,
    })

    res.json(progress)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getTopics,
  getTopicDetail,
  updateProgress,
    getProgress,
}
