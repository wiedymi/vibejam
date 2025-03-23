/**
 * Sound utilities for UI interactions
 */

// Map of sound names to their file paths
const sounds = {
  click: "/sounds/click.mp3",
  hover: "/sounds/hover.mp3",
  select: "/sounds/click.mp3",
  navigate: "/sounds/hover.mp3",
};

type SoundName = keyof typeof sounds;

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined" && typeof Audio !== "undefined";

// Store audio objects that are ready to play
const audioElements: Partial<Record<SoundName, HTMLAudioElement>> = {};

// Initialize and preload sounds
const initSounds = () => {
  if (!isBrowser) return;

  // Create audio elements and set attributes
  Object.entries(sounds).forEach(([name, path]) => {
    try {
      const audio = new Audio();
      audio.src = path;
      audio.preload = "auto";

      // Add event listeners for debugging
      audio.addEventListener("error", (e) => {
        console.error(`Error loading sound ${name}:`, e);
      });

      // Store the audio element
      audioElements[name as SoundName] = audio;

      // Force preload
      audio.load();
    } catch (err) {
      console.error("Failed to create audio element:", err);
    }
  });
};

/**
 * Play a sound by name
 * @param name The name of the sound to play
 * @param volume Optional volume between 0 and 1 (default: 0.3)
 */
const playSound = (name: SoundName, volume = 0.3) => {
  if (!isBrowser) return;

  try {
    // Create a new Audio instance each time for better reliability
    const sound = new Audio(sounds[name]);
    sound.volume = volume;

    // Play the sound
    const playPromise = sound.play();

    // Handle promise rejection (happens in some browsers if interaction hasn't occurred)
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.debug("Failed to play sound:", err);
      });
    }
  } catch (err) {
    console.debug("Error playing sound:", err);
  }
};

// Initialize sounds
if (isBrowser) {
  // Wait for document to be ready
  if (document.readyState === "complete") {
    initSounds();
  } else {
    window.addEventListener("load", initSounds);
  }
}

export { playSound, type SoundName };
