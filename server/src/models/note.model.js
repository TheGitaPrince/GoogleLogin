import mongoose,{ Schema } from "mongoose";

const notesSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true 
    },
    notes: { 
        type: String,
        required: true
    },
},{ timestamps: true })

export const NotesModel = mongoose.model("Notes",notesSchema)