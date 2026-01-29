const { forgotPassword } = require("../../controllers/user.controller")

jest.mock("../../models", () => ({
  User: {
    findOne: jest.fn(),
  },
}))

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}))

const { User } = require("../../models")
const jwt = require("jsonwebtoken")

describe("User Controller – forgotPassword (UNIT)", () => {
  it("should respond success even if user does not exist", async () => {
    const req = { body: { email: "unknown@test.com" } }
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() }

    User.findOne.mockResolvedValue(null)

    await forgotPassword(req, res)

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.any(String),
      })
    )
  })
})
