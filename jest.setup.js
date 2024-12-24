import env from "dotenv";

env.config({ path: ".env.test" });

// Mocking import.meta
global.import = {
  meta: {
    url: "file://fake/path",
  },
};

// process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;
