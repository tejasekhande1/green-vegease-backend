import express, { Request, Response } from 'express';
import { signUp, login } from '../controllers/Auth';

const router = express.Router();

router.post("/signup", (req: Request, res: Response) => signUp(req, res));
router.post("/login", (req: Request, res: Response) => login(req, res));

export default router;