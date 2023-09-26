export const auth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  next();
};

export const logged = (req, res, next) => {
  console.log(req.session);
  if (req.session.user) {
    return res.redirect("/api/products");
  }

  next();
};

export const isAdmin = (req, res, next) => {
  if (
    req.body.email === "adminCoder@coder.com" &&
    req.body.password === "adminCod3r123"
  ) {
    req.session.rol = "admin";
  } else {
    req.session.rol = "usuario";
  }
  next();
};
