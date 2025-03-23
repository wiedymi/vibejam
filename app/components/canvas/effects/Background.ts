import { colors } from "../types";
import type { CanvasManager } from "../types";

export const drawBackground = (
  time: number,
  gameWidth: number,
  gameHeight: number,
  drawPixel: CanvasManager["drawPixel"]
) => {
  // Create animated gradient background
  for (let y = 0; y < gameHeight; y++) {
    for (let x = 0; x < gameWidth; x++) {
      // Calculate gradient based on position
      const gradientY = y / gameHeight;
      const gradientX = x / gameWidth;
      let color;

      // Create a dark, tech-inspired gradient
      if (gradientY < 0.2) {
        color = colors.black;
      } else if (gradientY < 0.6) {
        color = colors.deepPurple;
      } else {
        color = colors.darkBlue;
      }

      // Add subtle grid pattern
      const gridSize = 20;
      const gridX = x % gridSize;
      const gridY = y % gridSize;

      if ((gridX === 0 || gridY === 0) && Math.random() > 0.7) {
        const gridAlpha = 0.1 + Math.sin(time + x * 0.01 + y * 0.01) * 0.05;
        drawPixel(x, y, colors.uiGlow, gridAlpha);
      } else {
        drawPixel(x, y, color);
      }
    }
  }
};

export const drawCircuits = (
  time: number,
  gameWidth: number,
  gameHeight: number,
  drawPixel: CanvasManager["drawPixel"]
) => {
  const circuitSize = 20;
  const circuitCount = 5;

  for (let i = 0; i < circuitCount; i++) {
    const startX = (Math.sin(time * 0.2 + i) * gameWidth) / 2 + gameWidth / 2;
    const startY =
      (Math.cos(time * 0.1 + i * 2) * gameHeight) / 2 + gameHeight / 2;

    // Create branching paths
    drawCircuitPath(
      startX,
      startY,
      0,
      0,
      3,
      time,
      gameWidth,
      gameHeight,
      drawPixel
    );
  }
};

// Recursive function to draw circuit patterns
const drawCircuitPath = (
  x: number,
  y: number,
  dir: number,
  length: number,
  depth: number,
  time: number,
  gameWidth: number,
  gameHeight: number,
  drawPixel: CanvasManager["drawPixel"]
) => {
  if (depth <= 0) return;

  // Direction vectors: right, down, left, up
  const dirX = [1, 0, -1, 0];
  const dirY = [0, 1, 0, -1];

  // Choose a new direction if starting a new path
  if (length === 0) {
    dir = Math.floor(Math.random() * 4);
  }

  // Draw current segment
  const segmentLength = 5 + Math.floor(Math.random() * 10);
  let newX = x;
  let newY = y;

  for (let i = 0; i < segmentLength; i++) {
    newX += dirX[dir];
    newY += dirY[dir];

    // Stop if we go off screen
    if (newX < 0 || newX >= gameWidth || newY < 0 || newY >= gameHeight) {
      return;
    }

    // Draw circuit line
    const pulse = (Math.sin(time * 3 + newX * 0.05 + newY * 0.05) + 1) / 2;
    const alpha = 0.2 + pulse * 0.3;

    drawPixel(newX, newY, colors.uiAccent, alpha);

    // Occasionally add a circuit node
    if (i > 0 && i < segmentLength - 1 && Math.random() > 0.8) {
      drawPixel(newX + 1, newY, colors.neonBlue, alpha * 0.8);
      drawPixel(newX - 1, newY, colors.neonBlue, alpha * 0.8);
      drawPixel(newX, newY + 1, colors.neonBlue, alpha * 0.8);
      drawPixel(newX, newY - 1, colors.neonBlue, alpha * 0.8);
    }
  }

  // Chance to branch
  if (Math.random() > 0.5) {
    const newDir = (dir + 1) % 4; // Turn right
    drawCircuitPath(
      newX,
      newY,
      newDir,
      0,
      depth - 1,
      time,
      gameWidth,
      gameHeight,
      drawPixel
    );
  }

  if (Math.random() > 0.5) {
    const newDir = (dir + 3) % 4; // Turn left
    drawCircuitPath(
      newX,
      newY,
      newDir,
      0,
      depth - 1,
      time,
      gameWidth,
      gameHeight,
      drawPixel
    );
  }

  // Continue straight
  if (Math.random() > 0.3) {
    drawCircuitPath(
      newX,
      newY,
      dir,
      length + segmentLength,
      depth - 1,
      time,
      gameWidth,
      gameHeight,
      drawPixel
    );
  }
};

export const drawCyberpunkSkyline = (
  time: number,
  gameWidth: number,
  gameHeight: number,
  drawPixel: CanvasManager["drawPixel"]
) => {
  // Draw distant city buildings in the background
  for (let i = 0; i < gameWidth; i += 5) {
    // Vary building heights
    const buildingHeight =
      10 + Math.sin(i * 0.1) * 5 + Math.sin(i * 0.05 + time) * 3;
    const yStart = gameHeight * 0.7 - buildingHeight;
    const yEnd = gameHeight * 0.7;

    for (let y = yStart; y < yEnd; y++) {
      // Create a building silhouette
      const buildingColor = y > yEnd - 3 ? colors.neonBlue : colors.uiDark;
      const alpha = 0.8 - ((yEnd - y) / buildingHeight) * 0.3;

      drawPixel(i, y, buildingColor, alpha);

      // Add windows to buildings
      if (
        Math.random() > 0.8 &&
        y > yStart + 2 &&
        y < yEnd - 3 &&
        i % 2 === 0
      ) {
        const windowAlpha = 0.5 + Math.sin(time * 2 + i + y) * 0.3;
        const windowColor =
          Math.random() > 0.7 ? colors.neonPink : colors.neonBlue;
        drawPixel(i, y, windowColor, windowAlpha);
      }
    }
  }
};

export const drawDigitalLandscape = (
  time: number,
  gameWidth: number,
  gameHeight: number,
  drawPixel: CanvasManager["drawPixel"]
) => {
  // Draw a cyberpunk terrain/grid horizon
  const horizonY = gameHeight * 0.7;
  const gridSize = 10;

  // Draw terrain and grid lines
  for (let x = 0; x < gameWidth; x++) {
    // Create an undulating horizon line
    const terrainHeight =
      Math.sin(x * 0.05 + time) * 5 + Math.sin(x * 0.02 - time * 0.5) * 3;
    const terrainY = horizonY + terrainHeight;

    // Draw grid lines extending from horizon to bottom
    if (x % gridSize === 0) {
      for (let y = terrainY; y < gameHeight; y++) {
        const distFromHorizon = (y - terrainY) / (gameHeight - terrainY);
        const alpha = 0.5 - distFromHorizon * 0.3;
        drawPixel(x, y, colors.neonPink, alpha);
      }
    }

    // Draw horizontal grid lines
    for (let y = terrainY; y < gameHeight; y += gridSize) {
      const distFromHorizon = (y - terrainY) / (gameHeight - terrainY);
      const alpha = 0.5 - distFromHorizon * 0.3;
      drawPixel(x, y, colors.neonBlue, alpha);
    }
  }
};
