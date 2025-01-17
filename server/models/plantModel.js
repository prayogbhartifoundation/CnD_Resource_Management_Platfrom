import { Schema, model } from "mongoose";

// Define the schema
    const plantSchema = new Schema({
    plantId: { type: String, required: true },
    agencyId: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    contactEmail: { type: String, required: true },
    logins:{type: Number, default:0},
    passwordReset:{type: Number, default:0},
    
    mohuaStatus: { type: String },
    },{timestamps:true});

// Create the model
const plant_model = model("plants", plantSchema);

export default plant_model;
