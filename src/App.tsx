import { useContext, useState } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import Game from "./pages/Game";
import Header from "./components/Header";
import Help from "./pages/Help";
import Info from "./pages/Info";
import Settings from "./pages/Settings";
import Statistics from "./components/Statistics";
import { ThemeContext } from "./context/ThemeContext";
import Fade from "./transitions/Fade";
import { MobileOnlyView, TabletView, BrowserView } from "react-device-detect";
import SnackAdUnit from "./components/SnackAdUnit";
import Modal from "react-modal";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from './components/Firebase'; // Import both Firestore and Auth

Modal.setAppElement("#root"); // Required for proper modal behavior

function App() {
  const [reSpin, setReSpin] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [params] = useSearchParams();
  const practiceMode = Boolean(params.get("practice_mode"));
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isSignUp, setIsSignUp] = useState(true);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  });

  const themeContext = useContext(ThemeContext);
  const dark = themeContext.theme.nightMode ? "dark" : "";

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle Sign Up
  const handleSignUp = async () => {
    console.log("Sign-up button clicked!"); // Add this line for debugging
  
    try {
      // Validate that all fields are filled
      if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
        console.error("Please fill in all fields.");
        return;
      }
  
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;
      console.log("User created:", user.uid);
  
      // Save user data to Firestore (excluding password)
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date(),
      });
  
      console.log("User data saved to Firestore!");
  
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };
  
  

  // Handle Sign In
  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      console.log("User signed in successfully");
      setIsModalOpen(false); // Close the modal after successful sign-in
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during sign-in:", error.message);
      } else {
        console.error("Unexpected error during sign-in", error);
      }
    }
  };

  return (
    <div className={`max-w-xs sm:max-w-md md:max-w-2xl mx-auto z-20 absolute top-0 bottom-0 left-0 right-0 block ${dark}`}>
      <Header setReSpin={setReSpin} setShowStats={setShowStats} />

      <Fade
        show={showStats}
        background="border-4 border-sky-300 dark:border-slate-700 bg-sky-100 dark:bg-slate-900 drop-shadow-xl 
        absolute z-10 w-full sm:w-fit inset-x-0 mx-auto py-6 px-6 rounded-md space-y-2"
      >
        <Statistics setShowStats={setShowStats} />
      </Fade>

      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={() => setIsModalOpen(false)} 
        style={customStyles}
        contentLabel="User Authentication Modal"
      >
        <div className="p-6 bg-blue-600 text-white rounded-lg shadow-lg relative">
          <h2 className="text-2xl font-bold text-center mb-4">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h2>

          {isSignUp && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={userData.firstName}
                onChange={handleInputChange}
                className="mb-2 p-2 w-full border rounded-md bg-blue-500 placeholder-white text-white"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={userData.lastName}
                onChange={handleInputChange}
                className="mb-2 p-2 w-full border rounded-md bg-blue-500 placeholder-white text-white"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleInputChange}
            className="mb-2 p-2 w-full border rounded-md bg-blue-500 placeholder-white text-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleInputChange}
            className="mb-4 p-2 w-full border rounded-md bg-blue-500 placeholder-white text-white"
          />

          <button
            onClick={isSignUp ? handleSignUp : handleSignIn}
            className="bg-white text-blue-600 px-4 py-2 w-full rounded-md mb-4"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-white underline text-center block w-full cursor-pointer"
          >
            {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
          </button>
        </div>
      </Modal>

      <Routes>
        <Route path="/" element={<Help />} />
        <Route path="/game" element={<Game reSpin={reSpin} setShowStats={setShowStats} />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/info" element={<Info />} />
      </Routes>

      {!practiceMode && (
        <div className="sm:py-4">
          <MobileOnlyView>
            <SnackAdUnit unitName="snack_mex1" siteId="2902" />
          </MobileOnlyView>
          <BrowserView>
            <SnackAdUnit unitName="snack_dex1" siteId="2902" />
          </BrowserView>
          <TabletView>
            <SnackAdUnit unitName="snack_dex1" siteId="2902" />
          </TabletView>
        </div>
      )}
    </div>
  );
}

export default App;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#1e3a8a',
    borderRadius: '10px',
    padding: '0',
    width: '80%',
    maxWidth: '400px',
    zIndex: '10000',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: '9999',
  },
};
