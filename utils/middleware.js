const logger = require("./logger");

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  next();
};

const unknownEndpoint = (req, res) => res.status(404).send({ error: "unknown endpoint" })

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === "CastError" && error.kind === "ObjectId") return res.status(400).send({ error: "malformatted id" });
  else if (error.name === "JsonWebTokenError") return res.status(401).json({ error: "invalid token" });
  else if (error.name === "ValidationError") return res.status(400).json({ error: error.message });
  logger.error(error.name);
  next(error);
};


const checkImg = (req, res, next) => {
  if (req.body.images.length > 4) throw new Error('Too many IMG')
  else next();
};

const getToken = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) req.token = authorization.substring(7);
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  getToken,
  checkImg
};