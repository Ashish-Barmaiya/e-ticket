import env from "dotenv";

env.config({ path: ".env.test" });

process.env.DATABASE_URL =
  "postgresql://postgres:postgres1234@localhost:5000/test_e_ticket?schema=public";

// Mocking import.meta
global.import = {
  meta: {
    url: "file://fake/path",
  },
};
