import express from "express";
import utilModel from "../models/utilModel.js";

const util_router = express.Router();

util_router.post("/api/util_update", async (req, res) => {
  try {
    const payload = req.body;

    // find first document
    let util = await utilModel.findOne();

    if (!util) {
      util = new utilModel(payload);
      await util.save();

      return res.status(201).json({
        Status: "Success",
        Message: "Util created successfully",
        data: util,
      });
    }

    // update only provided fields
    Object.keys(payload).forEach((key) => {
      util[key] = payload[key];
    });

    await util.save();

    res.status(200).json({
      Status: "Success",
      Message: "Util updated successfully",
      data: util,
    });
  } catch (error) {
    res.status(500).json({
      Status: "Error",
      Message: error.message,
    });
  }
});

util_router.get("/api/util_get", async (req, res) => {
  try {
    const util = await utilModel.findOne();

    res.status(200).json({
      Status: "Success",
      data: util || null,
    });
  } catch (error) {
    res.status(500).json({
      Status: "Error",
      Message: error.message,
    });
  }
});

export default util_router;
