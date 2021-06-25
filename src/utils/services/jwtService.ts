import jwt, { JwtPayload } from "jsonwebtoken";

export default {
  verifyAndRead(token: string): JwtPayload {
    return <JwtPayload>jwt.verify(token, <string>process.env.JWT_SECRET);
  },
};
