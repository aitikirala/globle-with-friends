import { useContext, useEffect, useState } from "react";
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
import { Modal, Box, Button, TextField } from '@mui/material'; // For modal and form
import { db } from './components/Firebase'; // Import Firestore from Firebase.tsx
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore functions

function App() {
  // State
  const [reSpin, setReSpin] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [params] = useSearchParams();
  const practiceMode = Boolean(params.get("practice_mode"));

  // Modal state
  const [open, setOpen] = useState(true); 
  const [showSignUpForm, setShowSignUpForm] = useState(false); // For sign-up form
  const [firstName, setFirstName] = useState(""); // First name input state
  const [email, setEmail] = useState(""); // Email input state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  // Context
  const themeContext = useContext(ThemeContext);

  // Re-render globe
  useEffect(() => {
    if (reSpin) setTimeout(() => setReSpin(false), 1);
  }, [reSpin]);

  const handleClose = () => setOpen(false);

  // Normalize email to lowercase
  const normalizeEmail = (email: string) => email.trim().toLowerCase();

  // Handle Sign In button
  const handleSignIn = async () => {
    if (!email) {
      setErrorMessage("Please enter an email.");
      return;
    }

    try {
      const normalizedEmail = normalizeEmail(email); // Normalize email to lowercase

      // Check if the email exists in Firestore
      const docRef = doc(db, "users", normalizedEmail); // Use normalized email
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("User found:", docSnap.data());
        setOpen(false); // Close the modal and allow the user to continue
      } else {
        setErrorMessage("No user found with this email. Please try again.");
      }
    } catch (error) {
      console.error("Error checking email:", error);
      setErrorMessage("An error occurred while checking the email. Please try again.");
    }
  };

  // Handle Sign Up button - shows form
  const handleSignUp = () => {
    setShowSignUpForm(true); // Show sign-up form instead of sign-in buttons
    setErrorMessage(""); // Clear any error messages when switching to sign-up
  };

  // Handle Sign Up form submission
  const handleSubmit = async () => {
    if (firstName && email) {
      try {
        const normalizedEmail = normalizeEmail(email); // Normalize email to lowercase

        // Save to Firebase Firestore
        await setDoc(doc(db, "users", normalizedEmail), {
          firstName: firstName,
          email: normalizedEmail // Store the normalized email
        });

        console.log("Data submitted to Firebase");

        // Clear form and close modal
        setFirstName("");
        setEmail("");
        setOpen(false);

      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      setErrorMessage("Please fill in both fields.");
    }
  };

  const dark = themeContext.theme.nightMode ? "dark" : "";

  return (
    <div
      className={`max-w-xs sm:max-w-md md:max-w-2xl mx-auto 
      z-20 absolute top-0 bottom-0 left-0 right-0 block ${dark}`}
    >
      <Header setReSpin={setReSpin} setShowStats={setShowStats} />

      <Fade
        show={showStats}
        background="border-4 border-sky-300 dark:border-slate-700 bg-sky-100 
        dark:bg-slate-900 drop-shadow-xl 
      absolute z-10 w-full sm:w-fit inset-x-0 mx-auto py-6 px-6 rounded-md 
      space-y-2"
      >
        <Statistics setShowStats={setShowStats} />
      </Fade>
      <Routes>
        <Route path="/" element={<Help />} />
        <Route
          path="/game"
          element={<Game reSpin={reSpin} setShowStats={setShowStats} />}
        />
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

      {/* Modal for sign-in and sign-up */}
      <Modal
        open={open} // Control the visibility of the modal
        onClose={handleClose}
        aria-labelledby="popup-modal"
        aria-describedby="popup-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {!showSignUpForm ? (
            <>
              <h2 id="popup-modal">Sign In</h2>
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                style={{ marginBottom: '10px' }}
              />
              {errorMessage && (
                <p style={{ color: "red" }}>{errorMessage}</p>
              )}
              <Button variant="contained" color="primary" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button variant="contained" color="secondary" onClick={handleSignUp} style={{ marginTop: '10px' }}>
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <h2 id="popup-modal">Sign Up</h2>
              <TextField
                label="First Name"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                style={{ marginBottom: '10px' }}
              />
              {errorMessage && (
                <p style={{ color: "red" }}>{errorMessage}</p>
              )}
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default App;
