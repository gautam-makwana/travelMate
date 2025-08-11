import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// A simple Navbar component for the top of the page
const Navbar = ({ userId }) => (
    <nav className="p-4 bg-white/5 backdrop-blur-md shadow-lg fixed w-full z-10 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Collaborate
            </div>
            {userId && (
                <div className="text-sm text-gray-400 font-mono hidden md:block">
                    User ID: {userId}
                </div>
            )}
        </div>
    </nav>
);

// Reusable card for tool sections with a new design
const ToolCard = ({ title, icon, children }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        whileHover={{
            scale: 1.02,
            boxShadow: "0 0 40px rgba(0, 255, 127, 0.4)",
            transition: { duration: 0.3, ease: "easeInOut" }
        }}
        className="bg-white/5 backdrop-blur-3xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/10 transform transition-all duration-300"
    >
        <h3 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center gap-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            <span className="text-4xl drop-shadow-lg">{icon}</span>
            {title}
        </h3>
        {children}
    </motion.div>
);

export default function GroupTools() {
    const location = useLocation();
    const { travelType } = location.state || {};
    
    // --- Firestore and Auth State ---
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // --- Local State for UI and Form Inputs ---
    const [checklist, setChecklist] = useState([]);
    const [newItem, setNewItem] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [expenseName, setExpenseName] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [announcements, setAnnouncements] = useState([]);
    const [announcement, setAnnouncement] = useState("");
    const [polls, setPolls] = useState([]);
    const [newPollQuestion, setNewPollQuestion] = useState("");
    const [newPollOptions, setNewPollOptions] = useState([]);
    const [newOption, setNewOption] = useState("");
    const [votedPolls, setVotedPolls] = useState({});

    // IMPORTANT: Set a constant group ID for all users to share data.
    // In a real app, this would be a dynamic ID passed from the parent component.
    const groupChatId = "default-group-123";
    
    // --- Firebase Initialization and Authentication ---
    useEffect(() => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

        try {
            const app = initializeApp(firebaseConfig, appId);
            const firestoreDb = getFirestore(app);
            const firebaseAuth = getAuth(app);
            setDb(firestoreDb);
            setAuth(firebaseAuth);

            const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
                if (user) {
                    setUserId(user.uid);
                    setIsAuthReady(true);
                    setLoading(false);
                } else {
                    const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
                    if (token) {
                        await signInWithCustomToken(firebaseAuth, token);
                    } else {
                        await signInAnonymously(firebaseAuth);
                    }
                }
            });

            return () => unsubscribe(); // Cleanup auth listener
        } catch (error) {
            console.error("Error initializing Firebase:", error);
            setLoading(false);
        }
    }, []);

    // --- Firestore Listeners (onSnapshot) ---
    useEffect(() => {
        if (!isAuthReady || !db) return;

        const collectionPath = `artifacts/${__app_id}/public/data/${groupChatId}/checklists`;
        const q = collection(db, collectionPath);
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push({ ...doc.data(), id: doc.id });
            });
            items.sort((a, b) => a.createdAt?.toMillis() - b.createdAt?.toMillis());
            setChecklist(items);
        }, (error) => {
            console.error("Error fetching checklist:", error);
        });

        return () => unsubscribe();
    }, [db, isAuthReady]);

    useEffect(() => {
        if (!isAuthReady || !db) return;

        const collectionPath = `artifacts/${__app_id}/public/data/${groupChatId}/expenses`;
        const q = collection(db, collectionPath);
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push({ ...doc.data(), id: doc.id });
            });
            items.sort((a, b) => a.createdAt?.toMillis() - b.createdAt?.toMillis());
            setExpenses(items);
        }, (error) => {
            console.error("Error fetching expenses:", error);
        });
        
        return () => unsubscribe();
    }, [db, isAuthReady]);

    useEffect(() => {
        if (!isAuthReady || !db) return;

        const collectionPath = `artifacts/${__app_id}/public/data/${groupChatId}/announcements`;
        const q = collection(db, collectionPath);
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push({ ...doc.data(), id: doc.id });
            });
            items.sort((a, b) => a.createdAt?.toMillis() - b.createdAt?.toMillis());
            setAnnouncements(items);
        }, (error) => {
            console.error("Error fetching announcements:", error);
        });

        return () => unsubscribe();
    }, [db, isAuthReady]);

    useEffect(() => {
        if (!isAuthReady || !db) return;

        const collectionPath = `artifacts/${__app_id}/public/data/${groupChatId}/polls`;
        const q = collection(db, collectionPath);
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const items = [];
            const newVotedPolls = {};
            querySnapshot.forEach((doc) => {
                const data = { ...doc.data(), id: doc.id };
                items.push(data);
                if (data.votedBy?.includes(userId)) {
                    newVotedPolls[doc.id] = true;
                }
            });
            items.sort((a, b) => a.createdAt?.toMillis() - b.createdAt?.toMillis());
            setPolls(items);
            setVotedPolls(newVotedPolls);
        }, (error) => {
            console.error("Error fetching polls:", error);
        });

        return () => unsubscribe();
    }, [db, isAuthReady, userId]);

    // --- CRUD Functions for Firestore ---
    const handleAddChecklistItem = async () => {
        if (!newItem.trim() || !db) return;
        try {
            await addDoc(collection(db, `artifacts/${__app_id}/public/data/${groupChatId}/checklists`), {
                text: newItem,
                createdAt: new Date(),
                createdBy: userId,
            });
            setNewItem("");
        } catch (e) {
            console.error("Error adding checklist item: ", e);
        }
    };

    const handleDeleteChecklistItem = async (id) => {
        if (!db) return;
        try {
            await deleteDoc(doc(db, `artifacts/${__app_id}/public/data/${groupChatId}/checklists`, id));
        } catch (e) {
            console.error("Error deleting checklist item: ", e);
        }
    };

    const handleAddExpense = async () => {
        if (!expenseName.trim() || !expenseAmount.trim() || isNaN(parseFloat(expenseAmount)) || !db) return;
        try {
            await addDoc(collection(db, `artifacts/${__app_id}/public/data/${groupChatId}/expenses`), {
                name: expenseName,
                amount: parseFloat(expenseAmount),
                createdAt: new Date(),
                createdBy: userId,
            });
            setExpenseName("");
            setExpenseAmount("");
        } catch (e) {
            console.error("Error adding expense: ", e);
        }
    };

    const handleDeleteExpense = async (id) => {
        if (!db) return;
        try {
            await deleteDoc(doc(db, `artifacts/${__app_id}/public/data/${groupChatId}/expenses`, id));
        } catch (e) {
            console.error("Error deleting expense: ", e);
        }
    };
    
    const handlePostAnnouncement = async () => {
        if (!announcement.trim() || !db) return;
        try {
            await addDoc(collection(db, `artifacts/${__app_id}/public/data/${groupChatId}/announcements`), {
                text: announcement,
                createdAt: new Date(),
                createdBy: userId,
            });
            setAnnouncement("");
        } catch (e) {
            console.error("Error posting announcement: ", e);
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        if (!db) return;
        try {
            await deleteDoc(doc(db, `artifacts/${__app_id}/public/data/${groupChatId}/announcements`, id));
        } catch (e) {
            console.error("Error deleting announcement: ", e);
        }
    };

    const handleAddOption = () => {
        if (newOption.trim() !== "") {
            setNewPollOptions([...newPollOptions, { text: newOption, votes: 0 }]);
            setNewOption("");
        }
    };

    const handleCreatePoll = async () => {
        if (!newPollQuestion.trim() || newPollOptions.length < 2 || !db) return;
        try {
            await addDoc(collection(db, `artifacts/${__app_id}/public/data/${groupChatId}/polls`), {
                question: newPollQuestion,
                options: newPollOptions,
                createdAt: new Date(),
                createdBy: userId,
                votedBy: []
            });
            setNewPollQuestion("");
            setNewPollOptions([]);
        } catch (e) {
            console.error("Error creating poll: ", e);
        }
    };

    const handleVote = async (pollId, optionIndex) => {
        if (votedPolls[pollId] || !db) {
            return;
        }
        
        try {
            const pollRef = doc(db, `artifacts/${__app_id}/public/data/${groupChatId}/polls`, pollId);
            const currentPoll = polls.find(p => p.id === pollId);
            if (currentPoll) {
                const updatedOptions = [...currentPoll.options];
                updatedOptions[optionIndex].votes += 1;
                await updateDoc(pollRef, { 
                    options: updatedOptions, 
                    votedBy: arrayUnion(userId) 
                });
            }
        } catch (e) {
            console.error("Error voting on poll: ", e);
        }
    };

    if (travelType === "Solo") {
        return (
            <div className="min-h-screen text-white flex items-center justify-center bg-gray-950 px-4 animated-gradient-bg">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                    className="bg-white/5 backdrop-blur-3xl p-10 rounded-3xl border border-white/10 shadow-2xl text-center"
                >
                    <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                        Group tools are for group trips!
                    </h2>
                    <p className="text-lg text-gray-400">
                        Looks like you're planning a solo adventure. These tools aren't needed right now.
                    </p>
                </motion.div>
            </div>
        );
    }
    
    // Show a loading screen while Firebase is connecting
    if (loading) {
        return (
            <div className="min-h-screen text-white flex items-center justify-center bg-gray-950 animated-gradient-bg">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-400"></div>
                <p className="ml-4 text-xl font-medium text-gray-300">Connecting to group tools...</p>
            </div>
        );
    }

    return (
        <>
        <style>
            {`
            @keyframes gradient-animation {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }

            .animated-gradient-bg {
                background: linear-gradient(-45deg, #0a0a0a, #1a1a1a, #0a0a0a, #1a1a1a);
                background-size: 400% 400%;
                animation: gradient-animation 15s ease infinite;
            }
            `}
        </style>
        <div className="min-h-screen text-white antialiased font-sans animated-gradient-bg relative overflow-hidden">
            <Navbar userId={userId} />
            <section className="max-w-6xl mx-auto px-6 py-24 space-y-12">
                <motion.h2
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-4xl md:text-6xl font-bold mb-10 bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-500 bg-clip-text text-transparent text-center drop-shadow-lg"
                >
                    Group Collaboration Dashboard
                </motion.h2>

                {/* Shared Checklist */}
                <ToolCard title="Shared Checklist" icon="🧳">
                    <div className="flex gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Add item..."
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddChecklistItem()}
                            className="flex-1 p-3 rounded-xl bg-white/5 text-white placeholder:text-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddChecklistItem}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 shadow-lg"
                        >
                            Add
                        </motion.button>
                    </div>
                    <AnimatePresence>
                        <ul className="list-none space-y-3">
                            {checklist.map((item) => (
                                <motion.li
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-gray-200 flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/20 shadow-inner"
                                >
                                    {item.text}
                                    <motion.button
                                        whileHover={{ scale: 1.1, color: "#ef4444" }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDeleteChecklistItem(item.id)}
                                        className="text-red-400 hover:text-red-500 transition-all"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </motion.button>
                                </motion.li>
                            ))}
                        </ul>
                    </AnimatePresence>
                </ToolCard>

                {/* Quick Polls */}
                <ToolCard title="Quick Polls" icon="📊">
                    <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/20 shadow-inner">
                        <h4 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                             Create a New Poll
                        </h4>
                        <input
                            type="text"
                            placeholder="What's the question?"
                            value={newPollQuestion}
                            onChange={(e) => setNewPollQuestion(e.target.value)}
                            className="w-full p-3 mb-3 rounded-xl bg-white/5 text-white placeholder:text-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                        />
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                placeholder="Add an option..."
                                value={newOption}
                                onChange={(e) => setNewOption(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddOption()}
                                className="flex-1 p-3 rounded-xl bg-white/5 text-white placeholder:text-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2, boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAddOption}
                                className="bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-2 rounded-xl font-semibold transition-all duration-300 shadow-md"
                            >
                                Add Option
                            </motion.button>
                        </div>
                        <AnimatePresence>
                            {newPollOptions.length > 0 && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                    <ul className="list-disc list-inside space-y-1 mb-4 text-gray-300">
                                        {newPollOptions.map((option, idx) => (
                                            <li key={idx} className="flex items-center justify-between">
                                                {option.text}
                                                <motion.button
                                                    whileHover={{ scale: 1.1, color: "#ef4444" }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => setNewPollOptions(newPollOptions.filter((_, i) => i !== idx))}
                                                    className="text-red-400 hover:text-red-500 transition-all ml-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                </motion.button>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCreatePoll}
                            className={`w-full px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg ${newPollQuestion.trim() && newPollOptions.length > 1 ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400' : 'bg-white/10 cursor-not-allowed text-gray-500'}`}
                            disabled={!newPollQuestion.trim() || newPollOptions.length < 2}
                        >
                            Create Poll
                        </motion.button>
                    </div>

                    <AnimatePresence>
                        {polls.length > 0 ? (
                            polls.map((poll) => (
                                <motion.div
                                    key={poll.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="p-4 mb-4 bg-white/5 rounded-2xl border border-white/20"
                                >
                                    <h4 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">
                                        {poll.question}
                                    </h4>
                                    {poll.options.map((option, optionIndex) => (
                                        <motion.button
                                            key={optionIndex}
                                            onClick={() => handleVote(poll.id, optionIndex)}
                                            className={`w-full text-left p-3 my-2 rounded-xl transition-all duration-300 flex justify-between items-center ${votedPolls[poll.id] ? 'bg-white/10 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10'}`}
                                            disabled={votedPolls[poll.id]}
                                            whileHover={!votedPolls[poll.id] ? { scale: 1.02 } : {}}
                                            whileTap={!votedPolls[poll.id] ? { scale: 0.98 } : {}}
                                        >
                                            <span className="text-lg text-gray-200">{option.text}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-400">{option.votes} votes</span>
                                                <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(option.votes / Math.max(...poll.options.map(o => o.votes), 1)) * 100}%` }}
                                                        transition={{ duration: 0.5 }}
                                                        className="h-full bg-indigo-400"
                                                    />
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </motion.div>
                            ))
                        ) : (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-gray-400 italic text-center text-lg mt-4"
                            >
                                No polls yet. Create the first one above!
                            </motion.p>
                        )}
                    </AnimatePresence>
                </ToolCard>

                {/* Expense Tracker */}
                <ToolCard title="Shared Expenses" icon="💸">
                    <div className="flex gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Expense (e.g. Dinner)"
                            value={expenseName}
                            onChange={(e) => setExpenseName(e.target.value)}
                            className="flex-1 p-3 rounded-xl bg-white/5 text-white placeholder:text-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={expenseAmount}
                            onChange={(e) => setExpenseAmount(e.target.value)}
                            className="w-32 p-3 rounded-xl bg-white/5 text-white placeholder:text-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddExpense}
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 rounded-xl font-semibold hover:from-indigo-400 hover:to-purple-400 transition-all duration-300 shadow-lg"
                        >
                            Add
                        </motion.button>
                    </div>
                    <AnimatePresence>
                        <ul className="list-none space-y-3">
                            {expenses.map((exp) => (
                                <motion.li
                                    key={exp.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-gray-200 flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/20 shadow-inner"
                                >
                                    {exp.name}: ₹{exp.amount.toFixed(2)}
                                    <motion.button
                                        whileHover={{ scale: 1.1, color: "#ef4444" }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDeleteExpense(exp.id)}
                                        className="text-red-400 hover:text-red-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </motion.button>
                                </motion.li>
                            ))}
                        </ul>
                    </AnimatePresence>
                </ToolCard>

                {/* Announcement Board */}
                <ToolCard title="Announcements" icon="📢">
                    <div className="flex gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Enter announcement..."
                            value={announcement}
                            onChange={(e) => setAnnouncement(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && announcement.trim()) {
                                    handlePostAnnouncement();
                                }
                            }}
                            className="flex-1 p-3 rounded-xl bg-white/5 text-white placeholder:text-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handlePostAnnouncement}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 rounded-xl font-semibold hover:from-blue-400 hover:to-indigo-400 transition-all duration-300 shadow-lg"
                        >
                            Post
                        </motion.button>
                    </div>
                    <AnimatePresence>
                        <ul className="list-none space-y-3">
                            {announcements.map((text) => (
                                <motion.li
                                    key={text.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-gray-200 bg-white/5 p-4 rounded-xl border border-white/20 shadow-inner flex justify-between items-center"
                                >
                                    {text.text}
                                    <motion.button
                                        whileHover={{ scale: 1.1, color: "#ef4444" }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDeleteAnnouncement(text.id)}
                                        className="text-red-400 hover:text-red-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </motion.button>
                                </motion.li>
                            ))}
                        </ul>
                    </AnimatePresence>
                </ToolCard>
            </section>
        </div>
        </>
    );
}
