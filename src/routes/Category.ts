import express, { Request, Response } from "express";
import { RequestSchemas, ValidateZod } from "../validation/utils";
import { createCategory } from "../controllers/Category";

const router = express.Router();

router.post('/',ValidateZod(RequestSchemas.category.category),createCategory);

export default router;
