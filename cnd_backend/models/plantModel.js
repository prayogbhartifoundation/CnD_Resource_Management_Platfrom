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
    phone: { type: String },
    logins:{type: Number, default:0},
    passwordReset:{type: Number, default:0},
    installedWasteCap: { type: Number, default: 0 },
    mapLoc: { type: String },
    mapLocLatLong: {
      lat: { type: Number },
      lng: { type: Number },
    },
    vidLink: { type: String },
    address : { type: String,  },
    
    mohuaStatus: [{
        dep : { type: String },
        total : {type: String}, 
        annual : {type: String},
        last15days : {type: String},
        entry : [{
            value : {type : String, },
            entryDate : {type: Date, }
        }],
    }],

    products: [{
        prodId:{type : String,},
        name:{type : String,},
        qnt:{type : String, },
    }]
    },{timestamps:true});

// Create the model
const plant_model = model("plants", plantSchema);

export default plant_model;
