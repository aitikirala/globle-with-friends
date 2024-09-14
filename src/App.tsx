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
import { Modal, Box, Button, TextField } from '@mui/material'; 
import { db } from './components/Firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { today } from './util/dates';

function App() {
  const [reSpin, setReSpin] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [params] = useSearchParams();
  const practiceMode = Boolean(params.get("practice_mode"));

  const [open, setOpen] = useState(true); 
  const [showSignUpForm, setShowSignUpForm] = useState(false); 
  const [firstName, setFirstName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const [userName, setUserName] = useState(""); 
  const [signUpSuccessMessage, setSignUpSuccessMessage] = useState(""); // Message to show after sign up
  const themeContext = useContext(ThemeContext);

  useEffect(() => {
    if (reSpin) setTimeout(() => setReSpin(false), 1);
  }, [reSpin]);

  // Prevent closing the modal by clicking outside
  const handleClose = () => {
    // Do nothing, so they can't close the modal
  };

  const normalizeEmail = (email: string) => email.trim().toLowerCase();

  const handleSignIn = async () => {
    if (!email) {
      setErrorMessage("Please enter an email.");
      return;
    }

    try {
      const normalizedEmail = normalizeEmail(email); // Ensure lowercase

      const userDocRef = doc(db, "users", normalizedEmail); 
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const firstName = userData.firstName || "Anonymous";
        setUserName(firstName); 

        setOpen(false);
      } else {
        setErrorMessage("No user found with this email. Please try again.");
      }
    } catch (error) {
      console.error("Error checking email:", error);
      setErrorMessage("An error occurred while checking the email. Please try again.");
    }
  };

  const handleSignUp = () => {
    setShowSignUpForm(true); 
    setErrorMessage(""); 
  };

  const handleSubmit = async () => {
    if (firstName && email) {
      try {
        const normalizedEmail = normalizeEmail(email);

        // Add the user to the 'users' collection
        await setDoc(doc(db, "users", normalizedEmail), {
          firstName: firstName,
          email: normalizedEmail,
          gamesWon: 0 // Initial gamesWon
        });

        // Add the user to the 'scores' collection with a default score
        const scoresDocRef = doc(db, "scores", today); 
        await setDoc(scoresDocRef, {
          [normalizedEmail]: {
            firstName: firstName,
            score: 0, // Initial score set to 0
          }
        }, { merge: true });

        // Clear form and switch back to sign-in modal with a message
        setFirstName("");
        setEmail("");
        setShowSignUpForm(false); // Go back to the sign-in screen
        setSignUpSuccessMessage("Sign up successful! Now sign in."); // Display message to the user

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
        <Statistics setShowStats={setShowStats} userName={userName} email={email} />
      </Fade>

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

      {/* Modal for sign-in and sign-up */}
      <Modal open={open} onClose={handleClose}>
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
            alignItems: 'center',
          }}
        >
          {!showSignUpForm ? (
            <>
              <h2 id="popup-modal">Sign In</h2>
              {signUpSuccessMessage && <p style={{ color: "green" }}>{signUpSuccessMessage}</p>}
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
