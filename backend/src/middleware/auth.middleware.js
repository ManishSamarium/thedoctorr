import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    // Prefer cookie token, but allow Authorization: Bearer <token> for API clients
    let token = req.cookies?.token;
    if (!token) {
      const auth = req.headers.authorization || req.headers.Authorization;
      if (auth && auth.startsWith("Bearer ")) {
        token = auth.split(" ")[1];
      }
    }

    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
