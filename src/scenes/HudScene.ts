import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { TouchInput } from '../entities/Player';

export class HudScene extends Phaser.Scene {
  private livesText!: Phaser.GameObjects.Text;
  private lives2Text!: Phaser.GameObjects.Text;
  private docsText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private clockText!: Phaser.GameObjects.Text;
  private clockBar!: Phaser.GameObjects.Graphics;
  private clockBarBg!: Phaser.GameObjects.Rectangle;
  private powerIcon!: Phaser.GameObjects.Text;
  private power2Icon!: Phaser.GameObjects.Text;
  private warningText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private comboText!: Phaser.GameObjects.Text;
  private comboTween?: Phaser.Tweens.Tween;

  private lastClockProgress = 0;
  private numPlayers = 1;

  // Touch buttons (shown on mobile / pointer input)
  private touchButtons: Phaser.GameObjects.Container | null = null;
  private isTouchDevice = false;

  constructor() {
    super({ key: 'HudScene' });
  }

  create(): void {
    this.numPlayers   = this.registry.get('numPlayers') as number ?? 1;
    this.isTouchDevice = this.sys.game.device.input.touch;

    // HUD background bar
    const hudBg = this.add.graphics();
    hudBg.fillStyle(0x000000, 0.75);
    hudBg.fillRect(0, 0, GAME_WIDTH, 16);
    hudBg.setDepth(99);

    // Lives P1
    this.livesText = this.add.text(4, 3, '💾×3', {
      fontSize: '8px', color: '#ffffff', fontFamily: 'monospace'
    }).setDepth(100);

    // Lives P2 (only in 2P mode)
    this.lives2Text = this.add.text(48, 3, '', {
      fontSize: '8px', color: '#aaffaa', fontFamily: 'monospace'
    }).setDepth(100);

    // Docs
    this.docsText = this.add.text(90, 3, 'DOKU:000', {
      fontSize: '8px', color: '#aaffaa', fontFamily: 'monospace'
    }).setDepth(100);

    // Score
    this.scoreText = this.add.text(155, 3, 'SCORE:00000', {
      fontSize: '8px', color: '#ffff44', fontFamily: 'monospace'
    }).setDepth(100);

    // Power state P1
    this.powerIcon = this.add.text(256, 3, '[SML]', {
      fontSize: '8px', color: '#44aaff', fontFamily: 'monospace'
    }).setDepth(100);

    // Power state P2
    this.power2Icon = this.add.text(296, 3, '', {
      fontSize: '8px', color: '#88ffaa', fontFamily: 'monospace'
    }).setDepth(100);

    // Clock time
    this.clockText = this.add.text(306, 3, '14:00', {
      fontSize: '8px', color: '#ffffff', fontFamily: 'monospace'
    }).setDepth(100);

    // Clock bar bg
    this.clockBarBg = this.add.rectangle(362, 8, 100, 8, 0x444444);
    this.clockBarBg.setOrigin(0, 0.5).setDepth(99);
    this.clockBar = this.add.graphics().setDepth(100);

    // Warning
    this.warningText = this.add.text(GAME_WIDTH / 2, 8, '', {
      fontSize: '8px', color: '#ff4444', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(101);

    // Level indicator (top-right)
    this.levelText = this.add.text(GAME_WIDTH - 4, 3, '', {
      fontSize: '7px', color: '#aaaaaa', fontFamily: 'monospace'
    }).setOrigin(1, 0).setDepth(100);

    // Combo text (below HUD bar, center)
    this.comboText = this.add.text(GAME_WIDTH / 2, 20, '', {
      fontSize: '10px', color: '#ffcc00', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(101).setAlpha(0);

    // Touch controls
    if (this.isTouchDevice) {
      this.createTouchControls();
    }

    // Registry listener
    this.registry.events.on('changedata', (_parent: unknown, key: string, value: unknown) => {
      this.handleRegistryChange(key, value);
    });

    this.syncAll();
  }

  private createTouchControls(): void {
    const btnAlpha = 0.45;
    const btnSize  = 36;
    const margin   = 10;
    const y        = GAME_HEIGHT - margin - btnSize / 2;

    const makeBtn = (label: string, bx: number, by: number, onDown: () => void, onUp: () => void) => {
      const bg = this.add.graphics();
      bg.fillStyle(0xffffff, btnAlpha);
      bg.fillRoundedRect(-btnSize / 2, -btnSize / 2, btnSize, btnSize, 8);
      bg.lineStyle(2, 0xaaaaaa, 0.6);
      bg.strokeRoundedRect(-btnSize / 2, -btnSize / 2, btnSize, btnSize, 8);
      const txt = this.add.text(0, 0, label, {
        fontSize: '14px', color: '#ffffff', fontFamily: 'monospace'
      }).setOrigin(0.5);
      const zone = this.add.zone(0, 0, btnSize, btnSize).setInteractive();
      zone.on('pointerdown', onDown);
      zone.on('pointerup',   onUp);
      zone.on('pointerout',  onUp);
      const c = this.add.container(bx, by, [bg, txt, zone]);
      c.setDepth(200);
      return c;
    };

    // P1 buttons
    makeBtn('◀', margin + btnSize / 2,          y, () => { TouchInput.left  = true; }, () => { TouchInput.left  = false; });
    makeBtn('▶', margin + btnSize * 1.5 + 6,    y, () => { TouchInput.right = true; }, () => { TouchInput.right = false; });
    makeBtn('▲', GAME_WIDTH - margin * 2 - btnSize * 1.5, y, () => { TouchInput.jump  = true; }, () => { TouchInput.jump  = false; });
    makeBtn('✦', GAME_WIDTH - margin - btnSize / 2,       y, () => { TouchInput.fire  = true; }, () => { TouchInput.fire  = false; });

    if (this.numPlayers === 2) {
      // P2 buttons (above P1, left side for P2)
      const y2 = y - btnSize - 8;
      makeBtn('◀', margin + btnSize / 2,       y2, () => { TouchInput.p2left  = true;  }, () => { TouchInput.p2left  = false; });
      makeBtn('▶', margin + btnSize * 1.5 + 6, y2, () => { TouchInput.p2right = true;  }, () => { TouchInput.p2right = false; });
      makeBtn('▲', GAME_WIDTH - margin * 2 - btnSize * 1.5, y2, () => { TouchInput.p2jump = true; }, () => { TouchInput.p2jump = false; });
      makeBtn('✦', GAME_WIDTH - margin - btnSize / 2,       y2, () => { TouchInput.p2fire = true; }, () => { TouchInput.p2fire = false; });
    }
  }

  private handleRegistryChange(key: string, value: unknown): void {
    switch (key) {
      case 'lives':       this.updateLives(value as number); break;
      case 'lives2':      this.updateLives2(value as number); break;
      case 'docs':        this.updateDocs(value as number); break;
      case 'score':       this.updateScore(value as number); break;
      case 'clockTime':   this.updateClock(value as string); break;
      case 'clockProgress': this.updateClockBar(value as number); break;
      case 'powerState':  this.updatePowerIcon(value as string); break;
      case 'powerState2': this.updatePower2Icon(value as string); break;
      case 'comboCount':  this.updateCombo(value as number); break;
      case 'levelIndex':  this.levelText.setText(`LVL ${value}`); break;
    }
  }

  private syncAll(): void {
    this.updateLives(this.registry.get('lives')  as number ?? 3);
    this.updateLives2(this.registry.get('lives2') as number ?? 0);
    this.updateDocs(this.registry.get('docs')    as number ?? 0);
    this.updateScore(this.registry.get('score')  as number ?? 0);
    this.updateClock(this.registry.get('clockTime') as string ?? '14:00');
    this.updateClockBar(this.registry.get('clockProgress') as number ?? 0);
    this.updatePowerIcon(this.registry.get('powerState') as string ?? 'small');
    this.updatePower2Icon(this.registry.get('powerState2') as string ?? 'small');
    this.levelText.setText(`LVL ${this.registry.get('levelIndex') as number ?? 1}`);
  }

  private updateLives(lives: number): void {
    this.livesText.setText(`💾×${lives}`);
    this.livesText.setColor(lives <= 1 ? '#ff4444' : '#ffffff');
  }

  private updateLives2(lives: number): void {
    if (this.numPlayers < 2 || lives <= 0) { this.lives2Text.setText(''); return; }
    this.lives2Text.setText(`P2:${lives}`);
    this.lives2Text.setColor(lives <= 1 ? '#ff8888' : '#aaffaa');
  }

  private updateDocs(docs: number): void {
    this.docsText.setText(`DOKU:${docs.toString().padStart(3, '0')}`);
  }

  private updateScore(score: number): void {
    this.scoreText.setText(`SCORE:${score.toString().padStart(5, '0')}`);
  }

  private updateClock(time: string): void {
    this.clockText.setText(time);
    const hour = parseInt(time.split(':')[0]);
    this.clockText.setColor(hour >= 16 ? '#ff4444' : hour >= 15 ? '#ffaa44' : '#ffffff');
  }

  private updateClockBar(progress: number): void {
    this.clockBar.clear();
    const filled = Math.floor(progress * 100);
    const color  = progress > 0.8 ? 0xcc2222 : progress > 0.55 ? 0xccaa22 : 0x44cc44;
    this.clockBar.fillStyle(color);
    this.clockBar.fillRect(362, 4, filled, 8);
    this.lastClockProgress = progress;
  }

  private updatePowerIcon(state: string): void {
    const map: Record<string, [string, string]> = {
      big:  ['[BIG]',  '#44ccff'],
      sudo: ['[SUDO]', '#ffcc00'],
      small:['[SML]',  '#aaaaaa']
    };
    const [label, color] = map[state] ?? ['[SML]', '#aaaaaa'];
    this.powerIcon.setText(label).setColor(color);
  }

  private updatePower2Icon(state: string): void {
    if (this.numPlayers < 2) { this.power2Icon.setText(''); return; }
    const map: Record<string, [string, string]> = {
      big:  ['[B2]',  '#44ccff'],
      sudo: ['[S2]',  '#ffcc00'],
      small:['',      '#aaaaaa']
    };
    const [label, color] = map[state] ?? ['', '#aaaaaa'];
    this.power2Icon.setText(label).setColor(color);
  }

  private updateCombo(count: number): void {
    if (count <= 1) {
      this.comboTween?.stop();
      this.comboText.setAlpha(0);
      return;
    }
    this.comboText.setText(`COMBO x${count}!`);
    this.comboTween?.stop();
    this.comboText.setAlpha(1).setScale(1.4);
    this.comboTween = this.tweens.add({
      targets: this.comboText,
      scale: 1,
      duration: 200,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: this.comboText,
          alpha: 0,
          duration: 800,
          delay: 1200
        });
      }
    });
  }

  update(): void {
    if (this.lastClockProgress > 0.9) {
      const flash = Math.floor(this.time.now / 300) % 2 === 0;
      this.warningText.setText('⚠ 17:00 NAHT! ⚠').setVisible(flash);
    } else {
      this.warningText.setVisible(false);
    }
  }
}
