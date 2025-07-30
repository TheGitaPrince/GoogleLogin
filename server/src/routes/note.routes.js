import { Router } from "express";
import { createNotes, deleteNotes, getNotes } from "../controllers/notes.controller.js";
import { veriyfyJWT } from "../middlewares/auth.middleware.js";

const notesRouter = Router();

notesRouter.route("/create-notes").post( veriyfyJWT, createNotes );
notesRouter.route("/delete-notes").post( veriyfyJWT, deleteNotes );
notesRouter.route("/get-notes").get( veriyfyJWT, getNotes );

export default notesRouter;