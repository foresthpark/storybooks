module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      console.log("ensureAuth isAuthenticated => ", req.isAuthenticated());
      return next();
    } else {
      console.log("ensureAuth isAuthenticated => ", req.isAuthenticated());
      res.redirect("/");
    }
  },
  ensureGuest: (req, res, next) => {
    if (req.isAuthenticated()) {
      console.log("ensureGuest isAuthenticated => ", req.isAuthenticated());
      res.redirect("/dashboard");
    } else {
      console.log("ensureGuest isAuthenticated => ", req.isAuthenticated());
      next();
    }
  },
};
