// models
const User = require("./../models/User");
const Role = require("./../models/Role");

function checkRoles(...roles) {
  return async (req, res, next) => {
    console.log("AUTHENTICATED ROLE", req.user);

    const userFound = await User.findById(req.user.id);
    const rolesFound = await (
      await Role.find({ _id: { $in: userFound.roles } })
    ).map((role) => role._id);

    for (let i = 0; i < rolesFound.length; i++) {
      if (roles.includes(rolesFound[i])) {
        next();
        return;
      }
    }

    return res.status(403).json({ data: "User unauthorized" });
  };
}

module.exports = { checkRoles };
