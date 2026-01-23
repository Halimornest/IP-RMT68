const request = require("supertest");
const app = require("../src/app");

const { sequelize } = require("../src/config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.models.User;

beforeAll(async () => {
  if (!User) {
    throw new Error("User model is not registered in Sequelize");
  }

  await User.destroy({
    where: {},
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await User.create({
    email: "admin@mail.com",
    passwordHash: await bcrypt.hash("admin123", 10), 
    provider: "local",
    role: "admin",
  });
});

afterAll(async () => {
  await User.destroy({
    where: {},
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await sequelize.close();
});

describe("POST /api/auth/login", () => {
  test("success login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@mail.com",
        password: "admin123",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("token");
    expect(typeof res.body.data.token).toBe("string");
  });

  test("email not provided", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        password: "admin123",
      });

    expect(res.status).toBe(400);
  });

  test("password not provided", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@mail.com",
      });

    expect(res.status).toBe(400);
  });

  test("email not registered", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "wrong@mail.com",
        password: "admin123",
      });

    expect(res.status).toBe(401);
  });

  test("wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@mail.com",
        password: "wrong",
      });

    expect(res.status).toBe(401);
  });
});
