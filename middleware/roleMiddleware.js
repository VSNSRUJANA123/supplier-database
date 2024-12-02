const roleMiddileware = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: "User role not found" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).send("access denied");
    }
    next();
  };
};
module.exports = roleMiddileware;
