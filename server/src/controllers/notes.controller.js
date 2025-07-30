import { NotesModel } from "../models/note.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createNotes = asyncHandler(async (req, res) => {
    const { notes } = req.body;
    if( !notes ){
        throw new ApiError(400, "Notes are required.")
    };

    const userId = req.user?._id;
     if (!userId) {
        throw new ApiError(401, "Unauthorized: User info missing");
    }

    const newNotes = await NotesModel.create({
         user: userId,
         notes: notes
    });

    return res.status(201).json(new ApiResponse(201, newNotes, "Notes created successfully."));
})

export const deleteNotes = asyncHandler(async (req, res) => {
    const { notesId } = req.body;
    if( !notesId ){
        throw new ApiError(400, "NotesID are required.")
    }

    const userId = req.user?._id;
     if (!userId) {
        throw new ApiError(400, "Unauthorized: User info missing");
    }

    const notes = await NotesModel.findById( notesId )
    if( !notes ){
        throw new ApiError(400, "Notes not found.")
    }

    await NotesModel.findByIdAndDelete( notesId );

     return res.status(200).json(new ApiResponse(200, {}, "Notes deleted successfully."));

})

export const getNotes= asyncHandler(async (req,res) => {
    const userId = req.user?._id;

    const notes = await NotesModel.find({ user: userId }).sort({ createdAt : -1})
    
    return res.status(201).json(new ApiResponse(200, notes, "Fetched Notes Successfully."))

})