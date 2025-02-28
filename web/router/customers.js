import { Router } from "express";
import { customerController } from "../controllers/index.js";

const customersRouter = Router();

customersRouter.get("/", customerController.customers);

export { customersRouter };
