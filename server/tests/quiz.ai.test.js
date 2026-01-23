const request = require('supertest')
const app = require('../src/app')

jest.mock('../src/modules/ai/ai.service', () => ({
  generateQuiz: jest.fn(),
}))

const aiService = require('../src/modules/ai/ai.service')
const { sequelize } = require('../src/config/database')

let token
let topicId

beforeAll(async () => {
  await sequelize.sync({ force: true })

  await request(app).post('/api/auth/register').send({
    email: 'ai@test.com',
    password: 'password123',
  })

  const login = await request(app).post('/api/auth/login').send({
    email: 'ai@test.com',
    password: 'password123',
  })

  token = login.body.data.token

  const topic = await sequelize.models.Topic.create({
    title: 'React',
    subject: 'Frontend',
    level: 'beginner',
    userId: login.body.data.user.id,
  })

  topicId = topic.id
})

describe('POST /api/quiz/generate-and-save (AI mocked)', () => {
  test('success generate quiz with mocked AI', async () => {
    aiService.generateQuiz.mockResolvedValue([
      {
        question: 'Apa itu React?',
        options: ['Library', 'Framework', 'DB', 'OS'],
        answer: 'Library',
      },
    ])

    const res = await request(app)
      .post('/api/quiz/generate-and-save')
      .set('Authorization', `Bearer ${token}`)
      .send({
        topicId,
        level: 'beginner',
        count: 1,
      })

    expect(res.status).toBe(201)
    expect(res.body.data.quiz.length).toBe(1)
    expect(aiService.generateQuiz).toHaveBeenCalled()
  })
})

afterAll(async () => {
  await sequelize.close()
})
