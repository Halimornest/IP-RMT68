const request = require('supertest')
const app = require('../src/app')

jest.mock('../src/modules/ai/ai.service', () => ({
  generateExplanation: jest.fn(),
}))

const aiService = require('../src/modules/ai/ai.service')
const { sequelize } = require('../src/config/database')

let token

beforeAll(async () => {
  await sequelize.sync({ force: true })

  await request(app).post('/api/auth/register').send({
    email: 'explain@test.com',
    password: 'password123',
  })

  const login = await request(app).post('/api/auth/login').send({
    email: 'explain@test.com',
    password: 'password123',
  })

  token = login.body.data.token
})

afterAll(async () => {
  await sequelize.close()
})

describe('POST /api/quiz/explain (AI mocked)', () => {
  test('success explain question', async () => {

    aiService.generateExplanation.mockResolvedValue(
      'Karena React adalah library untuk membangun UI.'
    )

    const res = await request(app)
      .post('/api/quiz/explain')
      .set('Authorization', `Bearer ${token}`)
      .send({
        question: 'Apa itu React?',
        options: ['Library', 'Framework', 'DB', 'OS'],
        correctOptionIndex: 0,
        selectedOptionIndex: 1,
        level: 'beginner',
      })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body.data).toHaveProperty('explanation')
    expect(typeof res.body.data.explanation).toBe('string')

    expect(aiService.generateExplanation).toHaveBeenCalled()
  })

  test('reject if required fields missing', async () => {
    const res = await request(app)
      .post('/api/quiz/explain')
      .set('Authorization', `Bearer ${token}`)
      .send({
        question: 'Apa itu React?',
      })

    expect(res.status).toBe(400)
  })

  test('reject without token', async () => {
    const res = await request(app)
      .post('/api/quiz/explain')
      .send({
        question: 'Apa itu React?',
        options: ['Library', 'Framework'],
        correctOptionIndex: 0,
        selectedOptionIndex: 1,
      })

    expect(res.status).toBe(401)
  })
})
