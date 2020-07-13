require("dotenv").config();
const app = require("./app");
const supertest = require("supertest");

const request = supertest(app);

describe("Misc tests", () => {
  // !!! This should be moved at some point as it has nothing to do with the user resource
  it("routes that don't exist should return 404", async () => {
    const cheeseRes = await request.get("/cheese");
    expect(cheeseRes.status).toBe(404);
    const userRes = await request.get("/underpants");
    expect(userRes.status).toBe(404);
  });
});
