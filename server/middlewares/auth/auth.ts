import jwt, { Secret } from "jsonwebtoken";
import Express from 'express';
import Admin from "../../models/admin.model";

const requireAdminAuth = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const SECRET = process.env.SECRET;
    if (!SECRET) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const decoded = jwt.verify(token, SECRET as Secret);

    const admin = await Admin.findById((decoded as any).id);

    if (admin) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default requireAdminAuth;