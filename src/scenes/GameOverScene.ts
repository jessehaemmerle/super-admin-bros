import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { AudioSystem } from '../utils/AudioSystem';
import { SaveSystem } from '../systems/SaveSystem';

interface GameOverData {
  success: boolean;
  score: number;
  highScore: number;
}

export class GameOverScene extends Phaser.Scene {
  private blinkTimer = 0;
  private pressText!: Phaser.GameObjects.Text;
  private gameOverData!: GameOverData;

  // Initialen-Eingabe
  private enteringInitials = false;
  private initials = '';
  private initialsText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: GameOverData): void {
    this.blinkTimer = 0;
    this.gameOverData = data;
    this.initials = '';
    this.enteringInitials = false;
  }

  create(): void {
    const { success, score, highScore } = this.gameOverData;

    const bgColor = success ? 0x001a00 : 0x1a0000;
    const bg = this.add.graphics();
    bg.fillStyle(bgColor, 0.95);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    if (success) {
      this.createSuccessScreen(score, highScore);
    } else {
      this.createFailScreen(score, highScore);
    }

    // Check if new Top-5 entry
    if (SaveSystem.isTopScore(score)) {
      this.enteringInitials = true;
      this.createInitialsInput(score);
    } else {
      this.showTopScores(success ? 170 : 215);
      this.addRestartPrompt(success ? 220 : 240);
    }
  }

  private createSuccessScreen(score: number, highScore: number): void {
    this.add.text(GAME_WIDTH / 2, 35, '🎉 FEIERABEND! 🎉', {
      fontSize: '18px', color: '#ffcc00', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 60, 'Das Legacy-System ist gerettet!', {
      fontSize: '8px', color: '#aaffaa', fontFamily: 'monospace'
    }).setOrigin(0.5);

    const isNew = score > highScore;
    this.add.text(GAME_WIDTH / 2, 82, `SCORE: ${score}`, {
      fontSize: '14px', color: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(0.5);

    if (isNew) {
      const nt = this.add.text(GAME_WIDTH / 2, 100, '★ NEUER HIGHSCORE! ★', {
        fontSize: '9px', color: '#ffcc00', fontFamily: 'monospace',
        stroke: '#cc6600', strokeThickness: 2
      }).setOrigin(0.5);
      this.tweens.add({ targets: nt, scaleX: 1.1, scaleY: 1.1, duration: 400, yoyo: true, repeat: -1 });
    }

    this.add.text(GAME_WIDTH / 2, 115, `BESTER: ${highScore}`, {
      fontSize: '8px', color: '#aaaaaa', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 132, '── TAGESPROTOKOLL ──', {
      fontSize: '7px', color: '#44aaff', fontFamily: 'monospace'
    }).setOrigin(0.5);

    const stats = ['Tickets gestompt: viele', 'Drucker überlebt: ja', 'Kaffee getrunken: genug', 'Überstunden: 0 (!)'];
    stats.forEach((s, i) => {
      this.add.text(GAME_WIDTH / 2, 143 + i * 9, s, {
        fontSize: '6px', color: '#88cc88', fontFamily: 'monospace'
      }).setOrigin(0.5);
    });
  }

  private createFailScreen(score: number, highScore: number): void {
    this.time.delayedCall(100, () => { AudioSystem.getInstance().play17Alarm(); });

    this.add.text(GAME_WIDTH / 2, 25, '🚨 17:00 UHR! 🚨', {
      fontSize: '16px', color: '#ff2222', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5);

    const flash = this.add.text(GAME_WIDTH / 2, 44, 'BEREITSCHAFTSDIENST!', {
      fontSize: '10px', color: '#ff6644', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);
    this.tweens.add({ targets: flash, alpha: 0.2, duration: 300, yoyo: true, repeat: -1 });

    this.add.text(GAME_WIDTH / 2, 62, 'Das Legacy-System ist abgestürzt.', {
      fontSize: '7px', color: '#ff8888', fontFamily: 'monospace'
    }).setOrigin(0.5);

    // BSOD
    const bsod = this.add.graphics();
    bsod.fillStyle(0x0000aa);
    bsod.fillRect(40, 78, GAME_WIDTH - 80, 88);
    bsod.fillStyle(0xffffff);
    bsod.fillRect(42, 80, GAME_WIDTH - 84, 84);
    bsod.fillStyle(0x0000aa);
    bsod.fillRect(44, 82, GAME_WIDTH - 88, 80);

    this.add.text(56, 90,  ':( Ein Fehler ist aufgetreten.', { fontSize: '7px', color: '#ffffff', fontFamily: 'monospace' });
    this.add.text(56, 100, 'LEGACY_SYSTEM_COLLAPSE', { fontSize: '8px', color: '#ffffff', fontFamily: 'monospace' });
    this.add.text(56, 111, `Fehlercode: 0x000${score}`, { fontSize: '6px', color: '#cccccc', fontFamily: 'monospace' });
    this.add.text(56, 120, `Highscore:  ${highScore}`, { fontSize: '6px', color: '#cccccc', fontFamily: 'monospace' });
    this.add.text(56, 130, 'Neustart empfohlen.', { fontSize: '6px', color: '#aaaaaa', fontFamily: 'monospace' });
    this.add.text(56, 140, '100% abgeschlossen', { fontSize: '6px', color: '#cccccc', fontFamily: 'monospace' });
  }

  private createInitialsInput(score: number): void {
    const y = GAME_HEIGHT - 90;

    this.add.text(GAME_WIDTH / 2, y, '── NEUER HIGHSCORE! ──', {
      fontSize: '8px', color: '#ffcc00', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, y + 14, `Score: ${score}`, {
      fontSize: '8px', color: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, y + 26, 'Initialen (3 Buchstaben):', {
      fontSize: '7px', color: '#aaaaaa', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.initialsText = this.add.text(GAME_WIDTH / 2, y + 38, '_ _ _', {
      fontSize: '16px', color: '#ffcc00', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, y + 56, 'A-Z eingeben, ENTER zum Bestätigen', {
      fontSize: '5px', color: '#888888', fontFamily: 'monospace'
    }).setOrigin(0.5);

    if (this.input.keyboard) {
      this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
        if (!this.enteringInitials) return;
        const key = event.key.toUpperCase();
        if (key.length === 1 && key >= 'A' && key <= 'Z' && this.initials.length < 3) {
          this.initials += key;
          this.updateInitialsDisplay();
        } else if (key === 'BACKSPACE' && this.initials.length > 0) {
          this.initials = this.initials.slice(0, -1);
          this.updateInitialsDisplay();
        } else if (key === 'ENTER' && this.initials.length === 3) {
          this.submitInitials(score);
        }
      });
    }
  }

  private updateInitialsDisplay(): void {
    const display = [...'___'].map((_, i) => this.initials[i] ?? '_').join(' ');
    this.initialsText.setText(display);
  }

  private submitInitials(score: number): void {
    this.enteringInitials = false;
    SaveSystem.submitScore(score, this.initials);
    // Show top scores after input
    this.showTopScores(GAME_HEIGHT - 90);
    this.initialsText.setText(this.initials).setColor('#44ff88');
    this.time.delayedCall(500, () => {
      this.addRestartPrompt(GAME_HEIGHT - 28);
    });
  }

  private showTopScores(y: number): void {
    const scores = SaveSystem.getTopScores();
    if (scores.length === 0) return;

    this.add.text(GAME_WIDTH / 2, y, '── TOP 5 ──', {
      fontSize: '7px', color: '#ffcc00', fontFamily: 'monospace'
    }).setOrigin(0.5);

    scores.forEach((e, i) => {
      const color = i === 0 ? '#ffcc00' : i === 1 ? '#cccccc' : i === 2 ? '#cc8844' : '#888888';
      this.add.text(GAME_WIDTH / 2, y + 10 + i * 9, `${i + 1}. ${e.initials.padEnd(3, ' ')}  ${e.score}`, {
        fontSize: '7px', color, fontFamily: 'monospace'
      }).setOrigin(0.5);
    });
  }

  private addRestartPrompt(y: number): void {
    this.pressText = this.add.text(GAME_WIDTH / 2, y, '[ ENTER = Nochmal ]', {
      fontSize: '7px', color: '#ffffff', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, y + 12, '[ ESC = Hauptmenü ]', {
      fontSize: '7px', color: '#aaaaaa', fontFamily: 'monospace'
    }).setOrigin(0.5);

    if (this.input.keyboard) {
      this.input.keyboard.once('keydown-ENTER', () => this.restart());
      this.input.keyboard.once('keydown-SPACE', () => this.restart());
      this.input.keyboard.once('keydown-ESC',   () => this.goToMenu());
    }
    this.input.once('pointerdown', () => this.restart());
  }

  private restart(): void {
    AudioSystem.getInstance().stopMusic();
    this.scene.stop('HudScene');
    this.scene.start('LevelTransitionScene', { levelIndex: 1, numPlayers: 1 });
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
