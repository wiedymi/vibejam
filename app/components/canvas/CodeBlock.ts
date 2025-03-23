import { colors } from "./types";
import type { CanvasManager, CanvasElement } from "./types";

export class CodeBlock implements CanvasElement {
  x: number;
  y: number;
  width: number;
  height: number;
  scrollSpeed: number;
  content: string[];
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
    this.width = 20 + Math.floor(Math.random() * 40);
    this.height = 10 + Math.floor(Math.random() * 15);
    this.x = Math.random() * (gameWidth - this.width);
    this.y = Math.random() * (gameHeight - this.height);
    this.scrollSpeed = 0.2 + Math.random() * 0.3;
    this.content = this.generateCode();
  }

  generateCode(): string[] {
    const lines = [];
    const codeElements = [
      "function",
      "class",
      "const",
      "let",
      "var",
      "if",
      "else",
      "for",
      "while",
      "return",
      "{",
      "}",
      "()",
      "[]",
      ";",
      "=",
      "==",
      "===",
      "true",
      "false",
      "null",
      "undefined",
    ];

    for (let i = 0; i < this.height; i++) {
      let line = "";
      const indent = Math.floor(Math.random() * 3) * 2;

      for (let j = 0; j < indent; j++) {
        line += " ";
      }

      const elementCount = 1 + Math.floor(Math.random() * 4);
      for (let k = 0; k < elementCount; k++) {
        line += codeElements[Math.floor(Math.random() * codeElements.length)];
        line += " ";
        if (line.length > this.width - 2) break;
      }

      lines.push(line);
    }

    return lines;
  }

  update(time: number) {
    // Scroll code
    this.y += this.scrollSpeed;

    // Wrap when off screen
    if (this.y > this.gameHeight) {
      this.y = -this.height;
      this.x = Math.random() * (this.gameWidth - this.width);
      this.content = this.generateCode();
    }
  }

  draw(time: number) {
    // Draw code block with fading edges
    for (let y = 0; y < this.height; y++) {
      if (this.y + y < 0 || this.y + y >= this.gameHeight) continue;

      const line = this.content[y];
      for (let x = 0; x < line.length; x++) {
        if (this.x + x < 0 || this.x + x >= this.gameWidth) continue;

        const char = line[x];
        if (char === " ") continue;

        // Distance from edges for fading
        const edgeDistX = Math.min(x, line.length - x);
        const edgeDistY = Math.min(y, this.height - y);
        const edgeFade = Math.min(edgeDistX, edgeDistY) / 3;
        const alpha = Math.min(0.3, edgeFade * 0.1);

        this.drawPixel(this.x + x, this.y + y, colors.codeGreen, alpha);
      }
    }
  }
}
