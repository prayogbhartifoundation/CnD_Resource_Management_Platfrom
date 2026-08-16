import { Router } from "express";
import ProcessingForm_model from "../models/processFormModel.js";
import ProcessingProductMaster from "../models/ProcessingProductMasterModel.js";
const processingFormRouter = Router();

processingFormRouter.post(
  "/api/processing-form-submission",
  async (req, res) => {
    try {
      const form = new ProcessingForm_model(req.body);

      const submissionDate = form.dateOfSubmission;

      for (const product of form.products) {
        const existingProduct = await ProcessingProductMaster.findOne({
          productName: product.productName,
        });

        const submissionDetails = {
          date: submissionDate,
          quantity: product.productQty,
          percentage: product.productPercentage,
          remarks: product.remarks,
        };

        if (existingProduct) {
          existingProduct.formSubmissions.push(submissionDetails);
          await existingProduct.save();
        } else {
          const newProduct = new ProcessingProductMaster({
            productName: product.productName,
            formSubmissions: [submissionDetails],
          });
          await newProduct.save();
        }
      }

      await form.save();

      res
        .status(201)
        .json({ message: "Form submitted and products updated", form });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Example in productRouter.js
processingFormRouter.get("/api/processing-products", async (req, res) => {
  try {
    const products = await ProcessingProductMaster.find({}, "productName productPercentage");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// In Express route
processingFormRouter.get("/api/processing-form-submissions", async (req, res) => {
  const { start, end } = req.query;

  let filter = {};

  if (start || end) {
    filter.dateOfSubmission = {};

    if (start) {
      filter.dateOfSubmission.$gte = new Date(start);
    }

    if (end) {
      // include full end day by setting to 23:59:59.999
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
      filter.dateOfSubmission.$lte = endDate;
    }
  }

  try {
    const submissions = await ProcessingForm_model
      .find(filter)
      .sort({ dateOfSubmission: -1 });

    res.json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});



processingFormRouter.put("/api/processing-form-update/:id", async (req, res) => {
  try {
    const { products } = req.body;
    const updated = await ProcessingForm_model.findByIdAndUpdate(
      req.params.id,
      { products },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update submission" });
  }
});

processingFormRouter.post("/api/update-processing-products", async (req, res) => {
  try {
    const products = req.body; // [{ productName, productPercentage }, ...]

    const total = products.reduce((sum, p) => sum + (p.productPercentage || 0), 0);
    if (total !== 100) {
      return res.status(400).json({ error: "Total percentage must equal 100" });
    }

    // Clear old products and insert new list
    await ProcessingProductMaster.deleteMany({});
    await ProcessingProductMaster.insertMany(products);

    res.json({ message: "Products updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default processingFormRouter;
