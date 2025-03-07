import express from 'express';
import prod_model from '../models/productModel.js';
import moment from 'moment';

const prod_router = new express.Router();

prod_router.post('/api/add_product', async (req, res) => {
    console.log(req.body);
    try {
        const { plantId, prodName, dsr, qnt, details, processingSteps } = req.body;
        
        if (!prodName || !plantId) {
            return res.status(400).json({ message: "Product name and Plant ID are required" });
        }

        let product = await prod_model.findOne({ prodName });

        if (product) {
            // Check if the plant already exists in the plantWise array
            const plantIndex = product.plantWise.findIndex(p => p.plantId === plantId);
            
            
            
            if (plantIndex > -1) {
                // Update existing plant data
                product.plantWise[plantIndex] = { plantId, qnt, dsr, details, processingSteps };
            } else {
                // Add new plant data
                product.plantWise.push({ plantId, qnt, dsr, details, processingSteps });
            }

            await product.save();
            return res.status(200).json({ Status : "Success", data : product });
        } else {
            // Generate a new prodId and create a new product
            const prodCount = await prod_model.countDocuments();
            const newProduct = new prod_model({
                prodId: `PROD${prodCount + 1}`,
                prodName,
                dsr,
                plantWise: [{ plantId, qnt, dsr, details, processingSteps }],
                createdAt: moment().toISOString(),
            });

            await newProduct.save();
            return res.status(201).json({ Status : "Success", data: newProduct });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ Status: "Internal Server Error", error });
    }
});


prod_router.post('/api/update_inventory', async (req, res) => {
    try {
        const { plantId, prodDetails } = req.body;
        
        console.log(req.body);
        

        if (!plantId || !Array.isArray(prodDetails)) {
            return res.status(400).json({ message: "Invalid request body" });
        }

        for (const { prodName, addedQnt } of prodDetails) {
            const product = await prod_model.findOne({ prodName });
            
            if (!product) {
                console.log(`${prodName} not found`);
                
                continue; // Skip if product not found
            }

            const plantIndex = product.plantWise.findIndex(p => p.plantId === plantId);
            const addQnt = parseInt(addedQnt) || 0;
            
            if (plantIndex > -1) {
                console.log("aa",plantIndex);
                // Update quantity
                const currentQnt = parseInt(product.plantWise[plantIndex].qnt) || 0;
                product.plantWise[plantIndex].qnt = (currentQnt + addQnt).toString();
                await product.save();
            } else {
                console.log(plantIndex);
                
                product.plantWise.push({ plantId, qnt: addQnt });
                await product.save();
            }
        }

        return res.status(200).json({ Status: "Success" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});


prod_router.get('/api/get_products', async(req, res) => {
    console.log('get called');
    
    try {
        const all = await prod_model.find({}); 
    
        res.status(200).json({
          status: "success",
          data: all,
        });
    
      } catch (error) {
        console.error("Error fetching :", error);
        res.status(500).json({
          status: "error",
          message: "Internal Server Error",
          error: error.message,
        });
      }
})


export default prod_router;
