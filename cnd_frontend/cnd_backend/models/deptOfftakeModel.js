import { Schema, model } from "mongoose";

// Define the schema
    const deptOfftakeSchema = new Schema({
    depId: { type: String, required: true },
    department: { type: String, required: true },
    fullName: { type: String, required: true },
    abbreviation: { type: String,  },
    logo: { type: String,  },
    TotalOfftake: { type: String, },
    annualTarget: [{
        finYear: {type: String,},
        offtakeTarget: {type: String,}
    }],
    offtakeData: [{
        agencyId: { type: String,  },
        plantId: { type: String, required: true },
        offtakeValue: { type: String,  },
        offtakeDate: { type: Date, },
    }],
    
    },{timestamps:true});

// Create the model
const deptOfftake_model = model("deptOfftake", deptOfftakeSchema);

export default deptOfftake_model;
