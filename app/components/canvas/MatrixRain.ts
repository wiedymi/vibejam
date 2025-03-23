import { colors } from "./types";
import type { CanvasManager, CanvasElement } from "./types";

export class MatrixRain implements CanvasElement {
  droplets: {
    x: number;
    y: number;
    speed: number;
    length: number;
    chars: string[];
  }[];

  gameWidth: number;
  gameHeight: number;
  drawPixel: CanvasManager["drawPixel"];

  constructor(
    gameWidth: number,
    gameHeight: number,
    drawPixel: CanvasManager["drawPixel"]
  ) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.drawPixel = drawPixel;
    this.droplets = [];

    // Create initial droplets
    for (let i = 0; i < 50; i++) {
      this.createDroplet();
    }
  }

  createDroplet() {
    const x = Math.floor(Math.random() * this.gameWidth);
    const y = -Math.floor(Math.random() * 20);
    const speed = 0.2 + Math.random() * 0.5;
    const length = 5 + Math.floor(Math.random() * 15);
    const chars = [];

    // Generate random characters
    for (let i = 0; i < length; i++) {
      const charSet =
        "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
      chars.push(charSet[Math.floor(Math.random() * charSet.length)]);
    }

    this.droplets.push({ x, y, speed, length, chars });
  }

  update(time: number) {
    // Update existing droplets
    for (let i = this.droplets.length - 1; i >= 0; i--) {
      const droplet = this.droplets[i];
      droplet.y += droplet.speed;

      // Randomize characters occasionally
      if (Math.random() > 0.95) {
        const idx = Math.floor(Math.random() * droplet.chars.length);
        const charSet =
          "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
        droplet.chars[idx] =
          charSet[Math.floor(Math.random() * charSet.length)];
      }

      // Remove droplets that are offscreen
      if (droplet.y - droplet.length > this.gameHeight) {
        this.droplets.splice(i, 1);

        // Create a new droplet to replace it
        if (Math.random() > 0.2) {
          this.createDroplet();
        }
      }
    }

    // Occasionally add new droplets
    if (this.droplets.length < 100 && Math.random() > 0.95) {
      this.createDroplet();
    }
  }

  draw(time: number) {
    for (const droplet of this.droplets) {
      for (let i = 0; i < droplet.length; i++) {
        const y = Math.floor(droplet.y - i);

        if (y < 0 || y >= this.gameHeight) continue;

        // Fade out with distance from head
        const fadeFactor = 1 - i / droplet.length;
        const glow = i === 0 ? 1 : fadeFactor * 0.7;

        // Head of the droplet is brighter
        if (i === 0) {
          this.drawPixel(droplet.x, y, colors.white, 0.8);
        } else {
          this.drawPixel(droplet.x, y, colors.codeGreen, fadeFactor * 0.5);
        }
      }
    }
  }
}
