const isAuthenticated = require("./isAuthenticated")

const isAdmin = async (req, res, next) => {
  const { role } = req.user
  if (role !== "admin") {
    res.status(403).json({
      message: "You are not an admin",
    })
  }

  next()
}
module.exports = isAdmin
