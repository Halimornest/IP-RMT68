const Topic = require('./topic.model')

async function createTopics({ topics, subject, level, userId }) {
  const data = topics.map(title => ({
    title,
    subject,
    level,
    userId,
  }))

  return Topic.bulkCreate(data, { returning: true })
}

async function getAllTopics() {
  return Topic.findAll({
    order: [['created_at', 'DESC']],
  })
}

async function getTopicById(id) {
  return Topic.findByPk(id)
}

module.exports = {
  createTopics,
  getAllTopics,
  getTopicById,
}

