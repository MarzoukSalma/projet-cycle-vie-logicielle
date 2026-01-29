const { loginUser } = require("../../controllers/user.controller")

jest.mock("../../models", () => ({
  User: {
    findOne: jest.fn(),
  },
}))

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}))

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}))

const { User } = require("../../models")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

describe("User Controller – loginUser (UNIT)", () => {
  it("should login user with correct credentials", async () => {
    const req = {
      body: {
        email: "test@test.com",
        password: "123456",
      },
    }

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    }

    User.findOne.mockResolvedValue({
      id: "user-id",
      email: "test@test.com",
      username: "test",
      passwordHash: "hashed",
      toJSON() {
        return this
      },
    })

    bcrypt.compare.mockResolvedValue(true)
    jwt.sign.mockReturnValue("jwt-token")

    await loginUser(req, res)

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        token: "jwt-token",
      })
    )
  })
})
