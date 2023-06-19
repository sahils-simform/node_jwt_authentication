/* eslint-disable no-console */
require("dotenv").config();
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const posts = [
  {
    username: "Sahil",
    title: "Post 1",
  },
  {
    username: "Hardik",
    title: "Post 2",
  },
];

const generateAccessToken = (user) => {
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
};

const addloginDetails = (req, res) => {
  const { username } = req.body;
  const user = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
};

const authenticateToken = (req, res, next) => {
  res.json(posts.filter((post) => post.username === req.user.name));
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) {
      res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

const generateNewToken = (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) {
    res.sendStatus(401);
  }
  if (!refreshTokens.includes(refreshToken)) {
    res.sendStatus(403);
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.sendStatus(403);
    }
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken });
  });
};

const removeAccessToken = (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
};

module.exports = {
  authenticateToken,
  generateAccessToken,
  generateNewToken,
  removeAccessToken,
  addloginDetails,
};
