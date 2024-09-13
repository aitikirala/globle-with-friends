import { useContext, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Stats } from "../lib/localStorage";
import { isMobile } from "react-device-detect";
import { getPath } from "../util/svg";
import { today } from "../util/dates";
import { FormattedMessage } from "react-intl";
import { LocaleContext } from "../i18n/LocaleContext";
import localeList from "../i18n/messages";
import { db } from "./Firebase"; // Import Firestore from Firebase
import { doc, getDoc, setDoc } from "firebase/firestore"; // Import Firestore functions

type Props = {
  setShowStats: React.Dispatch<React.SetStateAction<boolean>>;
  userName?: string; // Allow userName to be optional
  email?: string; // Add email as an optional prop
};


export default function Statistics({ setShowStats, userName, email }: Props) {
  const localeContext = useContext(LocaleContext);
  const { locale } = localeContext;

  useEffect(() => {
    if (email) {
      // Update stats or make API calls using email
      console.log(`User email is: ${email}`);
    }
  }, [email]);

  const firstStats = {
    gamesWon: 0,
    lastWin: new Date(0).toLocaleDateString("en-CA"),
    currentStreak: 0,
    maxStreak: 0,
    usedGuesses: [],
    emojiGuesses: "",
  };

  const [storedStats] = useLocalStorage<Stats>("statistics", firstStats);
  const { gamesWon, lastWin, currentStreak, maxStreak, usedGuesses } = storedStats;

  const sumGuesses = usedGuesses.reduce((a, b) => a + b, 0);
  const avgGuesses = Math.round((sumGuesses / usedGuesses.length) * 100) / 100;
  const showAvgGuesses = usedGuesses.length === 0 ? "--" : avgGuesses;
  const todaysGuesses = lastWin === today ? usedGuesses[usedGuesses.length - 1] : "--";
  const showLastWin = lastWin >= "2022-01-01" ? lastWin : "--";

  const avgShorthand = isMobile ? localeList[locale]["Stats7"] : localeList[locale]["Stats6"];

  const statsTable = [
    { label: localeList[locale]["Stats1"], value: showLastWin },
    { label: localeList[locale]["Stats2"], value: todaysGuesses },
    { label: localeList[locale]["Stats3"], value: gamesWon },
    { label: localeList[locale]["Stats4"], value: currentStreak },
    { label: localeList[locale]["Stats5"], value: maxStreak },
    { label: avgShorthand, value: showAvgGuesses },
  ];

  const modalRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    function closeModal(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!modalRef.current?.contains(target)) {
        setShowStats(false);
      }
    }
    document.addEventListener("click", closeModal);
    return () => {
      document.removeEventListener("click", closeModal);
    };
  }, [setShowStats]);

  
  const updateScore = async (email: string, todaysGuesses: number) => {
    if (!email || todaysGuesses === 0) {
      console.log("No valid email or guesses to update.");
      return; // Ensure email and guesses are valid
    }
  
    try {
      console.log("Updating score for:", email, "with guesses:", todaysGuesses); // Log the email and guesses
  
      // Create a reference to the Firestore document
      const scoresDocRef = doc(db, "scores", today);
  
      // Set or update the score for the user
      await setDoc(
        scoresDocRef,
        {
          [email]: {
            firstName: userName || "Unknown", // Include user's first name
            score: todaysGuesses, // Store score as a number
          },
        },
        { merge: true } // Merge with existing data
      );
  
      console.log(`Score updated for ${email}: ${todaysGuesses}`);
    } catch (error) {
      console.error("Error updating score in Firestore:", error); // Log any errors
    }
  };
  
  useEffect(() => {
    // Check if the user has guessed the mystery country correctly today
    if (lastWin === today && email && todaysGuesses !== "--" && Number(todaysGuesses) !== 0) {
      console.log("User guessed the country correctly. Updating Firestore with todaysGuesses:", todaysGuesses);
      updateScore(email, Number(todaysGuesses)); // Call updateScore to update Firestore
    } else {
      console.log("Conditions not met for updating the score. Either no win or invalid guesses.");
    }
  }, [lastWin, email, todaysGuesses, userName]);
  

  useEffect(() => {
    if (lastWin === today && email && todaysGuesses !== "--" && Number(todaysGuesses) !== 0) {
      console.log("User guessed the country correctly. Updating Firestore with todaysGuesses:", todaysGuesses);
      updateScore(email, Number(todaysGuesses)); // Call updateScore to update Firestore
    } else {
      console.log("Conditions not met for updating the score. Either no win or invalid guesses.");
    }
  }, [lastWin, email, todaysGuesses, userName]);
  

  // Leaderboard Modal State
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<{ name: string, score: string }[]>([]);

  const fetchLeaderboard = async () => {
    const leaderboard: { name: string, score: string }[] = [];
    try {
      const scoresDocRef = doc(db, "scores", today); // Fetch today's document from Firestore
      const docSnapshot = await getDoc(scoresDocRef); // Use getDoc to fetch a single document

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        for (const [email, scoreData] of Object.entries(data)) {
          console.log("Fetched score for", email, ":", scoreData); // Log the fetched data
          leaderboard.push({ name: (scoreData as any).firstName, score: (scoreData as any).score });
        }
      } else {
        console.log("No data found for today's scores.");
      }

      setLeaderboardData(leaderboard);
      setShowLeaderboard(true); // Show leaderboard modal
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  return (
    <div ref={modalRef} className="max-w-sm">
      <button className="absolute top-3 right-4" onClick={() => setShowStats(false)}>
        <svg viewBox="0 0 460.775 460.775" width="12px" className="dark:fill-gray-300">
          <path d={getPath("x")} />
        </svg>
      </button>
      <h2 className="text-3xl text-center font-extrabold dark:text-gray-200" style={{ fontFamily: "'Montserrat'" }}>
        {/* Display user's name if available */}
        {userName ? `${userName}'s Statistics` : <FormattedMessage id="StatsTitle" />}
      </h2>
      <table cellPadding="4rem" className="mx-auto dark:text-gray-200" width="100%">
        <tbody>
          {statsTable.map((row, idx) => (
            <tr key={idx}>
              <td className="pt-4 border-b-2 border-dotted border-slate-700 text-lg font-medium">
                {row.label}
              </td>
              <td className="pt-4 border-b-2 border-dotted border-slate-700 text-lg font-medium">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add the Leaderboard button */}
      <div className="flex justify-around mt-6">
        <button onClick={fetchLeaderboard} className="bg-blue-500 text-white rounded-md px-4 py-2">
          Leaderboard
        </button>
      </div>

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
            <ul>
              {leaderboardData.map((entry, index) => (
                <li key={index} className="my-2">
                  {entry.name}: {entry.score}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setShowLeaderboard(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
