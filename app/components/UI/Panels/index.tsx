import type { FC } from "react";
import { playSound } from "../../../utils/sound";
import { useState, useEffect } from "react";

export const SubmitPanel: FC = () => {
  const handleSubmitClick = () => {
    playSound("select");
    window.location.href = "http://jam.pieter.com";
  };

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const deadline = new Date("April 1, 2025").getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = deadline - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="ff-submit-panel">
      <div className="ff-panel-title-container">
        <h3 className="ff-panel-title">SUBMIT YOUR GAME</h3>
      </div>
      <p className="ff-panel-text">
        Join the vibejam game coding challenge! Create and submit your
        AI-powered game for a chance to win.
      </p>
      <p className="ff-panel-text font-bold text-red-400">
        Deadline: 1 April 2025
      </p>
      <div className="ff-panel-text text-yellow-300 flex justify-left gap-4 my-2">
        <div className="text-center">
          <div className="text-xl font-bold">{timeLeft.days}</div>
          <div className="text-xs">DAYS</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs">HOURS</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs">MINS</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs">SECS</div>
        </div>
      </div>
      <a
        href="#"
        className="ff-submit-button"
        onClick={(e) => {
          e.preventDefault();
          handleSubmitClick();
        }}
        onMouseEnter={() => playSound("hover", 0.3)}
      >
        <span className="ff-btn-icon">➔</span>
        <span className="ff-btn-text">BEGIN SUBMISSION</span>
      </a>
    </div>
  );
};

const juryMembers = ["karpathy", "timsoret", "mrdoob", "s13k_", "levelsio"];

export const JuryPanel: FC = () => {
  const handleJuryClick = (handle: string) => {
    playSound("click");
    window.open(`https://x.com/${handle}`, "_blank");
  };

  return (
    <div className="ff-jury-panel">
      <h3 className="ff-panel-title">JURY MEMBERS</h3>
      <div className="ff-jury-grid">
        {juryMembers.map((member) => (
          <div
            key={member}
            className="ff-jury-member cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleJuryClick(member)}
            onKeyDown={(e) => e.key === "Enter" && handleJuryClick(member)}
            onMouseEnter={() => playSound("hover", 0.3)}
            tabIndex={0}
            role="button"
            aria-label={`Visit ${member}'s Twitter profile`}
          >
            <div
              className="ff-jury-icon w-16 h-16 rounded-full bg-cover bg-center"
              style={{
                backgroundImage: `url(https://unavatar.io/twitter/${member}/)`,
                backgroundSize: "cover",
              }}
            />
            <div className="ff-jury-name">@{member}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const sponsors = ["boltdotnew", "coderabbitai"];

export const SponsorsPanel: FC = () => {
  const handleSponsorClick = (handle: string) => {
    playSound("click");
    window.open(`https://x.com/${handle}`, "_blank");
  };

  return (
    <div className="ff-sponsors-panel">
      <h3 className="ff-panel-title">SPONSORS</h3>
      <div className="ff-jury-grid">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor}
            className="ff-jury-member cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleSponsorClick(sponsor)}
            onKeyDown={(e) => e.key === "Enter" && handleSponsorClick(sponsor)}
            onMouseEnter={() => playSound("hover", 0.3)}
            tabIndex={0}
            role="button"
            aria-label={`Visit ${sponsor}'s Twitter profile`}
          >
            <div
              className="ff-jury-icon w-16 h-16 rounded-full bg-cover bg-center"
              style={{
                backgroundImage: `url(https://unavatar.io/twitter/${sponsor}/)`,
                backgroundSize: "cover",
              }}
            />
            <div className="ff-jury-name">@{sponsor}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ExitPanel: FC = () => {
  return (
    <div className="ff-exit-panel">
      <div className="ff-panel-title-container">
        <h3 className="ff-panel-title">EXIT</h3>
      </div>
      <p className="ff-panel-text">
        Thank you for your interest in the 2025 Vibe Coding Game Jam!
      </p>
      <p className="ff-panel-text">We hope to see your submission soon.</p>
    </div>
  );
};
