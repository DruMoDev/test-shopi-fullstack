import { response } from "express";
import { Erp } from "../models/erp.js";
export const erpController = {
  async getErpData(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(403).json({ msg: "Falta el id del usuario" });
    }
    const userData = await Erp.findById(id);

    if (!userData) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    return res.status(200).json(userData);
  },

  async postErpData(req, res) {
    const data = req.body;
    console.log({ data });

    let result;
    try {
      if (data._id) {
        result = await Erp.findById(data._id).updateOne(data);
      } else {
        const newErp = new Erp(data);
        result = await newErp.save();
      }

      return res
        .status(200)
        .json({ user: result, msg: "Usuario guardado correctamente." });
    } catch (error) {
      console.error("Error al crear un nuevo usuario", error);
    }
  },
};
