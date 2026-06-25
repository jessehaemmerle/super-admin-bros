import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { SaveSystem } from '../systems/SaveSystem';
import { UpgradeSystem } from '../systems/UpgradeSystem';

export class MenuScene extends Phaser.Scene {
  private blinkTimer = 0;
  private pressText!: Phaser.GameObjects.Text;
  private selectedPlayers = 1;
  private p1Btn!: Phaser.GameObjects.Text;
  private p2Btn!: Phaser.GameObjects.Text;
  private keys!: { left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key; enter: Phaser.Input.Keyboard.Key; space: Phaser.Input.Keyboard.Key };

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    SaveSystem.load();
    UpgradeSystem.reset();

    // Background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x0f3460, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.drawOfficeDecoration();

    // Title
    this.add.text(GAME_WIDTH / 2, 28, 'SUPER ADMIN', {
      fontSize: '20px', color: '#ffcc00', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 50, 'BROS.', {
      fontSize: '28px', color: '#ff6600', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 78, '- Ein KMU braucht seinen Helden -', {
      fontSize: '7px', color: '#aaaaaa', fontFamily: 'monospace'
    }).setOrigin(0.5);

    // Hank preview
    const hank = this.add.sprite(GAME_WIDTH / 2 - 60, 128, 'hank_big', 0);
    hank.setScale(2);

    // Story text
    const storyLines = [
      'Hank, 14:00 Uhr...',
      'Das Legacy-System bricht zusammen.',
      'Tickets stapeln sich.',
      'Schaffst du den Feierabend?'
    ];
    storyLines.forEach((line, i) => {
      this.add.text(GAME_WIDTH / 2 + 10, 108 + i * 11, line, {
        fontSize: '7px', color: '#cccccc', fontFamily: 'monospace'
      }).setOrigin(0, 0.5);
    });

    // ── Spieler-Auswahl ──────────────────────────────
    this.add.text(GAME_WIDTH / 2, 165, '── SPIELER ──', {
      fontSize: '7px', color: '#44aaff', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.p1Btn = this.add.text(GAME_WIDTH / 2 - 36, 177, '[ 1 SPIELER ]', {
      fontSize: '7px', color: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.p2Btn = this.add.text(GAME_WIDTH / 2 + 48, 177, '[ 2 SPIELER ]', {
      fontSize: '7px', color: '#666666', fontFamily: 'monospace'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.p1Btn.on('pointerdown', () => this.setPlayers(1));
    this.p2Btn.on('pointerdown', () => this.setPlayers(2));

    // ── Steuerung ─────────────────────────────────────
    this.add.text(GAME_WIDTH / 2, 190, '── STEUERUNG ──', {
      fontSize: '7px', color: '#44aaff', fontFamily: 'monospace'
    }).setOrigin(0.5);

    const controls = [
      ['P1 Bewegen:',  '← → / A D'],
      ['P1 Springen:', 'LEERTASTE / W / ↑'],
      ['P1 Sudo-Feuer:','STRG / X'],
      ['P2 Bewegen:',  'I J K L'],
      ['P2 Feuer:',    'Z'],
    ];
    controls.forEach(([label, key], i) => {
      this.add.text(GAME_WIDTH / 2 - 65, 200 + i * 9, label, {
        fontSize: '5px', color: '#aaaaaa', fontFamily: 'monospace'
      }).setOrigin(0);
      this.add.text(GAME_WIDTH / 2 + 20, 200 + i * 9, key, {
        fontSize: '5px', color: '#ffcc44', fontFamily: 'monospace'
      }).setOrigin(0);
    });

    // ── Highscores ────────────────────────────────────
    const scores = SaveSystem.getTopScores();
    if (scores.length > 0) {
      this.add.text(GAME_WIDTH / 2, 248, '── TOP 5 ──', {
        fontSize: '6px', color: '#ffcc00', fontFamily: 'monospace'
      }).setOrigin(0.5);
      scores.slice(0, 3).forEach((e, i) => {
        this.add.text(GAME_WIDTH / 2, 257 + i * 8, `${i + 1}. ${e.initials.padEnd(3, ' ')}  ${e.score}`, {
          fontSize: '6px', color: i === 0 ? '#ffcc00' : '#aaaaaa', fontFamily: 'monospace'
        }).setOrigin(0.5);
      });
    }

    // Start-Text (blinkt)
    this.pressText = this.add.text(GAME_WIDTH / 2, 258 + (scores.length > 0 ? 32 : 0), '[ ENTER / LEERTASTE zum Starten ]', {
      fontSize: '7px', color: '#ffffff', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    // Keyboard input
    if (this.input.keyboard) {
      this.keys = {
        left:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
        enter: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
        space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      };
      this.input.keyboard.on('keydown-ENTER', () => this.startGame());
      this.input.keyboard.on('keydown-SPACE', () => this.startGame());
      this.input.keyboard.on('keydown-LEFT',  () => this.setPlayers(1));
      this.input.keyboard.on('keydown-RIGHT', () => this.setPlayers(2));
      this.input.keyboard.on('keydown-ONE',   () => this.setPlayers(1));
      this.input.keyboard.on('keydown-TWO',   () => this.setPlayers(2));
    }

    this.input.on('pointerdown', () => this.startGame());
    this.setPlayers(1);
  }

  private setPlayers(n: 1 | 2): void {
    this.selectedPlayers = n;
    this.p1Btn.setColor(n === 1 ? '#ffff44' : '#666666');
    this.p2Btn.setColor(n === 2 ? '#ffff44' : '#666666');
    this.p1Btn.setStroke(n === 1 ? '#aa8800' : '', 2);
    this.p2Btn.setStroke(n === 2 ? '#aa8800' : '', 2);
  }

  private drawOfficeDecoration(): void {
    const g = this.add.graphics();
    g.fillStyle(0x223322);
    g.fillRect(0, GAME_HEIGHT - 20, GAME_WIDTH, 20);
    g.fillStyle(0x5a4010);
    g.fillRect(20, GAME_HEIGHT - 35, 100, 15);
    g.fillStyle(0x333333);
    g.fillRect(30, GAME_HEIGHT - 65, 50, 32);
    g.fillStyle(0x111111);
    g.fillRect(32, GAME_HEIGHT - 63, 46, 28);
    g.fillStyle(0x00ff44, 0.8);
    for (let i = 0; i < 4; i++) {
      g.fillRect(35, GAME_HEIGHT - 60 + i * 6, Phaser.Math.Between(10, 35), 3);
    }
    g.fillStyle(0x555555);
    g.fillRect(50, GAME_HEIGHT - 35, 12, 4);
    g.fillStyle(0xdddddd);
    g.fillRect(90, GAME_HEIGHT - 40, 10, 8);
    g.fillStyle(0x663300);
    g.fillRect(91, GAME_HEIGHT - 39, 8, 6);
    for (let i = 0; i < 5; i++) {
      g.fillStyle(0x22aa44);
      g.fillRect(GAME_WIDTH - 60, GAME_HEIGHT - 30 - i * 4, 40, 4);
      g.fillStyle(0x119933);
      g.fillRect(GAME_WIDTH - 60, GAME_HEIGHT - 30 - i * 4, 40, 1);
    }
    g.fillStyle(0x88aacc);
    g.fillRect(GAME_WIDTH - 100, 10, 60, 50);
    g.fillStyle(0xaaccee);
    g.fillRect(GAME_WIDTH - 98, 12, 26, 22);
    g.fillRect(GAME_WIDTH - 70, 12, 26, 22);
    g.fillRect(GAME_WIDTH - 98, 36, 26, 22);
    g.fillRect(GAME_WIDTH - 70, 36, 26, 22);
  }

  private startGame(): void {
    this.scene.stop('HudScene');
    this.scene.start('LevelTransitionScene', {
      levelIndex: 1,
      numPlayers: this.selectedPlayers
    });
  }

  update(_time: number, delta: number): void {
    this.blinkTimer += delta;
    if (this.blinkTimer > 600) {
      this.blinkTimer = 0;
      this.pressText.setVisible(!this.pressText.visible);
    }
  }
}
