// Shared types and color definitions for canvas components

// Game jam inspired color palette
export const colors = {
  // Base colors
  black: "#000000",
  darkBlue: "#0A0A2A",
  deepPurple: "#170B3B",
  codeGreen: "#00FF41",
  consoleGreen: "#0D350B",
  neonPink: "#FF00FF",
  neonBlue: "#00FFFF",
  brightYellow: "#FFFF00",
  white: "#FFFFFF",
  neonGreen: "#00FF41", // Alias for codeGreen

  // Game element colors
  pixelRed: "#FF3333",
  pixelOrange: "#FF9933",
  pixelYellow: "#FFFF33",
  pixelGreen: "#33FF33",
  pixelBlue: "#3333FF",
  pixelPurple: "#9933FF",

  // UI element colors
  uiDark: "#131633",
  uiMedium: "#2C2D5B",
  uiLight: "#4A4A7C",
  uiAccent: "#00CCFF",
  uiGlow: "#00AAFF",
};

export interface CanvasManager {
  drawPixel: (x: number, y: number, color: string, alpha?: number) => void;
}

export interface CanvasElement {
  update: (time: number) => void;
  draw: (time: number) => void;
}

export interface GameSettings {
  pixelSize: number;
  gameWidth: number;
  gameHeight: number;
}
