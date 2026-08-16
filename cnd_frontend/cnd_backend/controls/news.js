import { Router } from "express";
import newsModel from "../models/newsModel.js";
const newsRouter = Router();

newsRouter.post("/api/addNews", async (req, res) => {
  try {
    const { message, sender } = req.body;

    const newNews = new newsModel({ message, sender });
    await newNews.save();

    res.status(200).json({
      Status: "Success",
      msg: "News submitted successfully.",
    });
  } catch (error) {
    console.error("Error saving news:", error);
    res.status(500).json({
      Status: "Error",
      msg: "Error submitting news.",
      error: error.message,
    });
  }
});


newsRouter.get("/api/getNews", async (req, res) => {
    try {
      const newsList = await newsModel.find().sort({ date: -1 }); // latest first
  
      res.status(200).json({
        Status: "Success",
        data: newsList,
      });
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({
        Status: "Error",
        msg: "Failed to fetch news.",
        error: error.message,
      });
    }
  });

export default newsRouter;