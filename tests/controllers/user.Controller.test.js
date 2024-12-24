import request from "supertest";
import { app } from "../../app.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

describe("User Authentication", () => {
  // Test user object
  const testUser = {
    email: "test@example.com",
    password: "password123",
    name: "Test User",
    phoneNumber: "1234567890",
  };

  beforeEach(async () => {
    // Clear the user table before each test
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    //Disconnect Prisma after all test
    await prisma.$disconnect();
  });

  // USER SIGN-UP TEST //
  describe("POST /user/user-sign-up", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/user/user-sign-up")
        .send(testUser);

      expect(response.status).toBe(302);

      // Verify user was created in the database
      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      expect(user).toBeTruthy();
      expect(user.email).toBe(testUser.email);
      expect(user.fullName).toBe(testUser.name);
    });

    it("should not register user with existing email", async () => {
      //First create a user
      await prisma.user.create({
        data: {
          email: testUser.email,
          password: await bcrypt.hash(testUser.password, 10),
          fullName: testUser.name,
          phone: testUser.phoneNumber,
        },
      });

      // Try to create another user with same email
      const response = await request(app)
        .post("/user/user-sign-up")
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain(
        "User already exists with this email",
      );
    });
  });

  // USER SIGN-IN TEST //
  describe("POST /user/user-sign-in", () => {
    beforeEach(async () => {
      // Create a test-user before each login test
      await prisma.user.create({
        data: {
          fullName: testUser.name,
          email: testUser.email,
          phone: testUser.phoneNumber,
          password: await bcrypt.hash(testUser.password, 10),
        },
      });
    });

    it("should login successfully with correct credentials", async () => {
      const response = await request(app).post("/user/user-sign-in").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.status).toBe(302);
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should fail to login with incorrect password", async () => {
      const response = await request(app).post("/user/user-sign-in").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain("Authentication failed");
    });
  });
});
