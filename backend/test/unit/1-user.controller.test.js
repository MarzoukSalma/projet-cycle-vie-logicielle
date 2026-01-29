const { registerUser } = require("../../controllers/user.controller")

jest.mock("../../models", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  Sequelize: {
    Op: { or: Symbol("or") },
  },
}))

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}))

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}))

const { User } = require("../../models")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

describe("User Controller – registerUser (UNIT)", () => {
  it("should register a new user successfully", async () => {
    const req = {
      body: {
        username: "testuser",
        email: "test@test.com",
        password: "123456",
      },
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    User.findOne.mockResolvedValue(null)
    bcrypt.hash.mockResolvedValue("hashedPassword")
    User.create.mockResolvedValue({
      id: "user-id",
      username: "testuser",
      email: "test@test.com",
    })
    jwt.sign.mockReturnValue("fake-jwt")

    await registerUser(req, res)

    expect(User.create).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        token: "fake-jwt",
        user: expect.objectContaining({
          email: "test@test.com",
        }),
      })
    )
  })
})
