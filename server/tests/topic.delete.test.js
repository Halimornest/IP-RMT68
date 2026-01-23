const request = require("supertest");
const app = require("../src/app");

require("../src/models/associations");

const { sequelize } = require("../src/config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.models.User;
const Topic = sequelize.models.Topic;
const Quiz = sequelize.models.Quiz;
const QuizResult = sequelize.models.QuizResult;

let ownerToken;
let otherToken;
let topicId;
let quizId;

beforeAll(async () => {

  await QuizResult.destroy({ where: {}, truncate: true, cascade: true });
  await Quiz.destroy({ where: {}, truncate: true, cascade: true });
  await Topic.destroy({ where: {}, truncate: true, cascade: true });
  await User.destroy({ where: {}, truncate: true, cascade: true });

  const owner = await User.create({
    email: "owner@mail.com",
    passwordHash: await bcrypt.hash("password123", 10),
    provider: "local",
    role: "student",
  });

  const other = await User.create({
    email: "other@mail.com",
    passwordHash: await bcrypt.hash("password123", 10),
    provider: "local",
    role: "student",
  });

  const ownerLogin = await request(app)
    .post("/api/auth/login")
    .send({
      email: "owner@mail.com",
      password: "password123",
    });
  ownerToken = ownerLogin.body.data.token;

  const otherLogin = await request(app)
    .post("/api/auth/login")
    .send({
      email: "other@mail.com",
      password: "password123",
    });
  otherToken = otherLogin.body.data.token;

  const topic = await Topic.create({
    title: "Delete Topic Test",
    subject: "Backend",
    level: "beginner",
    userId: owner.id,
  });
  topicId = topic.id;

  const quiz = await Quiz.create({
    topicId: topic.id,
    level: "beginner",
    questions: [
      {
        question: "2 + 2 = ?",
        options: ["1", "2", "3", "4"],
        answer: "4",
      },
    ],
    totalQuestions: 1,
  });
  quizId = quiz.id;

  await QuizResult.create({
    quizId: quiz.id,
    userId: owner.id,
    answers: [{ selectedOption: "4" }],
    score: 100,
  });
});

afterAll(async () => {
  await QuizResult.destroy({ where: {}, truncate: true, cascade: true });
  await Quiz.destroy({ where: {}, truncate: true, cascade: true });
  await Topic.destroy({ where: {}, truncate: true, cascade: true });
  await User.destroy({ where: {}, truncate: true, cascade: true });

  await sequelize.close();
});

describe("DELETE /api/topics/:id", () => {
  test("reject without token", async () => {
    const res = await request(app).delete(`/api/topics/${topicId}`);
    expect(res.status).toBe(401);
  });

  test("reject if not owner", async () => {
    const res = await request(app)
      .delete(`/api/topics/${topicId}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });

  test("success delete topic and cascade data", async () => {
    const res = await request(app)
      .delete(`/api/topics/${topicId}`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);

    const topic = await Topic.findByPk(topicId);
    expect(topic).toBeNull();

    const quiz = await Quiz.findByPk(quizId);
    expect(quiz).toBeNull();

    const results = await QuizResult.findAll({
      where: { quizId },
    });
    expect(results.length).toBe(0);
  });
});
