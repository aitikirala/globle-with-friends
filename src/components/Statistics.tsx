import { useContext, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Stats } from "../lib/localStorage";
import { isMobile } from "react-device-detect";
import { getPath } from "../util/svg";
import { today } from "../util/dates";
import { FormattedMessage } from "react-intl";
import { LocaleContext } from "../i18n/LocaleContext";
import localeList from "../i18n/messages";

type Props = {
  setShowStats: React.Dispatch<React.SetStateAction<boolean>>;
  userName?: string; // Allow userName to be passed in
};

export default function Statistics({ setShowStats, userName }: Props) {
  const localeContext = useContext(LocaleContext);
  const { locale } = localeContext;

  const firstStats = {
    gamesWon: 0,
    lastWin: new Date(0).toLocaleDateString("en-CA"),
    currentStreak: 0,
    maxStreak: 0,
    usedGuesses: [],
    emojiGuesses: "",
  };

  const [storedStats] = useLocalStorage<Stats>("statistics", firstStats);
  const { gamesWon, lastWin, currentStreak, maxStreak, usedGuesses} = storedStats;

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
      {/* Reset and Share buttons remain unchanged */}
    </div>
  );
}
