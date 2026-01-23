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
let quizId;
let userId;

beforeAll(async () => {

  await QuizResult.destroy({ where: {}, truncate: true, cascade: true });
  await Quiz.destroy({ where: {}, truncate: true, cascade: true });
  await Topic.destroy({ where: {}, truncate: true, cascade: true });
  await User.destroy({ where: {}, truncate: true, cascade: true });

  const user = await User.create({
    email: "quiz@mail.com",
    passwordHash: await bcrypt.hash("password123", 10),
    provider: "local",
    role: "student",
  });

  userId = user.id;

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({
      email: "quiz@mail.com",
      password: "password123",
    });

  token = loginRes.body.data.token;

  const topic = await Topic.create({
    title: "Quiz Testing",
    subject: "Backend",
    level: "beginner",
    userId,
  });

  const quiz = await Quiz.create({
    topicId: topic.id,
    level: "beginner",
    questions: [
      {
        question: "2 + 2 = ?",
        options: ["1", "2", "3", "4"],
        answer: "4",
      },
      {
        question: "Capital of Indonesia?",
        options: ["Bandung", "Jakarta", "Surabaya", "Medan"],
        answer: "Jakarta",
      },
    ],
    totalQuestions: 2,
  });

  quizId = quiz.id;
});

afterAll(async () => {
  await QuizResult.destroy({ where: {}, truncate: true, cascade: true });
  await Quiz.destroy({ where: {}, truncate: true, cascade: true });
  await Topic.destroy({ where: {}, truncate: true, cascade: true });
  await User.destroy({ where: {}, truncate: true, cascade: true });

  await sequelize.close();
});

describe("POST /api/quiz/submit", () => {
  test("reject without token", async () => {
    const res = await request(app).post("/api/quiz/submit");
    expect(res.status).toBe(401);
  });

  test("reject invalid body", async () => {
    const res = await request(app)
      .post("/api/quiz/submit")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  test("success submit quiz & calculate score", async () => {
    const res = await request(app)
      .post("/api/quiz/submit")
      .set("Authorization", `Bearer ${token}`)
      .send({
        quizId,
        answers: [
          { selectedOption: "4" },
          { selectedOption: "Jakarta" },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("score");
    expect(res.body.data).toHaveProperty("details");
    expect(res.body.data.score).toBe(100);
  });

  test("reject submit same quiz twice", async () => {
    const res = await request(app)
      .post("/api/quiz/submit")
      .set("Authorization", `Bearer ${token}`)
      .send({
        quizId,
        answers: [
          { selectedOption: "4" },
          { selectedOption: "Jakarta" },
        ],
      });

    expect(res.status).toBe(400);
  });
});
