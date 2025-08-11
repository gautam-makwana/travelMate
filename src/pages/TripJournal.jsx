import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getFirestore,
  doc,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  query,
} from "firebase/firestore";
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";
import { initializeApp } from "firebase/app";

// Reusable icon for a clean UI
const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z"
      clipRule="evenodd"
    />
  </svg>
);

// Component for displaying an individual journal entry card
const JournalCard = ({ entry, handleDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/20 p-6 shadow-2xl overflow-hidden cursor-pointer
                 hover:shadow-[0_0_40px_-5px_rgba(139,92,246,0.6)] hover:border-violet-400 transition-all duration-300 group"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
        <div className="flex-grow">
          <h3 className="text-2xl font-bold text-violet-300 mb-1 group-hover:text-violet-200 transition-colors duration-300">{entry.place}</h3>
          <span className="text-sm text-gray-400 font-light">{entry.date}</span>
        </div>
        <motion.button
          onClick={() => handleDelete(entry.id)}
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          className="mt-2 md:mt-0 p-3 text-white bg-red-600/60 rounded-full hover:bg-red-700/80 transition-colors duration-200 self-end md:self-auto
                      focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <DeleteIcon />
        </motion.button>
      </div>
      <p className="text-gray-200 mb-4 font-light">{entry.text}</p>
      {entry.photoURL && (
        <motion.img
          src={entry.photoURL}
          alt="Trip pic"
          className="rounded-xl w-full max-h-64 object-cover my-4 shadow-xl border border-white/10"
          initial={{ scale: 0.95, opacity: 0, filter: "grayscale(100%)" }}
          animate={{ scale: 1, opacity: 1, filter: "grayscale(0%)" }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.div>
  );
};

// Component for the navigation bar
const Navbar = ({ userId }) => (
  <nav className="fixed w-full z-20 top-0 left-0 bg-black/50 backdrop-blur-xl p-4 shadow-lg border-b border-white/10">
    <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
      <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
        Trip Journal
      </div>
      {userId && (
        <div className="text-sm font-mono text-gray-400 truncate w-32 md:w-auto">
          User ID: {userId}
        </div>
      )}
    </div>
  </nav>
);

function App() {
  // State for application data and Firebase services
  const [entries, setEntries] = useState([]);
  const [date, setDate] = useState("");
  const [place, setPlace] = useState("");
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Initialize Firebase services and handle authentication
  useEffect(() => {
    try {
      const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";
      const firebaseConfig = JSON.parse(
        typeof __firebase_config !== "undefined"
          ? __firebase_config
          : "{}"
      );
      const initialAuthToken =
        typeof __initial_auth_token !== "undefined"
          ? __initial_auth_token
          : null;
      
      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const firebaseAuth = getAuth(app);
      
      setDb(firestoreDb);
      setAuth(firebaseAuth);
      
      // Listen for auth state changes and sign in the user
      onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
          setLoading(false);
        } else {
          try {
            if (initialAuthToken) {
              await signInWithCustomToken(firebaseAuth, initialAuthToken);
            } else {
              await signInAnonymously(firebaseAuth);
            }
          } catch (error) {
            console.error("Authentication failed:", error);
            setLoading(false);
          }
        }
      });
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      setLoading(false);
    }
  }, []);

  // Fetch journal entries from Firestore in real-time
  useEffect(() => {
    if (!db || !userId) return;

    // Construct the collection path for the current user's private data
    const collectionPath = `/artifacts/${typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}/users/${userId}/journal_entries`;
    const q = query(collection(db, collectionPath));

    // Listen for real-time changes to the collection
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const journalEntries = [];
      querySnapshot.forEach((doc) => {
        journalEntries.push({ id: doc.id, ...doc.data() });
      });
      // Sort entries by creation time in descending order
      journalEntries.sort((a, b) => b.createdAt - a.createdAt);
      setEntries(journalEntries);
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, [db, userId]);

  // Handler to add a new journal entry
  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!date || !place || !text || isFormLoading) return;

    setIsFormLoading(true);
    try {
      const collectionPath = `/artifacts/${typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}/users/${userId}/journal_entries`;
      await addDoc(collection(db, collectionPath), {
        date,
        place,
        text,
        photoURL: photo,
        createdAt: Date.now(),
      });

      // Clear the form after successful submission
      setDate("");
      setPlace("");
      setText("");
      setPhoto(null);
    } catch (error) {
      console.error("Error adding document:", error);
    } finally {
      setIsFormLoading(false);
    }
  };

  // Handler for photo file upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // NOTE: This approach stores the image as a Base64 string in Firestore.
        // For production applications with larger images, it's recommended to use
        // a dedicated storage service like Firebase Storage to avoid hitting
        // Firestore document size limits (1MB).
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler to delete a journal entry
  const handleDelete = async (id) => {
    try {
      const docPath = `/artifacts/${typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}/users/${userId}/journal_entries/${id}`;
      await deleteDoc(doc(db, docPath));
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  // Show a loading spinner while authenticating
  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-inter animated-gradient-bg relative overflow-hidden">
      <Navbar userId={userId} />

      <div className="max-w-7xl mx-auto py-24 px-6 relative z-10 grid gap-16 lg:grid-cols-2">
        {/* Left column: Journal Entry Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl lg:text-5xl font-extrabold text-center mb-8
                           bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg"
          >
            Create a New Entry ✍️
          </motion.h2>
          <form
            onSubmit={handleAddEntry}
            className="grid gap-6 bg-white/5 backdrop-blur-3xl p-8 rounded-3xl border border-white/20 shadow-2xl transition-all duration-500
                           hover:shadow-[0_0_60px_-15px_rgba(139,92,246,0.3)]"
          >
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-black/30 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-white/10
                           focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 transition-all duration-300
                           hover:border-cyan-300"
            />
            <input
              type="text"
              placeholder="Place visited"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              required
              className="w-full bg-black/30 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-white/10
                           focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 transition-all duration-300
                           hover:border-cyan-300"
            />
            <textarea
              rows="4"
              placeholder="Your experience..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              className="w-full bg-black/30 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-white/10
                           focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 transition-all duration-300
                           hover:border-cyan-300"
            />
            <label className="block text-gray-300 font-medium">
              <span className="sr-only">Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="block w-full text-sm text-gray-500
                                 file:mr-4 file:py-2 file:px-4
                                 file:rounded-full file:border-0
                                 file:text-sm file:font-semibold
                                 file:bg-purple-600/70 file:text-white file:shadow-lg
                                 hover:file:bg-purple-700/80 transition-all duration-300"
              />
            </label>
            {photo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mt-2 text-center"
              >
                <img
                  src={photo}
                  alt="Preview"
                  className="rounded-xl w-full max-h-48 object-cover border-2 border-white/30 shadow-lg"
                />
              </motion.div>
            )}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isFormLoading}
              className="mt-4 w-full py-4 rounded-full font-bold text-lg shadow-xl text-white relative overflow-hidden
                           bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 transition-all duration-500
                           disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFormLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent mr-2"></div>
                  Adding Entry...
                </div>
              ) : (
                "Add Entry ✍️"
              )}
              <motion.div
                className="absolute inset-0 bg-white opacity-0 mix-blend-overlay"
                whileHover={{ opacity: 0.2 }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </motion.button>
          </form>
        </motion.div>

        {/* Right column: List of Journal Entries */}
        <div className="lg:max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-violet-500/50 scrollbar-track-transparent pr-4">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-4xl lg:text-5xl font-extrabold text-center mb-8
                           bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg"
          >
            My Journal 📔
          </motion.h2>
          <AnimatePresence mode="popLayout">
            {entries.length > 0 ? (
              <div className="grid gap-8">
                {entries.map((entry) => (
                  <JournalCard key={entry.id} entry={entry} handleDelete={handleDelete} />
                ))}
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-400 text-center text-lg italic mt-10"
              >
                Your journal is empty. Add your first memory!
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Global styles for the animated gradient background */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        .animated-gradient-bg { 
          background: linear-gradient(-45deg, #0a0a0a, #1a1a1a, #0a0a0a, #1a1a1a); 
          background-size: 400% 400%; 
          animation: gradient-animation 15s ease infinite; 
        } 
 
        @keyframes gradient-animation { 
          0% { 
            background-position: 0% 50%; 
          } 
          50% { 
            background-position: 100% 50%; 
          } 
          100% { 
            background-position: 0% 50%; 
          } 
        }

        /* Custom scrollbar for Webkit browsers */
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(139, 92, 246, 0.5); /* violet-500/50 */
          border-radius: 20px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        
        /* Custom scrollbar for Firefox */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 92, 246, 0.5) transparent; /* violet-500/50 */
        }
        `}
      </style>
    </div>
  );
}

export default App;
