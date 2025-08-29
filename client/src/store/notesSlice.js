import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAxios from "../utils/axiosInterceptors.js"

export const createNotes = createAsyncThunk('createNotes', async (notes, { rejectWithValue }) => {
        try {
            const response = await  authAxios.post('/notes/create-notes',notes); 
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
});

export const deleteNotes = createAsyncThunk('deleteNotes', async (notesId, { rejectWithValue }) => {
        try {
            const response = await  authAxios.post('/notes/delete-notes',{notesId}); 
            return response?.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
});

export const getNotes = createAsyncThunk('getNotes', async (_, { rejectWithValue }) => {
        try {
            const response = await  authAxios.get('/notes/get-notes');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
});

const initialState = {
    notesList: [],
    loadingGet: false,
    loadingCreate: false,
    loadingDelete: false,
    error: null
};

const notesSlice = createSlice({
    name: "notes",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(createNotes.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createNotes.fulfilled, (state) => {
                state.loadingCreate = false;
            }) 
            .addCase(createNotes.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload?.message
            })          
            .addCase(deleteNotes.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteNotes.fulfilled, (state) => {
                state.loadingDelete= false;
            })
            .addCase(deleteNotes.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload?.message
            })
            .addCase(getNotes.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getNotes.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.notesList = action.payload;
            }) 
            .addCase(getNotes.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload?.message
            })    
     },
});

export default notesSlice.reducer;