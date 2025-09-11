export function isAuth(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.status(403).json({ error: "not authenticated,pls login" });
}

export function isAdmin(req, res, next) {
  if (req.session.userId && req.session.role === "admin") {
    return next();
  }
  res.status(403).json({ error: "Forbidden: Admins only" });
}