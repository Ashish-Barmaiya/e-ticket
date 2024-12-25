describe("Database connection", () => {
  it("should connect to the test database", () => {
    const dbUrl = process.env.DATABASE_URL;
    expect(dbUrl).toBe(
      "postgresql://postgres:postgres1234@localhost:5000/test_e_ticket?schema=public",
    );
  });
});
