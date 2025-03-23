import { colors } from "./types";
import type { CanvasManager, CanvasElement } from "./types";

export class DevIcon implements CanvasElement {
  x: number;
  y: number;
  type: string;
  size: number;
  speed: number;
  angle: number;
  rotation: number;
  wobbleOffset: number;
  colors: string[];
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
    this.x = Math.random() * gameWidth;
    this.y = Math.random() * (gameHeight * 0.8);
    this.type = this.randomType();
    this.size = 6 + Math.floor(Math.random() * 4);
    this.speed = 0.1 + Math.random() * 0.2;
    this.angle = Math.random() * Math.PI * 2;
    this.rotation = 0;
    this.wobbleOffset = Math.random() * Math.PI * 2;
    this.colors = this.getColors();
  }

  randomType(): string {
    const types = ["controller", "screen", "code", "sprite", "sound", "tool"];
    return types[Math.floor(Math.random() * types.length)];
  }

  getColors(): string[] {
    switch (this.type) {
      case "controller":
        return [colors.pixelBlue, colors.pixelPurple, colors.neonBlue];
      case "screen":
        return [colors.uiAccent, colors.uiDark, colors.white];
      case "code":
        return [colors.codeGreen, colors.consoleGreen, colors.white];
      case "sprite":
        return [colors.pixelGreen, colors.pixelYellow, colors.pixelRed];
      case "sound":
        return [colors.neonPink, colors.pixelPurple, colors.white];
      case "tool":
        return [colors.pixelOrange, colors.pixelYellow, colors.white];
      default:
        return [colors.white, colors.neonBlue, colors.neonPink];
    }
  }

  update(time: number) {
    // Move in a slightly wobbly path
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // Add some wobble to the movement
    this.angle += Math.sin(time + this.wobbleOffset) * 0.02;

    // Rotate the icon
    this.rotation += 0.01;

    // Wrap around screen edges
    if (this.x < -this.size) this.x = this.gameWidth + this.size;
    if (this.x > this.gameWidth + this.size) this.x = -this.size;
    if (this.y < -this.size) this.y = this.gameHeight + this.size;
    if (this.y > this.gameHeight + this.size) this.y = -this.size;
  }

  draw(time: number) {
    const centerX = Math.floor(this.x);
    const centerY = Math.floor(this.y);
    const halfSize = Math.floor(this.size / 2);
    const primaryColor = this.colors[0];
    const secondaryColor = this.colors[1];
    const accentColor = this.colors[2];

    // Draw different shapes based on icon type
    switch (this.type) {
      case "controller":
        this.drawController(
          centerX,
          centerY,
          halfSize,
          primaryColor,
          secondaryColor,
          accentColor
        );
        break;
      case "screen":
        this.drawScreen(
          centerX,
          centerY,
          halfSize,
          primaryColor,
          secondaryColor,
          accentColor,
          time
        );
        break;
      case "code":
        this.drawCode(centerX, centerY, halfSize, primaryColor, secondaryColor);
        break;
      case "sprite":
        this.drawSprite(
          centerX,
          centerY,
          halfSize,
          primaryColor,
          secondaryColor,
          accentColor
        );
        break;
      case "sound":
        this.drawSound(
          centerX,
          centerY,
          halfSize,
          primaryColor,
          secondaryColor,
          accentColor,
          time
        );
        break;
      case "tool":
        this.drawTool(
          centerX,
          centerY,
          halfSize,
          primaryColor,
          secondaryColor,
          accentColor
        );
        break;
    }

    this.drawGlow(centerX, centerY, halfSize, primaryColor, time);
  }

  private drawController(
    centerX: number,
    centerY: number,
    halfSize: number,
    primaryColor: string,
    secondaryColor: string,
    accentColor: string
  ) {
    // Draw game controller
    for (let y = -halfSize; y <= halfSize; y++) {
      for (let x = -halfSize; x <= halfSize; x++) {
        // Center section
        if (Math.abs(x) < halfSize - 1 && Math.abs(y) < halfSize - 1) {
          this.drawPixel(centerX + x, centerY + y, primaryColor, 0.9);
        }
        // Sides (grips)
        else if (
          Math.abs(y) < halfSize - 1 &&
          (x === -halfSize || x === halfSize)
        ) {
          this.drawPixel(centerX + x, centerY + y, secondaryColor, 0.9);
        }
        // Buttons
        else if (x > 0 && y < 0 && Math.abs(x) + Math.abs(y) < halfSize) {
          this.drawPixel(centerX + x, centerY + y, accentColor, 0.9);
        }
      }
    }
  }

  private drawScreen(
    centerX: number,
    centerY: number,
    halfSize: number,
    primaryColor: string,
    secondaryColor: string,
    accentColor: string,
    time: number
  ) {
    // Draw a little monitor/screen
    for (let y = -halfSize; y <= halfSize; y++) {
      for (let x = -halfSize; x <= halfSize; x++) {
        if (Math.abs(x) === halfSize || Math.abs(y) === halfSize) {
          // Border
          this.drawPixel(centerX + x, centerY + y, secondaryColor, 0.9);
        } else if (Math.abs(x) < halfSize - 1 && Math.abs(y) < halfSize - 1) {
          // Screen
          const screenPattern = (x + y + Math.floor(time * 5)) % 3 === 0;
          this.drawPixel(
            centerX + x,
            centerY + y,
            screenPattern ? primaryColor : accentColor,
            0.9
          );
        }
      }
    }
  }

  private drawCode(
    centerX: number,
    centerY: number,
    halfSize: number,
    primaryColor: string,
    secondaryColor: string
  ) {
    // Draw a code bracket {}
    for (let i = -halfSize; i <= halfSize; i++) {
      const xOffset = Math.abs(i) > halfSize - 2 ? 2 : 1;

      // Left bracket
      this.drawPixel(
        centerX - halfSize + xOffset,
        centerY + i,
        primaryColor,
        0.9
      );

      // Right bracket
      this.drawPixel(
        centerX + halfSize - xOffset,
        centerY + i,
        primaryColor,
        0.9
      );

      // Middle lines
      if (i % 2 === 0 && Math.abs(i) < halfSize - 1) {
        for (let j = -halfSize + 2; j <= halfSize - 2; j++) {
          this.drawPixel(centerX + j, centerY + i, secondaryColor, 0.8);
        }
      }
    }
  }

  private drawSprite(
    centerX: number,
    centerY: number,
    halfSize: number,
    primaryColor: string,
    secondaryColor: string,
    accentColor: string
  ) {
    // Draw a little character sprite
    for (let y = -halfSize; y <= halfSize; y++) {
      for (let x = -halfSize; x <= halfSize; x++) {
        // Create a simple character shape
        const head =
          y < 0 && Math.abs(x) < halfSize - 1 && Math.abs(y) < halfSize;
        const body = y >= 0 && y < halfSize - 1 && Math.abs(x) < halfSize - 2;
        const arms =
          y === 0 &&
          (Math.abs(x) === halfSize - 2 || Math.abs(x) === halfSize - 1);
        const legs = y >= halfSize - 1 && (x === -1 || x === 1 || x === 0);

        if (head) {
          this.drawPixel(centerX + x, centerY + y, primaryColor, 0.9);
        } else if (body) {
          this.drawPixel(centerX + x, centerY + y, secondaryColor, 0.9);
        } else if (arms || legs) {
          this.drawPixel(centerX + x, centerY + y, accentColor, 0.9);
        }
      }
    }
  }

  private drawSound(
    centerX: number,
    centerY: number,
    halfSize: number,
    primaryColor: string,
    secondaryColor: string,
    accentColor: string,
    time: number
  ) {
    // Draw sound wave icon
    for (let i = -halfSize; i <= halfSize; i++) {
      // Central speaker
      if (Math.abs(i) < halfSize - 2) {
        this.drawPixel(centerX - halfSize + 1, centerY + i, primaryColor, 0.9);
        this.drawPixel(centerX - halfSize + 2, centerY + i, primaryColor, 0.9);
      }

      // Sound waves
      const waveAmplitude = Math.sin(time * 3 + i * 0.5) * (halfSize - 2);
      const waveX = Math.floor(waveAmplitude);

      if (Math.abs(i) < halfSize - 1) {
        this.drawPixel(centerX + waveX / 2, centerY + i, secondaryColor, 0.9);
        this.drawPixel(centerX + waveX, centerY + i, accentColor, 0.8);
      }
    }
  }

  private drawTool(
    centerX: number,
    centerY: number,
    halfSize: number,
    primaryColor: string,
    secondaryColor: string,
    accentColor: string
  ) {
    // Draw a tool icon (wrench/brush)
    for (let y = -halfSize; y <= halfSize; y++) {
      for (let x = -halfSize; x <= halfSize; x++) {
        const distance = Math.sqrt(x * x + y * y);

        if (x + y === 0 || x + y === 1) {
          // Handle
          this.drawPixel(centerX + x, centerY + y, secondaryColor, 0.9);
        } else if ((x - y === 0 || x - y === 1) && distance < halfSize) {
          // Crosspiece
          this.drawPixel(centerX + x, centerY + y, primaryColor, 0.9);
        } else if (Math.abs(x) + Math.abs(y) === halfSize) {
          // Edge highlights
          this.drawPixel(centerX + x, centerY + y, accentColor, 0.8);
        }
      }
    }
  }

  private drawGlow(
    centerX: number,
    centerY: number,
    halfSize: number,
    primaryColor: string,
    time: number
  ) {
    // Add a subtle glow around the icon
    for (let y = -halfSize - 2; y <= halfSize + 2; y++) {
      for (let x = -halfSize - 2; x <= halfSize + 2; x++) {
        const distance = Math.sqrt(x * x + y * y);
        if (distance > halfSize && distance < halfSize + 2) {
          const pulse = (Math.sin(time * 2 + this.wobbleOffset) + 1) / 2;
          const alpha = (1 - (distance - halfSize) / 2) * 0.3 * pulse;
          this.drawPixel(centerX + x, centerY + y, primaryColor, alpha);
        }
      }
    }
  }
}
