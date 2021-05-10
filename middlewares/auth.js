//This is a custom middleware
import { SECRET } from "../config/index.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//const { verify } = jwt;

const AuthMiddleware = async (req, res, next) => {
  const authHeaders = await req.get("Authorization");

  if (!authHeaders) {
    req.isAuth = false;
    return next();
  }
  //Extract token
  let token = authHeaders.split(" ")[1];

  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  //decode the token using verify
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, SECRET);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  //Find the user from the database
  let authUser = await User.findById(decodedToken.id);

  if (!authUser) {
    req.isAuth = false;
    return next();
  }

  //Set the req user to the fetched user
  req.user = authUser;

  req.isAuth = true;
  return next();
};

export default AuthMiddleware;
