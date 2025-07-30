import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNotes, deleteNotes, getNotes } from "../store/notesSlice.js";
import { logoutUser } from "../store/userSlice.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); 
  const { notesList, loading, error } = useSelector((state) => state.notes);
  const [noteInput, setNoteInput] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
     dispatch(getNotes())
  }, [ dispatch ])
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteInput.trim()) {
      toast.error("Note cannot be empty!");
      return;  
    }
    const response = await dispatch(createNotes({ notes: noteInput.trim() }));
    if (createNotes.fulfilled.match(response)) {
        toast.success("Note Added.");
        setNoteInput("");
        await dispatch(getNotes())
    }
  }

  const handleDeleteNote = async(noteId) => {
    const response = await dispatch(deleteNotes(noteId));
    if(deleteNotes.fulfilled.match(response)){
      toast.success("Note deleted.")
      await dispatch(getNotes());
    }
  };

  const handleLogout = async() => {
    const response = await dispatch(logoutUser());
    if(logoutUser.fulfilled.match(response)){
       navigate("/login")
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded shadow p-6 mb-6 flex md:flex-row flex-col items-center md:justify-between ">
        <h1 className="md:text-3xl text-xl font-bold mb-2 uppercase">Welcome, {user?.name || "User"}!</h1>
        <button 
          onClick={() => handleLogout()}
          className="bg-red-600 text-white md:w-28 w-20 md:h-10 h-8  rounded hover:bg-red-700 transition cursor-pointer"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleAddNote}
        className="w-full max-w-3xl bg-white rounded shadow p-6 mb-6 flex flex-col"
      >
        <label htmlFor="noteInput" className="mb-2 text-lg font-medium">
          Add a Note
        </label>
        <textarea
          id="noteInput"
          rows={3}
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder="Write your note here..."
          className="rounded p-3 mb-4 resize-none outline-none ring-1 focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="self-end bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
        >
          {loading ? "Saving..." : "Add Note"}
        </button>
      </form>

      <div className="w-full max-w-3xl bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Notes</h2>
        { notesList && notesList.length >0?(
          <ul>
            {notesList.map((note) => (
              <li
                key={note._id}
                className="flex justify-between items-center mb-3 border-b pb-2"
              >
                <p className="flex-1">{note.notes}</p>
                <button
                  className="ml-4 text-red-600 hover:text-red-800 cursor-pointer"
                  onClick={() => handleDeleteNote(note._id)}
                  disabled={loading}
                  title="Delete note"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ):( 
          <p className="text-gray-500">No notes yet. Start by adding one!</p> 
        )}
      </div>
    </div>
  );
}

export default WelcomePage;