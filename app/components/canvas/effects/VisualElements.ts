import { colors } from "../types";
import type { CanvasManager } from "../types";

// Helper function to interpolate between two colors
const interpolateColor = (
  color1: string,
  color2: string,
  factor: number
): string => {
  // Parse colors to RGB components
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  // Interpolate each component
  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  // Convert back to hex
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export const drawHolographicElements = (
  time: number,
  gameWidth: number,
  gameHeight: number,
  drawPixel: CanvasManager["drawPixel"]
) => {
  // Draw circular holographic interface elements with smooth edges
  for (let i = 0; i < 3; i++) {
    const centerX = gameWidth * (0.3 + i * 0.2);
    const centerY = gameHeight * 0.4;
    const radius = 10 + Math.sin(time * 0.5 + i) * 2;

    // Draw circle with anti-aliasing
    for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
      // Use smaller angle step for smoother circles
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      if (x >= 0 && x < gameWidth && y >= 0 && y < gameHeight) {
        const pulseEffect = (Math.sin(time * 2 + angle * 3) + 1) / 2;
        const alpha = 0.2 + pulseEffect * 0.3;

        // Draw main circle pixel
        drawPixel(x, y, colors.neonBlue, alpha);

        // Draw surrounding pixels with varying alpha for anti-aliasing
        const innerFactor = 0.9;
        const outerFactor = 1.1;

        // Inner edge softer pixels
        const innerX = centerX + Math.cos(angle) * (radius * innerFactor);
        const innerY = centerY + Math.sin(angle) * (radius * innerFactor);
        drawPixel(innerX, innerY, colors.neonBlue, alpha * 0.7);

        // Outer edge softer pixels
        const outerX = centerX + Math.cos(angle) * (radius * outerFactor);
        const outerY = centerY + Math.sin(angle) * (radius * outerFactor);
        drawPixel(outerX, outerY, colors.neonBlue, alpha * 0.5);
      }
    }

    // Draw inner details with smoother gradient
    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
      const innerRadius = radius * 0.7;
      const x = centerX + Math.cos(angle) * innerRadius;
      const y = centerY + Math.sin(angle) * innerRadius;

      if (x >= 0 && x < gameWidth && y >= 0 && y < gameHeight) {
        // Create a color gradient based on angle for more interesting effect
        const colorFactor = (Math.sin(angle * 3 + time) + 1) / 2;
        const innerColor = interpolateColor(
          colors.neonPink,
          colors.neonBlue,
          colorFactor
        );

        drawPixel(x, y, innerColor, 0.5);
      }
    }

    // Draw scanning lines with smooth gradient edges
    const scanY = centerY + Math.sin(time * 3) * radius * 0.8;

    for (let x = centerX - radius * 1.2; x < centerX + radius * 1.2; x += 0.5) {
      if (x >= 0 && x < gameWidth && scanY >= 0 && scanY < gameHeight) {
        // Calculate distance from center for line intensity
        const distFromCenter = Math.abs(x - centerX) / (radius * 1.2);
        const scanIntensity = 1 - Math.pow(distFromCenter, 2); // Quadratic falloff for smoother edges

        if (scanIntensity > 0.05) {
          // Create a scan color that shifts between white and blue
          const scanColorFactor = (Math.sin(time * 5 + x * 0.1) + 1) / 2;
          const scanColor = interpolateColor(
            colors.white,
            colors.neonBlue,
            scanColorFactor
          );

          // Apply vertical gradient for scan line thickness
          for (let yOffset = -0.7; yOffset <= 0.7; yOffset += 0.35) {
            const verticalFade = 1 - Math.abs(yOffset) / 0.7;
            const pixelAlpha = 0.7 * scanIntensity * verticalFade;

            if (pixelAlpha > 0.05) {
              drawPixel(x, scanY + yOffset, scanColor, pixelAlpha);
            }
          }
        }
      }
    }
  }
};

export const drawAugmentedUI = (
  time: number,
  gameWidth: number,
  gameHeight: number,
  drawPixel: CanvasManager["drawPixel"]
) => {
  // Draw corner brackets to simulate AR interface with smoother edges
  const cornerSize = 8;

  // Draw all corners with anti-aliased edges
  const drawCorner = (
    baseX: number,
    baseY: number,
    xDir: number,
    yDir: number
  ) => {
    // Draw main corner lines
    for (let i = 0; i < cornerSize; i++) {
      // Horizontal line with glow
      const xPos = baseX + i * xDir;
      // Apply pulsing effect to corners
      const pulseEffect = (Math.sin(time * 1.5 + i * 0.2) + 1) / 2;
      const cornerAlpha = 0.7 + pulseEffect * 0.3;

      // Create smoother line with anti-aliasing
      drawPixel(xPos, baseY, colors.neonBlue, cornerAlpha);
      drawPixel(xPos, baseY + 0.3 * yDir, colors.neonBlue, cornerAlpha * 0.5);
      drawPixel(xPos, baseY + 0.7 * yDir, colors.neonBlue, cornerAlpha * 0.2);

      // Vertical line with glow
      const yPos = baseY + i * yDir;
      drawPixel(baseX, yPos, colors.neonBlue, cornerAlpha);
      drawPixel(baseX + 0.3 * xDir, yPos, colors.neonBlue, cornerAlpha * 0.5);
      drawPixel(baseX + 0.7 * xDir, yPos, colors.neonBlue, cornerAlpha * 0.2);
    }
  };

  // Top-left corner
  drawCorner(0, 0, 1, 1);

  // Top-right corner
  drawCorner(gameWidth - 1, 0, -1, 1);

  // Bottom-left corner
  drawCorner(0, gameHeight - 1, 1, -1);

  // Bottom-right corner
  drawCorner(gameWidth - 1, gameHeight - 1, -1, -1);

  // Draw HUD elements - like a small radar with smoother edges
  const radarX = 20;
  const radarY = 20;
  const radarRadius = 10;

  // Draw radar circle with anti-aliasing
  for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
    // Draw multiple rings with varying alpha for smoother edge
    for (let radiusMult = 0.9; radiusMult <= 1.1; radiusMult += 0.05) {
      const x = radarX + Math.cos(angle) * radarRadius * radiusMult;
      const y = radarY + Math.sin(angle) * radarRadius * radiusMult;

      // Calculate alpha based on distance from exact radius
      const distFactor = Math.abs(radiusMult - 1);
      const alpha = 0.5 * (1 - distFactor * 5);

      if (alpha > 0.05) {
        drawPixel(x, y, colors.neonGreen, alpha);
      }
    }
  }

  // Draw sweeping radar line with smooth glow
  const scanAngle = time % (Math.PI * 2);

  // Draw main line
  for (let r = 0; r < radarRadius * 1.1; r += 0.5) {
    const x = radarX + Math.cos(scanAngle) * r;
    const y = radarY + Math.sin(scanAngle) * r;

    // Calculate intensity based on distance from center
    const intensityFactor = 1 - r / (radarRadius * 1.1);
    const alpha = 0.8 * intensityFactor;

    if (alpha > 0.05) {
      drawPixel(x, y, colors.neonGreen, alpha);

      // Add glow around the line
      for (let angleOffset = -0.15; angleOffset <= 0.15; angleOffset += 0.05) {
        if (angleOffset !== 0) {
          const glowX = radarX + Math.cos(scanAngle + angleOffset) * r;
          const glowY = radarY + Math.sin(scanAngle + angleOffset) * r;

          // Calculate glow intensity
          const glowFactor = 1 - Math.abs(angleOffset) / 0.15;
          const glowAlpha = 0.3 * intensityFactor * glowFactor;

          if (glowAlpha > 0.05) {
            drawPixel(glowX, glowY, colors.neonGreen, glowAlpha);
          }
        }
      }
    }
  }

  // Draw blips on radar with glow effect
  for (let i = 0; i < 5; i++) {
    const blipAngle = Math.random() * Math.PI * 2;
    const blipDist = Math.random() * radarRadius * 0.8;
    const x = radarX + Math.cos(blipAngle) * blipDist;
    const y = radarY + Math.sin(blipAngle) * blipDist;

    const pulse = (Math.sin(time * 3 + i) + 1) / 2;
    const baseAlpha = 0.3 + pulse * 0.5;

    // Draw main blip
    drawPixel(x, y, colors.brightYellow, baseAlpha);

    // Draw glow around blip
    for (let gx = -1; gx <= 1; gx += 0.5) {
      for (let gy = -1; gy <= 1; gy += 0.5) {
        if (gx === 0 && gy === 0) continue; // Skip center pixel

        const dist = Math.sqrt(gx * gx + gy * gy);
        const glowAlpha = baseAlpha * 0.7 * (1 - dist / 1.5);

        if (glowAlpha > 0.05) {
          drawPixel(x + gx, y + gy, colors.brightYellow, glowAlpha);
        }
      }
    }
  }
};

export const drawVRElements = (
  time: number,
  gameWidth: number,
  gameHeight: number,
  drawPixel: CanvasManager["drawPixel"]
) => {
  const centerX = gameWidth * 0.8;
  const centerY = gameHeight * 0.3;

  // Draw VR headset outline with smoother edges
  for (let y = -7.5; y <= 7.5; y += 0.5) {
    for (let x = -12.5; x <= 12.5; x += 0.5) {
      // Headset shape with smoother edges
      const dist = Math.sqrt((x / 1.7) ** 2 + y ** 2);

      if (dist > 5.8 && dist < 7.2) {
        // Outer edge with gradient for anti-aliasing
        const edgeFactor = Math.abs(dist - 6.5) / 0.7; // 0 at center of edge, 1 at outer/inner limits
        const edgeAlpha = 0.9 * (1 - edgeFactor);

        if (edgeAlpha > 0.05) {
          // Gradual color change around the headset
          const angleFactor = (Math.atan2(y, x) / Math.PI + 1) / 2; // 0 to 1 based on angle
          const edgeColor = interpolateColor(
            colors.uiLight,
            colors.uiAccent,
            angleFactor
          );

          drawPixel(centerX + x, centerY + y, edgeColor, edgeAlpha);
        }
      } else if (dist > 4.8 && dist < 6 && Math.abs(y) > 3) {
        // Eye holes with gradient edges
        const edgeFactor = Math.abs(dist - 5.4) / 0.6;
        const edgeAlpha = 0.9 * (1 - edgeFactor);

        if (edgeAlpha > 0.05) {
          drawPixel(centerX + x, centerY + y, colors.uiDark, edgeAlpha);
        }
      } else if (dist < 5 && Math.abs(y) > 3) {
        // Inside eye holes, show glowing display with smoother gradients
        const glowPulse = (Math.sin(time * 3 + x * 0.3 + y * 0.2) + 1) / 2;
        const eyeColor = x < 0 ? colors.neonPink : colors.neonBlue;

        // Create gradient from center of eye
        const eyeCenterX = x < 0 ? -4 : 4;
        const eyeCenterY = y > 0 ? 5 : -5;
        const eyeDist = Math.sqrt(
          (x - eyeCenterX) ** 2 + (y - eyeCenterY) ** 2
        );

        if (eyeDist < 3.5) {
          // Smooth gradient within eye
          const eyeFactor = eyeDist / 3.5;
          const eyeAlpha = (0.3 + glowPulse * 0.4) * (1 - eyeFactor);

          if (eyeAlpha > 0.05) {
            // Create a color gradient within each eye
            const innerColor = x < 0 ? colors.neonPink : colors.neonBlue;
            const outerColor = x < 0 ? colors.brightYellow : colors.neonGreen;
            const gradientColor = interpolateColor(
              innerColor,
              outerColor,
              eyeFactor
            );

            drawPixel(centerX + x, centerY + y, gradientColor, eyeAlpha);
          }
        }
      }
    }
  }

  // Draw floating VR cuboid elements around headset with smoother edges
  for (let i = 0; i < 5; i++) {
    const angle = time * 0.5 + i * Math.PI * 0.4;
    const distance = 15 + Math.sin(time + i) * 3;
    const cubeX = centerX + Math.cos(angle) * distance;
    const cubeY = centerY + Math.sin(angle) * distance;
    const cubeSize = 2 + Math.sin(time * 0.8 + i) * 0.5;

    // Draw cuboid with anti-aliased edges
    for (let y = -cubeSize - 0.5; y <= cubeSize + 0.5; y += 0.5) {
      for (let x = -cubeSize - 0.5; x <= cubeSize + 0.5; x += 0.5) {
        // Calculate distance to nearest edge
        const distX = Math.min(Math.abs(Math.abs(x) - cubeSize), 0.5);
        const distY = Math.min(Math.abs(Math.abs(y) - cubeSize), 0.5);
        const minDist = Math.min(distX, distY);

        if (minDist < 0.5) {
          // Cube edges with smooth gradient
          const edgeAlpha =
            (0.7 + Math.sin(time * 2 + i) * 0.3) * (1 - minDist * 2);

          if (edgeAlpha > 0.05) {
            // Create color variation across cube edges
            const colorFactor =
              (Math.sin(angle + time + x * 0.5 + y * 0.3) + 1) / 2;
            const edgeColor = interpolateColor(
              colors.neonBlue,
              colors.neonPink,
              colorFactor
            );

            drawPixel(cubeX + x, cubeY + y, edgeColor, edgeAlpha);
          }
        }
      }
    }

    // Add a glowing center to each cube
    const glowSize = cubeSize * 0.5;
    const glowIntensity = 0.5 + Math.sin(time * 3 + i) * 0.3;

    for (let y = -glowSize; y <= glowSize; y += 0.5) {
      for (let x = -glowSize; x <= glowSize; x += 0.5) {
        const dist = Math.sqrt(x * x + y * y) / glowSize;

        if (dist < 1) {
          const glowAlpha = glowIntensity * (1 - dist);

          if (glowAlpha > 0.05) {
            drawPixel(cubeX + x, cubeY + y, colors.white, glowAlpha);
          }
        }
      }
    }
  }
};
