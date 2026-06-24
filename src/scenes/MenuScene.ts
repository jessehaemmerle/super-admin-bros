import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { SaveSystem } from '../systems/SaveSystem';
import { AudioSystem } from '../utils/AudioSystem';

export class MenuScene extends Phaser.Scene {
  private titleText!: Phaser.GameObjects.Text;
  private blinkTimer = 0;
  private pressText!: Phaser.GameObjects.Text;
  private bgGraphic!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    SaveSystem.load();

    // Background
    this.bgGraphic = this.add.graphics();
    this.bgGraphic.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x0f3460, 1);
    this.bgGraphic.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Decorative office elements
    this.drawOfficeDecoration();

    // Title
    this.add.text(GAME_WIDTH / 2, 30, 'SUPER ADMIN', {
      fontSize: '20px',
      color: '#ffcc00',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 52, 'BROS.', {
      fontSize: '28px',
      color: '#ff6600',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(GAME_WIDTH / 2, 80, '- Ein KMU braucht seinen Helden -', {
      fontSize: '7px',
      color: '#aaaaaa',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    // Hank preview (using existing sprite)
    const hank = this.add.sprite(GAME_WIDTH / 2 - 60, 130, 'hank_big', 0);
    hank.setScale(2);
    this.anims.create({
      key: 'menu_idle_big',
      frames: this.anims.generateFrameNumbers('hank_big', { start: 0, end: 0 }),
      frameRate: 1,
      repeat: -1
    });
    hank.play('menu_idle_big');

    // Story text
    const storyLines = [
      'Hank, 14:00 Uhr...',
      'Das Legacy-System bricht zusammen.',
      'Tickets stapeln sich.',
      'Schaffst du den Feierabend?'
    ];
    storyLines.forEach((line, i) => {
      this.add.text(GAME_WIDTH / 2 + 10, 110 + i * 12, line, {
        fontSize: '7px',
        color: '#cccccc',
        fontFamily: 'monospace'
      }).setOrigin(0, 0.5);
    });

    // Controls
    this.add.text(GAME_WIDTH / 2, 175, '── STEUERUNG ──', {
      fontSize: '7px',
      color: '#44aaff',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    const controls = [
      ['Bewegen:', '← → / A D'],
      ['Springen:', 'LEERTASTE / W / ↑'],
      ['Sprint:', 'SHIFT'],
      ['Sudo-Feuer:', 'STRG / X'],
      ['VPN:', '↓ auf VPN-Tile']
    ];
    controls.forEach(([label, key], i) => {
      this.add.text(GAME_WIDTH / 2 - 60, 186 + i * 10, label, {
        fontSize: '6px',
        color: '#aaaaaa',
        fontFamily: 'monospace'
      }).setOrigin(0);
      this.add.text(GAME_WIDTH / 2 + 20, 186 + i * 10, key, {
        fontSize: '6px',
        color: '#ffcc44',
        fontFamily: 'monospace'
      }).setOrigin(0);
    });

    // High score
    const hs = SaveSystem.getHighScore();
    if (hs > 0) {
      this.add.text(GAME_WIDTH / 2, 242, `BEST: ${hs}`, {
        fontSize: '8px',
        color: '#ffcc00',
        fontFamily: 'monospace'
      }).setOrigin(0.5);
    }

    // Press to start (blinking)
    this.pressText = this.add.text(GAME_WIDTH / 2, 255, '[ ENTER / LEERTASTE zum Starten ]', {
      fontSize: '7px',
      color: '#ffffff',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Input
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-ENTER', () => this.startGame());
      this.input.keyboard.on('keydown-SPACE', () => this.startGame());
      this.input.keyboard.on('keydown-UP', () => this.startGame());
    }

    // Also click/touch
    this.input.on('pointerdown', () => this.startGame());
  }

  private drawOfficeDecoration(): void {
    const g = this.add.graphics();

    // Floor
    g.fillStyle(0x223322);
    g.fillRect(0, GAME_HEIGHT - 20, GAME_WIDTH, 20);

    // Desk
    g.fillStyle(0x5a4010);
    g.fillRect(20, GAME_HEIGHT - 35, 100, 15);

    // Monitor
    g.fillStyle(0x333333);
    g.fillRect(30, GAME_HEIGHT - 65, 50, 32);
    g.fillStyle(0x111111);
    g.fillRect(32, GAME_HEIGHT - 63, 46, 28);
    g.fillStyle(0x00ff44, 0.8);
    // Terminal text on monitor
    for (let i = 0; i < 4; i++) {
      g.fillRect(35, GAME_HEIGHT - 60 + i * 6, Phaser.Math.Between(10, 35), 3);
    }
    // Monitor stand
    g.fillStyle(0x555555);
    g.fillRect(50, GAME_HEIGHT - 35, 12, 4);

    // Coffee cup on desk
    g.fillStyle(0xdddddd);
    g.fillRect(90, GAME_HEIGHT - 40, 10, 8);
    g.fillStyle(0x663300);
    g.fillRect(91, GAME_HEIGHT - 39, 8, 6);

    // Stacked tickets (in corner)
    for (let i = 0; i < 5; i++) {
      g.fillStyle(0x22aa44);
      g.fillRect(GAME_WIDTH - 60, GAME_HEIGHT - 30 - i * 4, 40, 4);
      g.fillStyle(0x119933);
      g.fillRect(GAME_WIDTH - 60, GAME_HEIGHT - 30 - i * 4, 40, 1);
    }

    // Window
    g.fillStyle(0x88aacc);
    g.fillRect(GAME_WIDTH - 100, 10, 60, 50);
    g.fillStyle(0xaaccee);
    g.fillRect(GAME_WIDTH - 98, 12, 26, 22);
    g.fillRect(GAME_WIDTH - 70, 12, 26, 22);
    g.fillRect(GAME_WIDTH - 98, 36, 26, 22);
    g.fillRect(GAME_WIDTH - 70, 36, 26, 22);
  }

  private startGame(): void {
    AudioSystem.getInstance().startMusic();
    this.scene.stop('HudScene');
    this.scene.start('GameScene');
  }

  update(_time: number, delta: number): void {
    // Blink the press text
    this.blinkTimer += delta;
    if (this.blinkTimer > 600) {
      this.blinkTimer = 0;
      this.pressText.setVisible(!this.pressText.visible);
    }
  }
}
