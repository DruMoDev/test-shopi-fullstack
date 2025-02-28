import { model, Schema } from "mongoose";

const erpSchema = new Schema(
  {
    ip: String,
    port: String,
    user: String,
    password: String,
  },
  { strict: false }
);

export const Erp = model("erp", erpSchema);
