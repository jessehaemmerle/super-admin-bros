import Phaser from 'phaser';
import { GAME_WIDTH } from '../config';

export class HudScene extends Phaser.Scene {
  private livesText!: Phaser.GameObjects.Text;
  private docsText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private clockText!: Phaser.GameObjects.Text;
  private clockBar!: Phaser.GameObjects.Graphics;
  private clockBarBg!: Phaser.GameObjects.Rectangle;
  private powerIcon!: Phaser.GameObjects.Text;
  private warningText!: Phaser.GameObjects.Text;

  private lastClockProgress = 0;

  constructor() {
    super({ key: 'HudScene' });
  }

  create(): void {
    // HUD background bar
    const hudBg = this.add.graphics();
    hudBg.fillStyle(0x000000, 0.7);
    hudBg.fillRect(0, 0, GAME_WIDTH, 16);
    hudBg.setDepth(99);

    // Lives
    this.livesText = this.add.text(4, 3, '💾×3', {
      fontSize: '8px',
      color: '#ffffff',
      fontFamily: 'monospace'
    }).setDepth(100);

    // Docs
    this.docsText = this.add.text(60, 3, 'DOKU:000', {
      fontSize: '8px',
      color: '#aaffaa',
      fontFamily: 'monospace'
    }).setDepth(100);

    // Score
    this.scoreText = this.add.text(140, 3, 'SCORE:00000', {
      fontSize: '8px',
      color: '#ffff44',
      fontFamily: 'monospace'
    }).setDepth(100);

    // Power state icon
    this.powerIcon = this.add.text(256, 3, '[SML]', {
      fontSize: '8px',
      color: '#44aaff',
      fontFamily: 'monospace'
    }).setDepth(100);

    // Clock time
    this.clockText = this.add.text(305, 3, '🕑14:00', {
      fontSize: '8px',
      color: '#ffffff',
      fontFamily: 'monospace'
    }).setDepth(100);

    // Clock progress bar background
    this.clockBarBg = this.add.rectangle(360, 8, 100, 8, 0x444444);
    this.clockBarBg.setOrigin(0, 0.5).setDepth(99);

    // Clock progress bar
    this.clockBar = this.add.graphics();
    this.clockBar.setDepth(100);

    // Warning text (flashes at 16:00)
    this.warningText = this.add.text(GAME_WIDTH / 2, 8, '', {
      fontSize: '8px',
      color: '#ff4444',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(101);

    // Listen to registry changes
    this.registry.events.on('changedata', (_parent: unknown, key: string, value: unknown) => {
      this.handleRegistryChange(key, value);
    });

    // Initial sync
    this.syncAll();
  }

  private handleRegistryChange(key: string, value: unknown): void {
    switch (key) {
      case 'lives':
        this.updateLives(value as number);
        break;
      case 'docs':
        this.updateDocs(value as number);
        break;
      case 'score':
        this.updateScore(value as number);
        break;
      case 'clockTime':
        this.updateClock(value as string);
        break;
      case 'clockProgress':
        this.updateClockBar(value as number);
        break;
      case 'powerState':
        this.updatePowerIcon(value as string);
        break;
    }
  }

  private syncAll(): void {
    this.updateLives(this.registry.get('lives') as number ?? 3);
    this.updateDocs(this.registry.get('docs') as number ?? 0);
    this.updateScore(this.registry.get('score') as number ?? 0);
    this.updateClock(this.registry.get('clockTime') as string ?? '14:00');
    this.updateClockBar(this.registry.get('clockProgress') as number ?? 0);
    this.updatePowerIcon(this.registry.get('powerState') as string ?? 'small');
  }

  private updateLives(lives: number): void {
    this.livesText.setText(`💾×${lives}`);
    if (lives <= 1) {
      this.livesText.setColor('#ff4444');
    } else {
      this.livesText.setColor('#ffffff');
    }
  }

  private updateDocs(docs: number): void {
    this.docsText.setText(`DOKU:${docs.toString().padStart(3, '0')}`);
  }

  private updateScore(score: number): void {
    this.scoreText.setText(`SCORE:${score.toString().padStart(5, '0')}`);
  }

  private updateClock(time: string): void {
    this.clockText.setText(`${time}`);

    // Color based on time
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 16) {
      this.clockText.setColor('#ff4444');
    } else if (hour >= 15) {
      this.clockText.setColor('#ffaa44');
    } else {
      this.clockText.setColor('#ffffff');
    }
  }

  private updateClockBar(progress: number): void {
    this.clockBar.clear();

    const barWidth = 100;
    const barHeight = 8;
    const barX = 360;
    const barY = 4;

    const filled = Math.floor(progress * barWidth);

    // Color transitions: green → yellow → red
    let color = 0x44cc44;
    if (progress > 0.8) {
      color = 0xcc2222;
    } else if (progress > 0.55) {
      color = 0xccaa22;
    }

    this.clockBar.fillStyle(color);
    this.clockBar.fillRect(barX, barY, filled, barHeight);

    // Blinking warning at 16:00+
    if (progress > 0.67 && !this.warningText.text.includes('ESKALATION')) {
      // Already shown from game
    }

    this.lastClockProgress = progress;
  }

  private updatePowerIcon(state: string): void {
    switch (state) {
      case 'big':
        this.powerIcon.setText('[BIG]');
        this.powerIcon.setColor('#44ccff');
        break;
      case 'sudo':
        this.powerIcon.setText('[SUDO]');
        this.powerIcon.setColor('#ffcc00');
        break;
      default:
        this.powerIcon.setText('[SML]');
        this.powerIcon.setColor('#aaaaaa');
    }
  }

  update(): void {
    // Flash warning at escalation
    if (this.lastClockProgress > 0.67) {
      const flash = Math.floor(this.time.now / 300) % 2 === 0;
      if (this.lastClockProgress > 0.9) {
        this.warningText.setText('⚠ 17:00 NAHT! ⚠');
        this.warningText.setVisible(flash);
      }
    } else {
      this.warningText.setVisible(false);
    }
  }
}
