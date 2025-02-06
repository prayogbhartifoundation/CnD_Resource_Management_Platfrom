import { Schema, model } from "mongoose";

// Define the schema
    const agencySchema = new Schema({
    agencyId: { type: String, required: true },
    password: { type: String, required: true },
    agency: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    contactEmail: { type: String, required: true },
    logins:{type: Number, default:0},
    passwordReset:{type: Number, default:0},
    plants: [
        {
        plantId: { type: String },
        },
    ],
    mohuaStatus: [{
        dep : { type: String },
        target : [{
            name : { type: String },
            value : { type: String },   
            status : { type: String },
        }],
    }],
    },{timestamps:true});

// Create the model
const agency_model = model("agencies", agencySchema);

export default agency_model;
