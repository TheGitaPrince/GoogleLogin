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
    loading: false,
    error: null
};

const notesSlice = createSlice({
    name: "notes",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(createNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNotes.fulfilled, (state) => {
                state.loading = false;
            }) 
            .addCase(createNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })          
            .addCase(deleteNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteNotes.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(getNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.notesList = action.payload;
            }) 
            .addCase(getNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })    
     },
});

export default notesSlice.reducer;