import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNotes, deleteNotes, getNotes } from "../store/notesSlice.js";
import { logoutUser } from "../store/userSlice.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrNotes } from "react-icons/gr";
import { LuLogOut } from "react-icons/lu";

function WelcomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notesList, loadingDelete, loadingCreate, error } = useSelector(
    (state) => state.notes
  );
  const [noteInput, setNoteInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getNotes());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
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
      await dispatch(getNotes());
    }
  };

  const handleDeleteNote = async (noteId) => {
    const response = await dispatch(deleteNotes(noteId));
    if (deleteNotes.fulfilled.match(response)) {
      toast.success("Note deleted.");
      await dispatch(getNotes());
    }
  };

  const handleLogout = async () => {
    const response = await dispatch(logoutUser());
    if (logoutUser.fulfilled.match(response)) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col md:flex-row">
      <aside className="bg-white md:shadow-md w-full md:w-64  md:h-auto flex flex-col items-center md:items-start px-6 py-5">
        <h2 className="text-2xl font-semibold text-blue-950 font-serif mb-4 md:mb-6">
          Welcome, {user?.name || "User"}!
        </h2>
        <div className="flex flex-col gap-3 md:w-full">
          <span className="hidden bg-blue-950/90 text-white px-4 py-2 rounded-md md:flex items-center gap-2 font-medium">
            <GrNotes />
            Notes
          </span>
          <button
            onClick={handleLogout}
            className="bg-blue-950/90 text-white px-6 py-1.5 md:py-2 rounded-md flex items-center gap-2 font-medium cursor-pointer"
          >
            <LuLogOut className="hidden md:flex" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10">
        <div className="bg-white rounded-xl shadow pb-12 px-3 md:px-8 pt-3 md:pt-5 mb-6 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold font-serif text-gray-600 mb-2 md:mb-3">
            Add a Note
          </h3>
          <form onSubmit={handleAddNote} className="relative">
            <textarea
              rows={3}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Take a note…"
              className="w-full bg-blue-900/20 rounded-md p-3 outline-none mb-4 resize-none focus:ring-2 focus:ring-blue-950/50 transition"
            />
            <button
              type="submit"
              className="absolute -bottom-7 right-0 bg-blue-950/90 text-white font-bold px-5 py-1.5 rounded-md hover:bg-blue-950/100 cursor-pointer transition"
              disabled={loadingCreate}
            >
              {loadingCreate ? "Saving…" : "Add Note"}
            </button>
          </form>
        </div>

        <section className="max-w-full mx-auto">
          <h4 className="flex items-center gap-2 text-lg font-bold text-blue-950 font-serif mb-2">
            <GrNotes />
            My Notes
          </h4>
          <div className="flex flex-wrap md:gap-5 gap-4">
            {notesList && notesList.length > 0 ? (
              notesList.map((note) => (
                <div
                  key={note._id}
                  className="bg-white p-5 rounded-lg shadow-md w-full sm:w-[220px] min-h-[130px] flex flex-col justify-between relative"
                >
                  <p className="text-gray-800 text-base mb-5 leading-relaxed">
                    {note.notes}
                  </p>
                  <div className="flex justify-between items-center absolute right-4 bottom-4">
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="text-blue-950/90 cursor-pointer hover:text-blue-950/100 text-xl"
                      disabled={loadingDelete}
                      title="Delete note"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                  <span className="text-blue-950/60 text-xs absolute left-4 bottom-4">
                    {note.updatedAt
                      ? new Date(note.updatedAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No notes yet. Start by adding one!
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default WelcomePage;
