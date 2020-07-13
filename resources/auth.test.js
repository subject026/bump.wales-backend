const supertest = require("supertest");
const hash = require("../util/hash");
const app = require("../app");
const db = require("../DB");

const request = supertest(app);

const existingUser = {
  email: "existing@example.com",
  password: "strongpassword",
};

const newUser = {
  email: "newuser@example.com",
  password: "strongpassword",
};

beforeAll(async () => {
  const hashedPassword = await hash("strongpassword", 8);
  await db.none("DELETE FROM users");
  await db.none(
    `INSERT INTO Users(email, password) VALUES ('${existingUser.email}', '${hashedPassword}')`,
  );
});

describe("/signup", () => {
  it("wrong method should return 400", async () => {
    const res = await request.get("/signup");
    expect(res.status).toBe(400);
  });

  it("valid signup request should create user", async () => {
    const res = await request.post("/signup").send(newUser);
    expect(res.status).toBe(200);
    expect(res.body.email).toEqual(newUser.email);
    expect(typeof res.body._id).toBe("number");
    // const userDocs = await User.find();
    // expect(userDocs.length).toBe(2);
  });

  it("password should be hashed", async () => {
    const newUserDoc = await db.oneOrNone(
      `SELECT * FROM Users WHERE email = '${newUser.email}'`,
    );
    expect(newUserDoc.email).toEqual(newUserDoc.email);
    expect(newUserDoc.password).not.toEqual(newUser.password);
  });

  it("should reject if email already signed up", async () => {
    const res = await request.post("/signup").send(existingUser);
    expect(res.status).toBe(400);
    const userDocs = await db.many(`SELECT * FROM Users`);
    expect(userDocs.length).toBe(2);
  });

  it("Should return 400 if email or password are missing", async () => {
    const res1 = await request.post("/signup").send({
      email: "some@email.com",
      password: "",
    });
    const res2 = await request.post("/signup").send({
      email: "",
      password: "password",
    });
    expect(res1.status).toBe(400);
    expect(res2.status).toBe(400);
  });
});

describe("/login", () => {
  it("wrong method should return 400", async () => {
    const res = await request.get("/login");
    expect(res.status).toBe(400);
  });

  it(
    "valid login request should return 200 and user object with jwt",
    async () => {
      const res = await request.post("/login").send(existingUser);
      expect(res.status).toBe(200);
      expect(res.body.doc.email).toEqual(existingUser.email);
    },
  );

  it("Should return 400 if email or password are missing", async () => {
    const res1 = await request.post("/login").send({
      email: "some@email.com",
      password: "",
    });
    const res2 = await request.post("/login").send({
      email: "",
      password: "password",
    });
    expect(res1.status).toBe(400);
    expect(res2.status).toBe(400);
  });

  it("Should return 400 if email is not signed up", async () => {
    const res = await request.post("/login").send({
      email: "notsignedup@email.com",
      password: "password",
    });
    expect(res.status).toBe(400);
    expect(res.body.errors[0]).toBe("email not found");
  });

  it(
    "should return 401 and correct message if password is incorrect",
    async () => {
      const res = await request.post("/login").send({
        email: existingUser.email,
        password: "wrongpassword",
      });
      expect(res.status).toBe(401);
      expect(res.body.errors[0]).toBe("password incorrect");
    },
  );
});
