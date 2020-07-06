require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const hash = require("../../util/hash");

const User = require("../auth/user.model");
const UserFilmMeta = require("./userFilmMeta.model");
const app = require("../../app");
const supertest = require("supertest");

const request = supertest(app);

const existingUser = {
  email: "existing@example.com",
  password: "password"
};

let userHasNoMeta = {
  email: "woo@laa.com",
  password: "password",
  token: jwt.sign({ _id: this._id, email: this.email }, process.env.APP_SECRET)
};

let userHasMeta;
let docs;

const catchErrors = res => {
  if (res.status !== 200) console.log("\n\nerrors in response: \n\n", res.body);
};

beforeAll(async () => {
  try {
    await mongoose.connection.dropDatabase();
    // create a user
    const hashedPassword = await hash(existingUser.password);
    userHasMeta = await User.create({
      email: existingUser.email,
      password: hashedPassword
    }).catch(err => console.log(err));
    userHasMeta.token = jwt.sign(
      { _id: userHasMeta._id, email: userHasMeta.email },
      process.env.APP_SECRET
    );
    // save some records
    docs = await UserFilmMeta.create([
      {
        filmId: "1",
        userId: userHasMeta._id
      },
      {
        filmId: "2",
        userId: userHasMeta._id
      },
      {
        filmId: "3",
        userId: userHasMeta._id
      },
      {
        filmId: "4",
        userId: userHasMeta._id
      }
    ]);
  } catch (err) {
    console.log(err);
  }
});

describe("Resource - userFilmMeta", () => {
  it("wrong method should return 400", async () => {
    const res = await request.patch("/api/user-film-meta");
    expect(res.status).toBe(400);
  });

  it("should return 401 not authorised if no valid jwt", async () => {
    const getRes = await request.get("/api/user-film-meta");
    expect(getRes.status).toBe(401);
    expect(getRes.body.errors[0]).toBe("not authorised");

    const postRes = await request.post("/api/user-film-meta");
    expect(postRes.status).toBe(401);
    expect(postRes.body.errors[0]).toBe("not authorised");

    const deleteRes = await request.delete("/api/user-film-meta");
    expect(deleteRes.status).toBe(401);
    expect(deleteRes.body.errors[0]).toBe("not authorised");
  });

  it("GET Should return 200 with docs if valid request", async () => {
    const res = await request
      .get("/api/user-film-meta")
      .set("Cookie", [`token=${userHasMeta.token}`]);
    expect(res.status).toBe(200);
    expect(res.body.docs.length).toBe(4);
  });

  it("GET should return 200 with no docs if user has no docs", async () => {
    const res = await request
      .get("/api/user-film-meta")
      .set("Cookie", [`token=${userHasNoMeta.token}`]);
    expect(res.status).toBe(200);
    expect(res.body.docs.length).toBe(0);
  });

  it("POST should create a doc and return 200 with valid request", async () => {
    const res = await request
      .post("/api/user-film-meta")
      .set("Cookie", [`token=${userHasMeta.token}`])
      .send({
        filmId: "a"
      });
    catchErrors(res);
    expect(res.status).toBe(200);
    const docsAfter = await UserFilmMeta.find();
    expect(docsAfter.length).toBe(5);
  });

  it("POST should return 400 if no filmId provided", async () => {
    const res = await request
      .post("/api/user-film-meta")
      .set("Cookie", [`token=${userHasMeta.token}`])
      .send({
        no: "filmId"
      });
    expect(res.status).toBe(400);
    const docsAfter = await UserFilmMeta.find();
    expect(docsAfter.length).toBe(5);
  });

  it("DELETE should return 200 and delete record with valid request", async () => {
    const res = await request
      .delete("/api/user-film-meta")
      .set("Cookie", [`token=${userHasMeta.token}`])
      .send({
        docId: docs[0]._id
      });
    catchErrors(res);
    expect(res.status).toBe(200);
    const docsAfter = await UserFilmMeta.find();
    expect(docsAfter.length).toBe(4);
  });

  it("DELETE should return 400 if no docId provided", async () => {
    const res = await request
      .post("/api/user-film-meta")
      .set("Cookie", [`token=${userHasMeta.token}`])
      .send({
        no: "docId"
      });
    expect(res.status).toBe(400);
    const docsAfter = await UserFilmMeta.find();
    expect(docsAfter.length).toBe(4);
  });

  it("DELETE should return 400 if film id not found", async () => {
    const res = await request
      .delete("/api/user-film-meta")
      .set("Cookie", [`token=${userHasMeta.token}`])
      .send({
        docId: docs[0]._id
      });
    expect(res.status).toBe(400);
    const docsAfter = await UserFilmMeta.find();
    expect(docsAfter.length).toBe(4);
  });
});
