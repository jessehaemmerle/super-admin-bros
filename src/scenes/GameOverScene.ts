import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { AudioSystem } from '../utils/AudioSystem';

interface GameOverData {
  success: boolean;
  score: number;
  highScore: number;
}

export class GameOverScene extends Phaser.Scene {
  private blinkTimer = 0;
  private pressText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: GameOverData): void {
    this.blinkTimer = 0;
    const { success, score, highScore } = data;

    // Background
    const bgColor = success ? 0x001a00 : 0x1a0000;
    const bg = this.add.graphics();
    bg.fillStyle(bgColor, 0.95);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    if (success) {
      this.createSuccessScreen(score, highScore);
    } else {
      this.createFailScreen(score, highScore);
    }
  }

  private createSuccessScreen(score: number, highScore: number): void {
    // Success celebration
    this.add.text(GAME_WIDTH / 2, 40, '🎉 FEIERABEND! 🎉', {
      fontSize: '18px',
      color: '#ffcc00',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 65, 'Das Legacy-System ist gerettet!', {
      fontSize: '8px',
      color: '#aaffaa',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    // Score display
    const isNew = score >= highScore;
    this.add.text(GAME_WIDTH / 2, 90, `SCORE: ${score}`, {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    if (isNew) {
      const newHighText = this.add.text(GAME_WIDTH / 2, 108, '★ NEUER HIGHSCORE! ★', {
        fontSize: '9px',
        color: '#ffcc00',
        fontFamily: 'monospace',
        stroke: '#cc6600',
        strokeThickness: 2
      }).setOrigin(0.5);
      this.tweens.add({
        targets: newHighText,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 400,
        yoyo: true,
        repeat: -1
      });
    }

    this.add.text(GAME_WIDTH / 2, 125, `BESTER: ${highScore}`, {
      fontSize: '8px',
      color: '#aaaaaa',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    // Fun stats
    this.add.text(GAME_WIDTH / 2, 150, '── TAGESPROTOKOLL ──', {
      fontSize: '7px',
      color: '#44aaff',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    const stats = [
      'Tickets gestompt: viele',
      'Drucker überlebt: ja',
      'Phishing-Mails: abgewehrt',
      'Kaffee getrunken: genug',
      'Überstunden: 0 (!)'
    ];
    stats.forEach((stat, i) => {
      this.add.text(GAME_WIDTH / 2, 162 + i * 10, stat, {
        fontSize: '6px',
        color: '#88cc88',
        fontFamily: 'monospace'
      }).setOrigin(0.5);
    });

    this.addRestartPrompt(220);
  }

  private createFailScreen(score: number, highScore: number): void {
    // Play alarm
    this.time.delayedCall(100, () => {
      AudioSystem.getInstance().play17Alarm();
    });

    this.add.text(GAME_WIDTH / 2, 30, '🚨 17:00 UHR! 🚨', {
      fontSize: '16px',
      color: '#ff2222',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    const titleFlash = this.add.text(GAME_WIDTH / 2, 50, 'BEREITSCHAFTSDIENST!', {
      fontSize: '10px',
      color: '#ff6644',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.tweens.add({
      targets: titleFlash,
      alpha: 0.2,
      duration: 300,
      yoyo: true,
      repeat: -1
    });

    this.add.text(GAME_WIDTH / 2, 70, 'Das Legacy-System ist abgestürzt.', {
      fontSize: '7px',
      color: '#ff8888',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 82, 'Hank arbeitet bis Mitternacht...', {
      fontSize: '7px',
      color: '#cc6666',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    // BSOD effect
    const bsod = this.add.graphics();
    bsod.fillStyle(0x0000aa);
    bsod.fillRect(40, 100, GAME_WIDTH - 80, 90);
    bsod.fillStyle(0xffffff);
    bsod.fillRect(42, 102, GAME_WIDTH - 84, 86);
    bsod.fillStyle(0x0000aa);
    bsod.fillRect(44, 104, GAME_WIDTH - 88, 82);

    this.add.text(56, 112, ':( Ein Fehler ist aufgetreten.', {
      fontSize: '7px',
      color: '#ffffff',
      fontFamily: 'monospace'
    });
    this.add.text(56, 124, 'LEGACY_SYSTEM_COLLAPSE', {
      fontSize: '8px',
      color: '#ffffff',
      fontFamily: 'monospace'
    });
    this.add.text(56, 136, `Fehlercode: 0x000${score}`, {
      fontSize: '6px',
      color: '#cccccc',
      fontFamily: 'monospace'
    });
    this.add.text(56, 148, `Highscore: ${highScore}`, {
      fontSize: '6px',
      color: '#cccccc',
      fontFamily: 'monospace'
    });
    this.add.text(56, 162, 'Neustart empfohlen.', {
      fontSize: '6px',
      color: '#aaaaaa',
      fontFamily: 'monospace'
    });
    this.add.text(56, 174, '100% abgeschlossen', {
      fontSize: '6px',
      color: '#cccccc',
      fontFamily: 'monospace'
    });

    this.addRestartPrompt(205);
  }

  private addRestartPrompt(y: number): void {
    this.pressText = this.add.text(GAME_WIDTH / 2, y, '[ ENTER / LEERTASTE = Nochmal ]', {
      fontSize: '7px',
      color: '#ffffff',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, y + 12, '[ ESC = Hauptmenü ]', {
      fontSize: '7px',
      color: '#aaaaaa',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Input
    if (this.input.keyboard) {
      this.input.keyboard.once('keydown-ENTER', () => this.restart());
      this.input.keyboard.once('keydown-SPACE', () => this.restart());
      this.input.keyboard.once('keydown-ESC', () => this.goToMenu());
    }
    this.input.once('pointerdown', () => this.restart());
  }

  private restart(): void {
    AudioSystem.getInstance().stopMusic();
    this.scene.stop('HudScene');
    this.scene.start('GameScene');
  }

  private goToMenu(): void {
    AudioSystem.getInstance().stopMusic();
    this.scene.stop('HudScene');
    this.scene.start('MenuScene');
  }

  update(_time: number, delta: number): void {
    if (!this.pressText) return;
    this.blinkTimer += delta;
    if (this.blinkTimer > 500) {
      this.blinkTimer = 0;
      this.pressText.setVisible(!this.pressText.visible);
    }
  }
}
