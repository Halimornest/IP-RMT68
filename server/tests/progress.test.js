require("../src/models/associations");
const request = require("supertest");
const app = require("../src/app");

require("../src/models/associations");

const { sequelize } = require("../src/config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.models.User;
const Topic = sequelize.models.Topic;
const Quiz = sequelize.models.Quiz;
const QuizResult = sequelize.models.QuizResult;

let token;
let topicId;
let userId;

beforeAll(async () => {

  await QuizResult.destroy({ where: {}, truncate: true, cascade: true });
  await Quiz.destroy({ where: {}, truncate: true, cascade: true });
  await Topic.destroy({ where: {}, truncate: true, cascade: true });
  await User.destroy({ where: {}, truncate: true, cascade: true });

  const user = await User.create({
    email: "student@mail.com",
    passwordHash: await bcrypt.hash("password123", 10),
    provider: "local",
    role: "student",
  });

  userId = user.id;

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({
      email: "student@mail.com",
      password: "password123",
    });

  token = loginRes.body.data.token;

  const topic = await Topic.create({
    title: "Progress Testing",
    subject: "Testing",
    level: "beginner",
    userId: user.id,
  });

  topicId = topic.id;

  const quiz = await Quiz.create({
    topicId: topic.id,
    level: "beginner",
    questions: [
      {
        question: "Apa itu testing?",
        options: ["A", "B", "C", "D"],
        correctOptionIndex: 1,
      },
    ],
    totalQuestions: 1,
  });

  await QuizResult.create({
    quizId: quiz.id,
    userId: user.id,
    answers: [
      {
        selectedOptionIndex: 1,
        correct: true,
      },
    ],
    score: 80,
  });
});

afterAll(async () => {
  await QuizResult.destroy({ where: {}, truncate: true, cascade: true });
  await Quiz.destroy({ where: {}, truncate: true, cascade: true });
  await Topic.destroy({ where: {}, truncate: true, cascade: true });
  await User.destroy({ where: {}, truncate: true, cascade: true });

  await sequelize.close();
});

describe("GET /api/progress/my", () => {
  test("reject without token", async () => {
    const res = await request(app).get("/api/progress/my");
    expect(res.status).toBe(401);
  });

  test("return my progress with token", async () => {
    const res = await request(app)
      .get("/api/progress/my")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty("attempts");
    expect(res.body.data[0]).toHaveProperty("bestScore");
    expect(res.body.data[0]).toHaveProperty("status");
  });
});

describe("GET /api/progress/topic/:topicId", () => {
  test("return progress for topic", async () => {
    const res = await request(app)
      .get(`/api/progress/topic/${topicId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("attempts");
    expect(res.body.data).toHaveProperty("bestScore");
    expect(res.body.data).toHaveProperty("averageScore");
  });
});

describe("GET /api/progress/history/:topicId", () => {
  test("return progress history", async () => {
    const res = await request(app)
      .get(`/api/progress/history/${topicId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
