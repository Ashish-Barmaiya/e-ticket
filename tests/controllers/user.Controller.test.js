import env from "dotenv";
import request from "supertest";
import { app } from "../../app.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../src/utils/generateTokens.js";

env.config({ path: "../../.env.test" });
const prisma = new PrismaClient();

// Mock user data
const testUser = {
  email: "test@example.com",
  password: "password123",
  name: "Test User",
  phoneNumber: "1234567890",
};

describe("User Authentication", () => {
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

// USER-PROTECTED-ROUTES TESTS //
describe("User Protected Routes", () => {
  let user;
  let accessToken;
  let refreshToken;

  beforeEach(async () => {
    // Clear the user table before each test
    await prisma.user.deleteMany();

    // create a test user
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    user = await prisma.user.create({
      data: {
        email: testUser.email,
        password: hashedPassword,
        fullName: testUser.name,
        phone: testUser.phoneNumber,
      },
    });

    // Generate valid tokens
    accessToken = generateAccessToken(user);
    refreshToken = generateRefreshToken(user);

    // Update user with refreshToken
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  // USER-CHANGE-PASSWORD TEST //
  describe("POST /user/profile/user-change-password", () => {
    it("should successfully change-password with correct inputs", async () => {
      const response = await request(app)
        .post("/user/profile/user-change-password")
        .set("Cookie", [
          `accessToken=${accessToken}`,
          `refreshToken=${refreshToken}`,
        ])
        .send({
          email: testUser.email,
          oldPassword: testUser.password,
          newPassword: "newpassword123",
          confirmPassword: "newpassword123",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain("Password changed successfully");

      // Verify password change
      const updatedUser = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      const isNewPasswordValid = await bcrypt.compare(
        "newpassword123",
        updatedUser.password,
      );
      expect(isNewPasswordValid).toBe(true);
    });

    it("should fail to change password with incorrect oldPassword", async () => {
      const response = await request(app)
        .post("/user/profile/user-change-password")
        .set("Cookie", [
          `accessToken=${accessToken}`,
          `refreshToken=${refreshToken}`,
        ]) // Pass JWT in the header
        .send({
          oldPassword: "wrongpassword",
          newPassword: "newpassword123",
          confirmPassword: "newpassword123",
        })
        .redirects(0);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Validation Error");
    });

    it("should fail to change password if newPassword and confirmPassword does not match", async () => {
      const response = await request(app)
        .post("/user/profile/user-change-password")
        .set("Cookie", [
          `accessToken=${accessToken}`,
          `refreshToken=${refreshToken}`,
        ])
        .send({
          oldPassword: testUser.password,
          newPassword: "newpassword123",
          confirmPassword: "somethingdifferent321",
        })
        .redirects(0);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Validation Error");
    });

    it("should fail with an invalid token", async () => {
      const response = await request(app)
        .post("/user/profile/user-change-password")
        .set("Authorization", "Bearer invalidToken")
        .send({
          oldPassword: testUser.password,
          newPassword: "newpassword123",
          confirmPassword: "newpassword123",
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Authorization token is missing");
    });

    it("should fail without a token", async () => {
      const response = await request(app)
        .post("/user/profile/user-change-password")
        .send({
          oldPassword: testUser.password,
          newPassword: "newpassword123",
          confirmPassword: "newpassword123",
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Authorization token is missing");
    });
  });

  // USER-UPDATE-INFO TEST //
  describe("POST /user/profile/edit-profile", () => {
    it("should successfully update info with correct inputs", async () => {
      const response = await request(app)
        .post("/user/profile/edit-profile")
        .set("Cookie", [
          `accessToken=${accessToken}`,
          `refreshToken=${refreshToken}`,
        ])
        .send({
          fullName: "New Name",
          dateOfBirth: "01-01-2001",
          gender: "M",
          areaPincode: "111222",
          addressLine1: "New Address",
          addressLine2: "Address Line",
          landmark: "New Landmark",
          state: "New State",
          country: "New Country",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain(
        "User profile updated successfully",
      );
    });
  });
});
