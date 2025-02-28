import { Router } from "express";
import { ordersController } from "../controllers/index.js";

const ordersRouter = Router();

ordersRouter.get("/", ordersController.orders);

export { ordersRouter };
