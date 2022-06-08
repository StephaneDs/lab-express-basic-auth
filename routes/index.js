const bcrypt = require("bcryptjs/dist/bcrypt")
const User = require("../models/User.model")

const router = require("express").Router()
const saltRounds = 10
/* GET default route */
router.get("/", (req, res, next) => {
  res.json({ success: true, author: "Stephane" })
})

router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!password) {
      res.status(400).json({ message: "Please send a password." })
      return
    }

    const foundUser = await User.findOne({ username })
    if (foundUser) {
      res
        .status(401)
        .json({ message: "Username already exists. Try logging in instead." })
      return
    }

    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, salt)

    console.log({ hashedPassword })

    const createdUser = await User.create({
      username,
      password: hashedPassword,
    })

    res.status(201).json(createdUser)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body
  const foundUser = await User.findOne({ username })

  if (!foundUser) {
    res.status(404).json({ message: "username does not exist" })
    return
  }

  const isPasswordMatched = await bcrypt.compare(password, foundUser.password)
  if (!isPasswordMatched) {
    res.status(401).json({ message: "password does not match" })
    return
  }
  res.status(200).json({ isLoggedIn: true, message: "welcome " + username })
})

module.exports = router
