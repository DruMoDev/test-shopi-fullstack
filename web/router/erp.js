import { Router } from "express";
import { erpController } from "../controllers/index.js";

const erpRouter = Router();

erpRouter.get("/:id", erpController.getErpData);
erpRouter.post("/", erpController.postErpData);

export { erpRouter };
