import {configureStore} from "@reduxjs/toolkit";
import userSlice from "./userSlice.js"
import notesSlice from "./notesSlice.js"

export const store = configureStore({
    reducer:{
        auth: userSlice,
        notes: notesSlice,
    }
})