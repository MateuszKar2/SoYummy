import jwt, { Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

const decodeToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!process.env.SECRET) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.SECRET as Secret);
    (req as any).userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default decodeToken;
