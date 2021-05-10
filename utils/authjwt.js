import jwt from "jsonwebtoken";
import lodash from "lodash";
import { SECRET } from "../config/index.js";

const { sign } = jwt;
const { pick } = lodash;

export const issueToken = async (user) => {
  let token = await sign(user, SECRET, {
    expiresIn: 60 * 60 * 24,
  });
  console.log("TOKEN_ISSUE_TIME", new Date());
  return `Bearer ${token}`;
};

export const serializeUser = (user) =>
  pick(user, [
    "id",
    "username",
    "email",
    "firstName",
    "lastName",
    "avatarImage",
  ]);
