import { useEffect, useRef } from "react";
import { DevIcon } from "./DevIcon";
import { CodeBlock } from "./CodeBlock";
import { MatrixRain } from "./MatrixRain";
import {
  drawBackground,
  drawCircuits,
  drawCyberpunkSkyline,
  drawDigitalLandscape,
} from "./effects/Background";
import {
  drawHolographicElements,
  drawAugmentedUI,
  drawVRElements,
} from "./effects/VisualElements";
import type { GameSettings, CanvasManager as CanvasManagerType } from "./types";

interface CanvasManagerProps {
  className?: string;
}

const CanvasManager = ({ className = "pixel-canvas" }: CanvasManagerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Pixel art settings
    const settings: GameSettings = {
      pixelSize: 4,
      gameWidth: 240,
      gameHeight: 180,
    };

    // Set canvas to be pixel perfect
    const resizeCanvas = () => {
      const windowRatio = window.innerWidth / window.innerHeight;
      const gameRatio = settings.gameWidth / settings.gameHeight;

      let canvasWidth, canvasHeight;

      // Always fill the entire screen, use the larger dimension ratio
      if (windowRatio > gameRatio) {
        // Window is wider than game ratio - match width and overflow height
        canvasWidth = window.innerWidth;
        canvasHeight = canvasWidth / gameRatio;
      } else {
        // Window is taller than game ratio - match height and overflow width
        canvasHeight = window.innerHeight;
        canvasWidth = canvasHeight * gameRatio;
      }

      // Make sure we're completely covering the screen in both dimensions
      canvasWidth = Math.max(canvasWidth, window.innerWidth);
      canvasHeight = Math.max(canvasHeight, window.innerHeight);

      // Position the canvas to center the content
      const left = (window.innerWidth - canvasWidth) / 2;
      const top = (window.innerHeight - canvasHeight) / 2;

      // Set display size (css pixels)
      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";
      canvas.style.left = left + "px";
      canvas.style.top = top + "px";

      // Set actual size in memory (scaled to account for extra pixel density)
      canvas.width = settings.gameWidth * settings.pixelSize;
      canvas.height = settings.gameHeight * settings.pixelSize;

      // Disable image smoothing for crisp pixels
      ctx.imageSmoothingEnabled = false;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Draw a filled pixel with improved smoothing
    const drawPixel = (x: number, y: number, color: string, alpha = 1) => {
      if (alpha < 1) {
        ctx.globalAlpha = alpha;
      }

      // Use anti-aliasing for smoother appearance
      const pixelX = Math.floor(x) * settings.pixelSize;
      const pixelY = Math.floor(y) * settings.pixelSize;

      ctx.fillStyle = color;
      ctx.fillRect(pixelX, pixelY, settings.pixelSize, settings.pixelSize);

      ctx.globalAlpha = 1;
    };

    // Create game dev icons
    const devIcons: DevIcon[] = [];
    for (let i = 0; i < 15; i++) {
      devIcons.push(
        new DevIcon(settings.gameWidth, settings.gameHeight, drawPixel)
      );
    }

    // Create code blocks
    const codeBlocks: CodeBlock[] = [];
    for (let i = 0; i < 5; i++) {
      codeBlocks.push(
        new CodeBlock(settings.gameWidth, settings.gameHeight, drawPixel)
      );
    }

    // Create matrix rain
    const matrixRain = new MatrixRain(
      settings.gameWidth,
      settings.gameHeight,
      drawPixel
    );

    // Create offscreen buffer for background to smooth transitions
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offscreenCtx = offscreenCanvas.getContext("2d");

    if (!offscreenCtx) return;

    // Previous time for calculating delta
    let prevTime = 0;

    // Game loop
    const animate = (timestamp: number) => {
      // Convert timestamp to seconds and calculate delta
      const timeInSeconds = timestamp / 1000;
      const delta = prevTime === 0 ? 0.016 : timeInSeconds - prevTime;
      prevTime = timeInSeconds;

      // Use smoother time progression with reduced speed
      const time = timeInSeconds * 0.3; // Reduced from 0.5 to 0.25 for slower animation

      // Clear the canvas with a slight motion blur for smoother transitions
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      // Draw the tech-themed background
      drawBackground(time, settings.gameWidth, settings.gameHeight, drawPixel);

      // Draw code blocks in the background
      codeBlocks.forEach((block) => {
        block.update(time);
        block.draw(time);
      });

      // // Draw holographic and VR elements
      // drawHolographicElements(
      //   time,
      //   settings.gameWidth,
      //   settings.gameHeight,
      //   drawPixel
      // );
      // drawVRElements(time, settings.gameWidth, settings.gameHeight, drawPixel);

      // Draw matrix rain
      matrixRain.update(time);
      matrixRain.draw(time);

      // // Draw tech circuits
      // drawCircuits(time, settings.gameWidth, settings.gameHeight, drawPixel);

      // // Draw AR UI elements on top
      // drawAugmentedUI(time, settings.gameWidth, settings.gameHeight, drawPixel);

      // Update and draw dev icons
      devIcons.forEach((icon) => {
        icon.update(time);
        icon.draw(time);
      });

      requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label="stylish starry background"
    />
  );
};

export default CanvasManager;
