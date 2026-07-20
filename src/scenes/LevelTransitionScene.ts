import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { AudioSystem } from '../utils/AudioSystem';

interface TransitionData {
  levelIndex: number;
  numPlayers: number;
  score?: number;
}

const LEVEL_NAMES = ['', 'LEVEL 1 — BÜRO', 'LEVEL 2 — SERVERRAUM', 'LEVEL 3 — RECHENZENTRUM'];
const LEVEL_SUBTITLES = ['', 'Die Tickets häufen sich...', 'Die Server brennen!', 'Der CEO wartet.'];

export class LevelTransitionScene extends Phaser.Scene {
  private transitionData!: TransitionData;

  constructor() {
    super({ key: 'LevelTransitionScene' });
  }

  init(d: TransitionData): void {
    this.transitionData = d;
    this._started = false;
  }

  create(): void {
    AudioSystem.getInstance().playLevelTransition();

    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Green scanline effect
    for (let y = 0; y < GAME_HEIGHT; y += 4) {
      bg.fillStyle(0x00ff00, 0.04);
      bg.fillRect(0, y, GAME_WIDTH, 2);
    }

    const lvlName = LEVEL_NAMES[this.transitionData.levelIndex] ?? `LEVEL ${this.transitionData.levelIndex}`;
    const subtitle = LEVEL_SUBTITLES[this.transitionData.levelIndex] ?? '';

    const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, lvlName, {
      fontSize: '18px',
      color: '#00ff44',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setAlpha(0);

    const sub = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, subtitle, {
      fontSize: '8px',
      color: '#aaaaaa',
      fontFamily: 'monospace'
    }).setOrigin(0.5).setAlpha(0);

    const ticketText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, '▶ BEREIT?', {
      fontSize: '7px',
      color: '#ffcc00',
      fontFamily: 'monospace'
    }).setOrigin(0.5).setAlpha(0);

    // Animate in
    this.tweens.add({ targets: title, alpha: 1, duration: 400, ease: 'Quad.easeIn' });
    this.tweens.add({ targets: sub, alpha: 1, duration: 400, delay: 300, ease: 'Quad.easeIn' });
    this.tweens.add({ targets: ticketText, alpha: 1, duration: 300, delay: 700 });

    // Blink ready text
    this.time.delayedCall(700, () => {
      this.tweens.add({
        targets: ticketText,
        alpha: 0.2,
        duration: 350,
        yoyo: true,
        repeat: -1
      });
    });

    if (this.transitionData.levelIndex > 1) {
      this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, `Ticket geschlossen ✓`, {
        fontSize: '6px',
        color: '#22cc44',
        fontFamily: 'monospace'
      }).setOrigin(0.5);
    }

    // Auto-advance after 2.5 s
    this.time.delayedCall(2500, () => this.startLevel());

    // Or press any key
    this.input.keyboard?.once('keydown', () => this.startLevel());
    this.input.once('pointerdown', () => this.startLevel());
  }

  private _started = false;

  private startLevel(): void {
    if (this._started) return;
    this._started = true;
    this.cameras.main.fade(300, 0, 0, 0);
    this.time.delayedCall(300, () => {
      this.scene.stop('HudScene');
      this.scene.start('GameScene', {
        levelIndex: this.transitionData.levelIndex,
        numPlayers: this.transitionData.numPlayers,
        score: this.transitionData.score ?? 0
      });
    });
  }
}
