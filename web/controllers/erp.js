import { response } from "express";
import { Erp } from "../models/erp.js";
export const erpController = {
  async getErpData(req, res) {
    let { id } = req.params;

    if (!id) {
      return res.status(403).json({ msg: "Falta el id del usuario" });
    }
    console.log(id);
    console.log(typeof id);

    const userData = await Erp.findById({ _id: id });

    if (!userData) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    return res.status(200).json(userData);
  },

  async postErpData(req, res) {
    const data = req.body;

    let result;
    try {
      if (data._id) {
        result = await Erp.findById({ _id: data._id }).updateOne(data);
        console.log("Usuario editado correctamente");
        return res
          .status(200)
          .json({ user: result, msg: "Usuario editado correctamente." });
      } else {
        const newErp = new Erp(data);
        result = await newErp.save();
        console.log("Usuario creado correctamente");
         return res
           .status(200)
           .json({ user: result, msg: "Usuario guardado correctamente." });
      }

    
    } catch (error) {
      console.error("Error al crear un nuevo usuario", error);
      return res.status(500).statusText("Error al guardar el usuario.")
    }
  },
};
