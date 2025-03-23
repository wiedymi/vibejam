import { useEffect, useState } from "react";
import "../styles/pixel.css";
import CanvasManager from "../components/canvas/CanvasManager";
import Menu from "../components/UI/Menu";
import {
  SubmitPanel,
  JuryPanel,
  SponsorsPanel,
  ExitPanel,
} from "../components/UI/Panels";
import { playSound } from "../utils/sound";

export function meta() {
  return [
    { title: "2025 Vibe Coding Game Jam - #vibejam" },
    {
      name: "description",
      content: "The first game jam for AI vibecoded games",
    },
  ];
}

export default function Home() {
  const [selectedItem, setSelectedItem] = useState(0);
  const menuItems = ["SUBMIT GAME", "JURY", "SPONSORS", "EXIT"];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setSelectedItem((prev) =>
          prev < menuItems.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        setSelectedItem((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter" && selectedItem === 0) {
        playSound("select");
        window.location.href = "http://jam.pieter.com";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, menuItems.length]);

  const handleCopyHashtag = () => {
    playSound("click");
    navigator.clipboard.writeText("#vibejam");
    alert("Copied #vibejam to clipboard!");
  };

  return (
    <>
      <CanvasManager />
      <div className="ff-game-interface">
        <div className="ff-title-box">
          <h1 className="ff-title">2025 VIBE CODING GAME JAM</h1>
          <div className="ff-subtitle">
            The first game jam for AI vibecoded games
          </div>
          <div
            className="ff-hash cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleCopyHashtag}
            onMouseEnter={() => playSound("hover", 0.3)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleCopyHashtag();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Click to copy #vibejam hashtag"
          >
            #vibejam
          </div>
        </div>

        <div className="ff-menu-layout">
          <Menu
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            menuItems={menuItems}
          />

          <div className="ff-content-box">
            {selectedItem === 0 && <SubmitPanel />}
            {selectedItem === 1 && <JuryPanel />}
            {selectedItem === 2 && <SponsorsPanel />}
            {selectedItem === 3 && <ExitPanel />}
          </div>
        </div>
      </div>
    </>
  );
}
