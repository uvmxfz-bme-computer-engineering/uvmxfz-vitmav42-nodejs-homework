const { Types } = require("mongoose");

module.exports = (req, res, next) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return res.redirect("/admin");
  }
  next();
};
