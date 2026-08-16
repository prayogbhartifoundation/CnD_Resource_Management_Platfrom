import { Schema, model } from "mongoose";

// Define the schema
    const prodSchema = new Schema({
    prodId: { type: String, required: true },
    prodName: { type: String, },
    prodImg: { type: String, },
    dsr: { type: String, },
    unit: { type: String, },
    plantWise: [{
        plantId : { type: String },
        qnt : { type: String },
        dsr : { type: String },
        details : { type: String },
        processingSteps : { type: String },
        updateDate : {type: Date}
    }],
    
    },{timestamps:true});

// Create the model
const prod_model = model("prods", prodSchema);

export default prod_model;
