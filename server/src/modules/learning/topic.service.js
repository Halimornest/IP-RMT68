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

module.exports = { createTopics }
