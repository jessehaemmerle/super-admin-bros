import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    this.generateHankSmall();
    this.generateHankBig();
    this.generateHankSudo();
    this.generateTileset();
    this.generateTicket();
    this.generatePrinter();
    this.generatePhishingMail();
    this.generateClumsyUser();
    this.generatePowerUps();
    this.generateDocPage();
    this.generateProjectiles();
    this.generateStars();
    this.generateExplosion();
    this.generateBackground();
    this.generateBuggyCode();
    this.generateCeo();
    this.generateBackgroundServerroom();
    this.generateBackgroundDatacenter();
    this.generateBackgroundMid();
    this.generateBackgroundNear();

    this.scene.start('MenuScene');
  }

  private generateHankSmall(): void {
    // 8 frames × 16×24 = 128×24
    const g = this.make.graphics({ x: 0, y: 0 }, false);

    const frames = [
      // idle
      (x: number) => {
        // body (shirt blue)
        g.fillStyle(0x4466cc);
        g.fillRect(x + 4, 10, 8, 10);
        // pants (dark)
        g.fillStyle(0x223355);
        g.fillRect(x + 4, 18, 8, 4);
        // legs
        g.fillStyle(0x223355);
        g.fillRect(x + 4, 20, 3, 4);
        g.fillRect(x + 9, 20, 3, 4);
        // shoes
        g.fillStyle(0x111111);
        g.fillRect(x + 3, 22, 4, 2);
        g.fillRect(x + 9, 22, 4, 2);
        // head/skin
        g.fillStyle(0xffcc99);
        g.fillRect(x + 4, 2, 8, 8);
        // hair
        g.fillStyle(0x553311);
        g.fillRect(x + 4, 2, 8, 2);
        g.fillRect(x + 4, 3, 2, 2);
        // glasses
        g.fillStyle(0x111111);
        g.fillRect(x + 5, 5, 2, 1);
        g.fillRect(x + 9, 5, 2, 1);
        g.fillRect(x + 7, 5, 2, 1);
        // tie
        g.fillStyle(0xcc2222);
        g.fillRect(x + 7, 10, 2, 7);
        g.fillRect(x + 6, 11, 4, 2);
      },
      // run1
      (x: number) => {
        g.fillStyle(0x4466cc);
        g.fillRect(x + 4, 10, 8, 10);
        g.fillStyle(0x223355);
        g.fillRect(x + 4, 18, 8, 4);
        g.fillRect(x + 3, 20, 3, 4);
        g.fillRect(x + 10, 19, 3, 3);
        g.fillStyle(0x111111);
        g.fillRect(x + 2, 22, 4, 2);
        g.fillRect(x + 10, 20, 4, 2);
        g.fillStyle(0xffcc99);
        g.fillRect(x + 4, 2, 8, 8);
        g.fillStyle(0x553311);
        g.fillRect(x + 4, 2, 8, 2);
        g.fillStyle(0x111111);
        g.fillRect(x + 5, 5, 2, 1);
        g.fillRect(x + 9, 5, 2, 1);
        g.fillRect(x + 7, 5, 2, 1);
        g.fillStyle(0xcc2222);
        g.fillRect(x + 7, 10, 2, 7);
        // arm forward
        g.fillStyle(0x4466cc);
        g.fillRect(x + 12, 11, 2, 6);
        g.fillRect(x + 2, 13, 2, 5);
      },
      // run2
      (x: number) => {
        g.fillStyle(0x4466cc);
        g.fillRect(x + 4, 9, 8, 10);
        g.fillStyle(0x223355);
        g.fillRect(x + 4, 17, 8, 4);
        g.fillRect(x + 4, 19, 3, 5);
        g.fillRect(x + 9, 19, 3, 5);
        g.fillStyle(0x111111);
        g.fillRect(x + 3, 22, 4, 2);
        g.fillRect(x + 9, 22, 4, 2);
        g.fillStyle(0xffcc99);
        g.fillRect(x + 4, 1, 8, 8);
        g.fillStyle(0x553311);
        g.fillRect(x + 4, 1, 8, 2);
        g.fillStyle(0x111111);
        g.fillRect(x + 5, 4, 2, 1);
        g.fillRect(x + 9, 4, 2, 1);
        g.fillRect(x + 7, 4, 2, 1);
        g.fillStyle(0xcc2222);
        g.fillRect(x + 7, 9, 2, 7);
        g.fillStyle(0x4466cc);
        g.fillRect(x + 12, 10, 2, 5);
        g.fillRect(x + 2, 12, 2, 5);
      },
      // run3
      (x: number) => {
        g.fillStyle(0x4466cc);
        g.fillRect(x + 4, 10, 8, 10);
        g.fillStyle(0x223355);
        g.fillRect(x + 4, 18, 8, 4);
        g.fillRect(x + 5, 20, 3, 4);
        g.fillRect(x + 8, 20, 3, 4);
        g.fillStyle(0x111111);
        g.fillRect(x + 4, 22, 4, 2);
        g.fillRect(x + 8, 22, 4, 2);
        g.fillStyle(0xffcc99);
        g.fillRect(x + 4, 2, 8, 8);
        g.fillStyle(0x553311);
        g.fillRect(x + 4, 2, 8, 2);
        g.fillStyle(0x111111);
        g.fillRect(x + 5, 5, 2, 1);
        g.fillRect(x + 9, 5, 2, 1);
        g.fillRect(x + 7, 5, 2, 1);
        g.fillStyle(0xcc2222);
        g.fillRect(x + 7, 10, 2, 7);
        g.fillStyle(0x4466cc);
        g.fillRect(x + 12, 12, 2, 5);
        g.fillRect(x + 2, 11, 2, 5);
      },
      // run4
      (x: number) => {
        g.fillStyle(0x4466cc);
        g.fillRect(x + 4, 10, 8, 10);
        g.fillStyle(0x223355);
        g.fillRect(x + 4, 18, 8, 4);
        g.fillRect(x + 6, 20, 3, 4);
        g.fillRect(x + 9, 19, 3, 4);
        g.fillStyle(0x111111);
        g.fillRect(x + 5, 22, 4, 2);
        g.fillRect(x + 9, 21, 4, 2);
        g.fillStyle(0xffcc99);
        g.fillRect(x + 4, 2, 8, 8);
        g.fillStyle(0x553311);
        g.fillRect(x + 4, 2, 8, 2);
        g.fillStyle(0x111111);
        g.fillRect(x + 5, 5, 2, 1);
        g.fillRect(x + 9, 5, 2, 1);
        g.fillRect(x + 7, 5, 2, 1);
        g.fillStyle(0xcc2222);
        g.fillRect(x + 7, 10, 2, 7);
        g.fillStyle(0x4466cc);
        g.fillRect(x + 11, 11, 2, 6);
        g.fillRect(x + 3, 12, 2, 6);
      },
      // jump
      (x: number) => {
        g.fillStyle(0x4466cc);
        g.fillRect(x + 4, 9, 8, 9);
        g.fillStyle(0x223355);
        g.fillRect(x + 4, 17, 8, 4);
        g.fillRect(x + 3, 18, 4, 5);
        g.fillRect(x + 9, 18, 4, 5);
        g.fillStyle(0x111111);
        g.fillRect(x + 2, 21, 5, 2);
        g.fillRect(x + 9, 21, 5, 2);
        g.fillStyle(0xffcc99);
        g.fillRect(x + 4, 1, 8, 8);
        g.fillStyle(0x553311);
        g.fillRect(x + 4, 1, 8, 2);
        g.fillStyle(0x111111);
        g.fillRect(x + 5, 4, 2, 1);
        g.fillRect(x + 9, 4, 2, 1);
        g.fillRect(x + 7, 4, 2, 1);
        g.fillStyle(0xcc2222);
        g.fillRect(x + 7, 9, 2, 7);
        g.fillStyle(0x4466cc);
        g.fillRect(x + 12, 10, 3, 4);
        g.fillRect(x + 1, 10, 3, 4);
      },
      // fall
      (x: number) => {
        g.fillStyle(0x4466cc);
        g.fillRect(x + 4, 10, 8, 10);
        g.fillStyle(0x223355);
        g.fillRect(x + 4, 18, 8, 4);
        g.fillRect(x + 3, 19, 4, 5);
        g.fillRect(x + 9, 19, 4, 5);
        g.fillStyle(0x111111);
        g.fillRect(x + 2, 22, 5, 2);
        g.fillRect(x + 9, 22, 5, 2);
        g.fillStyle(0xffcc99);
        g.fillRect(x + 4, 2, 8, 8);
        g.fillStyle(0x553311);
        g.fillRect(x + 4, 2, 8, 2);
        g.fillStyle(0x111111);
        g.fillRect(x + 5, 5, 2, 1);
        g.fillRect(x + 9, 5, 2, 1);
        g.fillRect(x + 7, 5, 2, 1);
        g.fillStyle(0xcc2222);
        g.fillRect(x + 7, 10, 2, 7);
        g.fillStyle(0x4466cc);
        g.fillRect(x + 12, 11, 3, 5);
        g.fillRect(x + 1, 11, 3, 5);
      },
      // hurt
      (x: number) => {
        g.fillStyle(0x4466cc);
        g.fillRect(x + 4, 11, 8, 9);
        g.fillStyle(0x223355);
        g.fillRect(x + 4, 18, 8, 4);
        g.fillRect(x + 3, 20, 3, 4);
        g.fillRect(x + 10, 19, 3, 3);
        g.fillStyle(0x111111);
        g.fillRect(x + 2, 22, 4, 2);
        g.fillRect(x + 10, 20, 4, 2);
        // red tinted skin
        g.fillStyle(0xff8888);
        g.fillRect(x + 4, 3, 8, 8);
        g.fillStyle(0x553311);
        g.fillRect(x + 4, 3, 8, 2);
        g.fillStyle(0x111111);
        g.fillRect(x + 5, 6, 2, 2);
        g.fillRect(x + 9, 6, 2, 2);
        // X eyes
        g.fillStyle(0xcc2222);
        g.fillRect(x + 7, 11, 2, 7);
        g.fillStyle(0x4466cc);
        g.fillRect(x + 13, 12, 2, 4);
        g.fillRect(x + 1, 12, 2, 4);
      }
    ];

    g.clear();
    for (let i = 0; i < frames.length; i++) {
      frames[i](i * 16);
    }
    g.generateTexture('hank_small', 128, 24);
    g.destroy();

    // Create animations
    this.anims.create({
      key: 'hank_idle',
      frames: this.anims.generateFrameNumbers('hank_small', { start: 0, end: 0 }),
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'hank_run',
      frames: this.anims.generateFrameNumbers('hank_small', { start: 1, end: 4 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'hank_jump',
      frames: this.anims.generateFrameNumbers('hank_small', { start: 5, end: 5 }),
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'hank_fall',
      frames: this.anims.generateFrameNumbers('hank_small', { start: 6, end: 6 }),
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'hank_hurt',
      frames: this.anims.generateFrameNumbers('hank_small', { start: 7, end: 7 }),
      frameRate: 1,
      repeat: -1
    });
  }

  private generateHankBig(): void {
    // 8 frames × 16×32 = 128×32
    const g = this.make.graphics({ x: 0, y: 0 }, false);

    const drawBig = (x: number, legLeft: number, legRight: number, armPhase: number, hurt: boolean) => {
      const skinColor = hurt ? 0xff8888 : 0xffcc99;
      // shoes
      g.fillStyle(0x111111);
      g.fillRect(x + legLeft - 1, 28, 5, 4);
      g.fillRect(x + legRight - 1, 28, 5, 4);
      // pants
      g.fillStyle(0x223355);
      g.fillRect(x + 4, 22, 8, 6);
      g.fillRect(x + legLeft, 24, 3, 6);
      g.fillRect(x + legRight, 24, 3, 6);
      // shirt
      g.fillStyle(0x4466cc);
      g.fillRect(x + 3, 12, 10, 12);
      // arms
      g.fillStyle(0x4466cc);
      if (armPhase === 0) {
        g.fillRect(x + 13, 13, 2, 7);
        g.fillRect(x + 1, 14, 2, 6);
      } else if (armPhase === 1) {
        g.fillRect(x + 14, 12, 2, 6);
        g.fillRect(x + 0, 14, 2, 6);
      } else {
        g.fillRect(x + 13, 14, 2, 8);
        g.fillRect(x + 1, 13, 2, 7);
      }
      // tie
      g.fillStyle(0xcc2222);
      g.fillRect(x + 7, 12, 2, 9);
      g.fillRect(x + 6, 13, 4, 2);
      // head
      g.fillStyle(skinColor);
      g.fillRect(x + 3, 2, 10, 10);
      // hair
      g.fillStyle(0x553311);
      g.fillRect(x + 3, 2, 10, 2);
      g.fillRect(x + 3, 3, 2, 2);
      g.fillRect(x + 11, 3, 2, 1);
      // glasses
      g.fillStyle(0x111111);
      g.fillRect(x + 5, 6, 3, 1);
      g.fillRect(x + 9, 6, 3, 1);
      g.fillRect(x + 8, 6, 1, 1);
      if (hurt) {
        g.fillRect(x + 5, 7, 2, 2);
        g.fillRect(x + 10, 7, 2, 2);
      }
    };

    g.clear();
    // idle
    drawBig(0, 5, 9, 0, false);
    // run1
    drawBig(16, 3, 10, 1, false);
    // run2
    drawBig(32, 4, 9, 0, false);
    // run3
    drawBig(48, 5, 8, 2, false);
    // run4
    drawBig(64, 5, 9, 1, false);
    // jump
    g.fillStyle(0x4466cc);
    g.fillRect(80 + 3, 11, 10, 11);
    g.fillStyle(0x223355);
    g.fillRect(80 + 3, 22, 10, 5);
    g.fillRect(80 + 2, 23, 4, 7);
    g.fillRect(80 + 10, 23, 4, 7);
    g.fillStyle(0x111111);
    g.fillRect(80 + 1, 28, 5, 4);
    g.fillRect(80 + 10, 28, 5, 4);
    g.fillStyle(0xffcc99);
    g.fillRect(80 + 3, 1, 10, 10);
    g.fillStyle(0x553311);
    g.fillRect(80 + 3, 1, 10, 2);
    g.fillStyle(0x111111);
    g.fillRect(80 + 5, 5, 3, 1);
    g.fillRect(80 + 9, 5, 3, 1);
    g.fillStyle(0x4466cc);
    g.fillRect(80 + 14, 11, 2, 5);
    g.fillRect(80 + 0, 11, 2, 5);
    g.fillStyle(0xcc2222);
    g.fillRect(80 + 7, 11, 2, 9);
    // fall
    drawBig(96, 5, 9, 2, false);
    // hurt
    drawBig(112, 3, 11, 1, true);

    g.generateTexture('hank_big', 128, 32);
    g.destroy();

    this.anims.create({
      key: 'hank_big_idle',
      frames: this.anims.generateFrameNumbers('hank_big', { start: 0, end: 0 }),
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'hank_big_run',
      frames: this.anims.generateFrameNumbers('hank_big', { start: 1, end: 4 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'hank_big_jump',
      frames: this.anims.generateFrameNumbers('hank_big', { start: 5, end: 5 }),
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'hank_big_fall',
      frames: this.anims.generateFrameNumbers('hank_big', { start: 6, end: 6 }),
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'hank_big_hurt',
      frames: this.anims.generateFrameNumbers('hank_big', { start: 7, end: 7 }),
      frameRate: 1,
      repeat: -1
    });
  }

  private generateHankSudo(): void {
    // golden sudo Hank - 128×32
    const g = this.make.graphics({ x: 0, y: 0 }, false);

    const drawSudo = (x: number, legLeft: number, legRight: number, armPhase: number) => {
      // glow aura
      g.fillStyle(0xffaa00, 0.5);
      g.fillRect(x + 1, 0, 14, 32);
      // shoes golden
      g.fillStyle(0xcc8800);
      g.fillRect(x + legLeft - 1, 28, 5, 4);
      g.fillRect(x + legRight - 1, 28, 5, 4);
      // pants gold
      g.fillStyle(0xaa6600);
      g.fillRect(x + 4, 22, 8, 6);
      g.fillRect(x + legLeft, 24, 3, 6);
      g.fillRect(x + legRight, 24, 3, 6);
      // shirt gold
      g.fillStyle(0xffcc00);
      g.fillRect(x + 3, 12, 10, 12);
      // arms
      g.fillStyle(0xffcc00);
      if (armPhase === 0) {
        g.fillRect(x + 13, 13, 2, 7);
        g.fillRect(x + 1, 14, 2, 6);
      } else {
        g.fillRect(x + 14, 12, 2, 6);
        g.fillRect(x + 0, 14, 2, 6);
      }
      // crown/terminal symbol
      g.fillStyle(0xffffff);
      g.fillRect(x + 5, 12, 6, 2);
      g.fillRect(x + 5, 13, 2, 2);
      // head golden glow
      g.fillStyle(0xffdd99);
      g.fillRect(x + 3, 2, 10, 10);
      // hair
      g.fillStyle(0xcc8800);
      g.fillRect(x + 3, 2, 10, 2);
      // golden glasses
      g.fillStyle(0xffaa00);
      g.fillRect(x + 5, 6, 3, 1);
      g.fillRect(x + 9, 6, 3, 1);
      g.fillRect(x + 8, 6, 1, 1);
      // $ symbol on shirt
      g.fillStyle(0xffffff);
      g.fillRect(x + 7, 15, 1, 6);
      g.fillRect(x + 6, 15, 3, 2);
      g.fillRect(x + 6, 17, 3, 2);
      g.fillRect(x + 6, 19, 3, 2);
    };

    g.clear();
    drawSudo(0, 5, 9, 0);
    drawSudo(16, 3, 10, 1);
    drawSudo(32, 4, 9, 0);
    drawSudo(48, 5, 8, 1);
    drawSudo(64, 5, 9, 0);
    // jump
    drawSudo(80, 2, 10, 1);
    // fall
    drawSudo(96, 5, 9, 0);
    // hurt flash
    drawSudo(112, 3, 11, 1);

    g.generateTexture('hank_sudo', 128, 32);
    g.destroy();

    this.anims.create({
      key: 'hank_sudo_idle',
      frames: this.anims.generateFrameNumbers('hank_sudo', { start: 0, end: 0 }),
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'hank_sudo_run',
      frames: this.anims.generateFrameNumbers('hank_sudo', { start: 1, end: 4 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'hank_sudo_jump',
      frames: this.anims.generateFrameNumbers('hank_sudo', { start: 5, end: 5 }),
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'hank_sudo_fall',
      frames: this.anims.generateFrameNumbers('hank_sudo', { start: 6, end: 6 }),
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'hank_sudo_hurt',
      frames: this.anims.generateFrameNumbers('hank_sudo', { start: 7, end: 7 }),
      frameRate: 1,
      repeat: -1
    });
  }

  private generateTileset(): void {
    // 10 tiles × 16px wide × 16px tall = 160×16
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    // 0: transparent (empty)
    // nothing

    // 1: ground (dark gray with texture)
    g.fillStyle(0x4a4a4a);
    g.fillRect(16, 0, 16, 16);
    g.fillStyle(0x3a3a3a);
    g.fillRect(16, 0, 16, 2);
    g.fillStyle(0x5a5a5a);
    g.fillRect(17, 3, 2, 2);
    g.fillRect(22, 6, 2, 2);
    g.fillRect(27, 2, 2, 2);
    g.fillStyle(0x2a2a2a);
    g.fillRect(16, 14, 16, 2);

    // 2: brick (blue-gray)
    g.fillStyle(0x6b7fa3);
    g.fillRect(32, 0, 16, 16);
    g.fillStyle(0x5a6e92);
    // brick pattern
    g.fillRect(32, 0, 16, 1);
    g.fillRect(32, 7, 16, 1);
    g.fillRect(32, 8, 16, 1);
    g.fillRect(32, 15, 16, 1);
    g.fillRect(40, 1, 1, 6);
    g.fillRect(36, 9, 1, 6);
    g.fillStyle(0x7a8eb2);
    g.fillRect(33, 2, 6, 4);
    g.fillRect(41, 2, 6, 4);
    g.fillRect(33, 10, 3, 4);
    g.fillRect(37, 10, 4, 4);
    g.fillRect(42, 10, 5, 4);

    // 3: question block (yellow with ?)
    g.fillStyle(0xf5c842);
    g.fillRect(48, 0, 16, 16);
    g.fillStyle(0xc9a030);
    g.fillRect(48, 0, 16, 1);
    g.fillRect(48, 15, 16, 1);
    g.fillRect(48, 0, 1, 16);
    g.fillRect(63, 0, 1, 16);
    g.fillStyle(0xffffff);
    // ? shape
    g.fillRect(54, 3, 4, 1);
    g.fillRect(57, 4, 1, 3);
    g.fillRect(54, 7, 3, 1);
    g.fillRect(54, 9, 3, 2);
    g.fillStyle(0xf5c842);
    g.fillRect(55, 4, 2, 3);

    // 4: used block (gray)
    g.fillStyle(0x888888);
    g.fillRect(64, 0, 16, 16);
    g.fillStyle(0x666666);
    g.fillRect(64, 0, 16, 1);
    g.fillRect(64, 15, 16, 1);
    g.fillRect(64, 0, 1, 16);
    g.fillRect(79, 0, 1, 16);

    // 5: platform (brown wooden look)
    g.fillStyle(0x8b6914);
    g.fillRect(80, 0, 16, 6);
    g.fillStyle(0xaa8833);
    g.fillRect(80, 0, 16, 3);
    g.fillStyle(0x6a5010);
    g.fillRect(80, 3, 16, 1);
    g.fillStyle(0x9a7822);
    g.fillRect(81, 1, 3, 1);
    g.fillRect(86, 1, 4, 1);
    g.fillRect(91, 1, 3, 1);

    // 6: spike/cable (black hazard)
    g.fillStyle(0x222222);
    g.fillRect(96, 8, 16, 8);
    g.fillStyle(0xdd2222);
    // spikes
    for (let i = 0; i < 4; i++) {
      g.fillTriangle(
        96 + i * 4, 8,
        96 + i * 4 + 2, 0,
        96 + i * 4 + 4, 8
      );
    }
    g.fillStyle(0xaa1111);
    g.fillRect(96, 6, 16, 2);

    // 7: VPN tunnel (purple)
    g.fillStyle(0x8b44cc);
    g.fillRect(112, 0, 16, 16);
    g.fillStyle(0x6622aa);
    g.fillRect(113, 1, 14, 14);
    g.fillStyle(0xaa66ee);
    g.fillRect(114, 2, 3, 3);
    g.fillRect(121, 2, 3, 3);
    g.fillStyle(0xffffff);
    g.fillRect(116, 6, 4, 4);
    g.fillStyle(0x8b44cc);
    g.fillRect(117, 7, 2, 2);
    // VPN arrow
    g.fillStyle(0xffffff);
    g.fillRect(117, 11, 2, 3);
    g.fillRect(115, 12, 6, 1);

    // 8: checkpoint (green flag)
    g.fillStyle(0x22cc44);
    g.fillRect(128, 0, 16, 16);
    g.fillStyle(0x119933);
    g.fillRect(128, 14, 16, 2);
    g.fillStyle(0xffffff);
    // flag pole
    g.fillRect(132, 2, 1, 12);
    // flag
    g.fillStyle(0xffcc00);
    g.fillRect(133, 2, 5, 3);
    g.fillRect(133, 5, 4, 2);
    // git icon (G)
    g.fillStyle(0xff6600);
    g.fillRect(135, 9, 4, 4);
    g.fillStyle(0x22cc44);
    g.fillRect(136, 10, 2, 2);
    g.fillRect(136, 11, 3, 1);

    // 9: goal clock
    g.fillStyle(0xdddddd);
    g.fillRect(144, 0, 16, 16);
    g.fillStyle(0xbbbbbb);
    g.fillRect(145, 1, 14, 14);
    g.fillStyle(0xffffff);
    // clock face
    g.fillRect(148, 3, 8, 10);
    g.fillStyle(0x333333);
    // clock border
    g.fillRect(148, 3, 8, 1);
    g.fillRect(148, 12, 8, 1);
    g.fillRect(148, 3, 1, 10);
    g.fillRect(155, 3, 1, 10);
    // clock hands
    g.fillStyle(0x111111);
    g.fillRect(151, 5, 1, 4);
    g.fillRect(151, 8, 3, 1);
    // 17:00 marks
    g.fillStyle(0xcc2222);
    g.fillRect(154, 4, 1, 2);

    g.generateTexture('tileset', 160, 16);
    g.destroy();
  }

  private generateTicket(): void {
    // 2 frames × 16px wide × 16px tall = 32×16
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    // Frame 0: ticket walking right leg up
    // body (ticket paper)
    g.fillStyle(0x22aa44);
    g.fillRect(2, 2, 12, 10);
    g.fillStyle(0x119933);
    g.fillRect(2, 2, 12, 1);
    // ticket text lines
    g.fillStyle(0xffffff);
    g.fillRect(4, 4, 8, 1);
    g.fillRect(4, 6, 6, 1);
    g.fillRect(4, 8, 7, 1);
    // angry eyes
    g.fillStyle(0x111111);
    g.fillRect(4, 3, 2, 2);
    g.fillRect(10, 3, 2, 2);
    g.fillStyle(0xff2222);
    g.fillRect(3, 3, 1, 1);
    g.fillRect(12, 3, 1, 1);
    // legs
    g.fillStyle(0x116622);
    g.fillRect(4, 12, 3, 3);
    g.fillRect(9, 11, 3, 4);
    g.fillStyle(0x333333);
    g.fillRect(3, 14, 4, 2);
    g.fillRect(9, 14, 4, 2);

    // Frame 1: left leg up
    g.fillStyle(0x22aa44);
    g.fillRect(18, 2, 12, 10);
    g.fillStyle(0x119933);
    g.fillRect(18, 2, 12, 1);
    g.fillStyle(0xffffff);
    g.fillRect(20, 4, 8, 1);
    g.fillRect(20, 6, 6, 1);
    g.fillRect(20, 8, 7, 1);
    g.fillStyle(0x111111);
    g.fillRect(20, 3, 2, 2);
    g.fillRect(26, 3, 2, 2);
    g.fillStyle(0xff2222);
    g.fillRect(19, 3, 1, 1);
    g.fillRect(28, 3, 1, 1);
    g.fillStyle(0x116622);
    g.fillRect(20, 11, 3, 4);
    g.fillRect(25, 12, 3, 3);
    g.fillStyle(0x333333);
    g.fillRect(19, 14, 4, 2);
    g.fillRect(25, 14, 4, 2);

    g.generateTexture('ticket', 32, 16);
    g.destroy();

    this.anims.create({
      key: 'ticket_walk',
      frames: this.anims.generateFrameNumbers('ticket', { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1
    });
  }

  private generatePrinter(): void {
    // 1 frame 24×24
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    // printer body
    g.fillStyle(0x999999);
    g.fillRect(1, 6, 22, 16);
    g.fillStyle(0x777777);
    g.fillRect(1, 6, 22, 2);
    g.fillRect(1, 20, 22, 2);
    g.fillStyle(0xbbbbbb);
    g.fillRect(3, 9, 18, 8);
    // paper slot
    g.fillStyle(0x555555);
    g.fillRect(3, 13, 18, 2);
    // paper coming out
    g.fillStyle(0xffffff);
    g.fillRect(5, 0, 14, 8);
    g.fillStyle(0x888888);
    g.fillRect(5, 8, 14, 1);
    // paper lines
    g.fillStyle(0xcccccc);
    g.fillRect(7, 2, 10, 1);
    g.fillRect(7, 4, 8, 1);
    g.fillRect(7, 6, 9, 1);
    // power light
    g.fillStyle(0x22ff22);
    g.fillRect(18, 9, 2, 2);
    // logo
    g.fillStyle(0x333333);
    g.fillRect(4, 9, 5, 3);
    // feet/base
    g.fillStyle(0x666666);
    g.fillRect(2, 22, 8, 2);
    g.fillRect(14, 22, 8, 2);

    g.generateTexture('printer', 24, 24);
    g.destroy();
  }

  private generatePhishingMail(): void {
    // 2 frames × 16 wide × 16 tall = 32×16
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    // Frame 0: wings up
    g.fillStyle(0xcc2222);
    g.fillRect(2, 4, 12, 9);
    g.fillStyle(0xaa1111);
    // envelope flap
    g.fillRect(2, 4, 12, 1);
    g.fillRect(8, 4, 1, 3);
    g.fillRect(2, 5, 1, 8);
    g.fillRect(13, 5, 1, 8);
    // envelope lines
    g.fillStyle(0xff4444);
    g.fillRect(3, 6, 4, 3);
    g.fillRect(9, 6, 4, 3);
    g.fillStyle(0xffffff);
    g.fillRect(5, 7, 2, 1);
    g.fillRect(10, 7, 2, 1);
    // skull/evil face
    g.fillStyle(0xffffff);
    g.fillRect(5, 5, 2, 2);
    g.fillRect(9, 5, 2, 2);
    g.fillStyle(0xcc2222);
    g.fillRect(6, 5, 1, 1);
    g.fillRect(10, 5, 1, 1);
    // wings up position
    g.fillStyle(0xff6666);
    g.fillRect(0, 1, 2, 5);
    g.fillRect(14, 1, 2, 5);
    g.fillStyle(0xcc4444);
    g.fillRect(0, 2, 1, 4);
    g.fillRect(15, 2, 1, 4);

    // Frame 1: wings down
    g.fillStyle(0xcc2222);
    g.fillRect(18, 4, 12, 9);
    g.fillStyle(0xaa1111);
    g.fillRect(18, 4, 12, 1);
    g.fillRect(24, 4, 1, 3);
    g.fillRect(18, 5, 1, 8);
    g.fillRect(29, 5, 1, 8);
    g.fillStyle(0xff4444);
    g.fillRect(19, 6, 4, 3);
    g.fillRect(25, 6, 4, 3);
    g.fillStyle(0xffffff);
    g.fillRect(21, 7, 2, 1);
    g.fillRect(26, 7, 2, 1);
    g.fillStyle(0xffffff);
    g.fillRect(21, 5, 2, 2);
    g.fillRect(25, 5, 2, 2);
    g.fillStyle(0xcc2222);
    g.fillRect(22, 5, 1, 1);
    g.fillRect(26, 5, 1, 1);
    // wings down
    g.fillStyle(0xff6666);
    g.fillRect(16, 7, 2, 5);
    g.fillRect(30, 7, 2, 5);
    g.fillStyle(0xcc4444);
    g.fillRect(17, 8, 1, 4);
    g.fillRect(30, 8, 1, 4);

    g.generateTexture('phishing_mail', 32, 16);
    g.destroy();

    this.anims.create({
      key: 'phishing_fly',
      frames: this.anims.generateFrameNumbers('phishing_mail', { start: 0, end: 1 }),
      frameRate: 8,
      repeat: -1
    });
  }

  private generateClumsyUser(): void {
    // 2 frames × 16 wide × 24 tall = 32×24
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    const drawUser = (x: number, armUp: boolean) => {
      // shoes
      g.fillStyle(0x8B4513);
      g.fillRect(x + 2, 20, 5, 4);
      g.fillRect(x + 9, 20, 5, 4);
      // pants
      g.fillStyle(0x555577);
      g.fillRect(x + 3, 14, 10, 8);
      g.fillRect(x + 3, 18, 4, 4);
      g.fillRect(x + 9, 18, 4, 4);
      // shirt (random employee look)
      g.fillStyle(0xcc8844);
      g.fillRect(x + 2, 8, 12, 8);
      g.fillStyle(0xbb7733);
      g.fillRect(x + 2, 8, 12, 2);
      // coffee cup in hand
      if (armUp) {
        g.fillStyle(0xcc8844);
        g.fillRect(x + 13, 7, 2, 5);
        g.fillStyle(0xdddddd);
        g.fillRect(x + 13, 7, 3, 4);
        g.fillStyle(0x663300);
        g.fillRect(x + 14, 8, 1, 2);
        g.fillStyle(0xffffff);
        g.fillRect(x + 14, 10, 2, 1);
        // coffee splash!
        g.fillStyle(0x663300);
        g.fillRect(x + 12, 5, 2, 2);
        g.fillRect(x + 15, 4, 2, 2);
        g.fillRect(x + 13, 3, 1, 2);
        g.fillStyle(0xcc8844);
        g.fillRect(x + 1, 10, 2, 5);
      } else {
        g.fillStyle(0xcc8844);
        g.fillRect(x + 13, 9, 2, 6);
        g.fillStyle(0xdddddd);
        g.fillRect(x + 13, 9, 3, 4);
        g.fillStyle(0x663300);
        g.fillRect(x + 14, 10, 1, 2);
        g.fillStyle(0xcc8844);
        g.fillRect(x + 1, 9, 2, 6);
      }
      // head
      g.fillStyle(0xffcc99);
      g.fillRect(x + 3, 1, 10, 8);
      g.fillStyle(0x664422);
      g.fillRect(x + 3, 1, 10, 2);
      // worried eyes
      g.fillStyle(0x333333);
      g.fillRect(x + 5, 4, 2, 2);
      g.fillRect(x + 9, 4, 2, 2);
      // sweat drop
      g.fillStyle(0x4488ff);
      g.fillRect(x + 11, 2, 1, 2);
      // open mouth
      g.fillStyle(0xcc4444);
      g.fillRect(x + 6, 7, 4, 1);
    };

    drawUser(0, true);
    drawUser(16, false);

    g.generateTexture('clumsy_user', 32, 24);
    g.destroy();

    this.anims.create({
      key: 'clumsy_walk',
      frames: this.anims.generateFrameNumbers('clumsy_user', { start: 0, end: 1 }),
      frameRate: 4,
      repeat: -1
    });
  }

  private generatePowerUps(): void {
    const g = this.make.graphics({ x: 0, y: 0 }, false);

    // Coffee cup (small→big)
    g.clear();
    // cup body
    g.fillStyle(0xdddddd);
    g.fillRect(2, 4, 12, 10);
    g.fillStyle(0xbbbbbb);
    g.fillRect(2, 4, 12, 2);
    g.fillRect(2, 12, 12, 2);
    // handle
    g.fillStyle(0xbbbbbb);
    g.fillRect(13, 6, 2, 1);
    g.fillRect(14, 7, 1, 3);
    g.fillRect(13, 10, 2, 1);
    // coffee
    g.fillStyle(0x663300);
    g.fillRect(3, 5, 10, 8);
    // steam
    g.fillStyle(0xcccccc);
    g.fillRect(5, 1, 1, 3);
    g.fillRect(7, 0, 1, 3);
    g.fillRect(9, 1, 1, 3);
    g.fillStyle(0x996633);
    g.fillRect(4, 6, 8, 6);
    g.generateTexture('coffee', 16, 16);

    // sudo flower (terminal prompt)
    g.clear();
    // terminal base
    g.fillStyle(0x222222);
    g.fillRect(1, 3, 14, 12);
    g.fillStyle(0x00ff00);
    // $ prompt
    g.fillRect(2, 5, 1, 5);
    g.fillRect(2, 5, 4, 1);
    g.fillRect(2, 7, 4, 1);
    g.fillRect(2, 9, 4, 1);
    // cursor
    g.fillRect(7, 9, 3, 1);
    g.fillRect(11, 5, 2, 7);
    // flower petals (sudo flower)
    g.fillStyle(0x00ff88);
    g.fillRect(0, 0, 3, 3);
    g.fillRect(13, 0, 3, 3);
    g.fillRect(0, 13, 3, 3);
    g.fillRect(13, 13, 3, 3);
    g.fillStyle(0x00cc66);
    g.fillRect(1, 1, 1, 1);
    g.fillRect(14, 1, 1, 1);
    g.fillRect(1, 14, 1, 1);
    g.fillRect(14, 14, 1, 1);
    g.generateTexture('sudo_flower', 16, 16);

    // Energy drink (blinkende Dose)
    g.clear();
    g.fillStyle(0x0055cc);
    g.fillRect(3, 1, 10, 14);
    g.fillStyle(0x0033aa);
    g.fillRect(3, 1, 10, 2);
    g.fillRect(3, 13, 10, 2);
    // label
    g.fillStyle(0xffcc00);
    g.fillRect(4, 4, 8, 7);
    g.fillStyle(0xff6600);
    g.fillRect(4, 5, 8, 1);
    g.fillRect(4, 9, 8, 1);
    // lightning bolt
    g.fillStyle(0xffffff);
    g.fillRect(8, 5, 2, 2);
    g.fillRect(6, 7, 4, 1);
    g.fillRect(7, 8, 2, 2);
    // top/bottom caps
    g.fillStyle(0x8888aa);
    g.fillRect(4, 0, 8, 1);
    g.fillRect(4, 15, 8, 1);
    g.generateTexture('energy_drink', 16, 16);

    // Backup tape (+1 life)
    g.clear();
    g.fillStyle(0x444444);
    g.fillRect(1, 2, 14, 12);
    g.fillStyle(0x222222);
    g.fillRect(1, 2, 14, 1);
    g.fillRect(1, 13, 14, 1);
    // reels
    g.fillStyle(0x888888);
    g.fillRect(3, 4, 4, 4);
    g.fillRect(9, 4, 4, 4);
    g.fillStyle(0x555555);
    g.fillRect(4, 5, 2, 2);
    g.fillRect(10, 5, 2, 2);
    // tape window
    g.fillStyle(0x2233aa);
    g.fillRect(3, 9, 10, 3);
    g.fillStyle(0x3344cc);
    g.fillRect(4, 10, 8, 1);
    // label
    g.fillStyle(0xffffff);
    g.fillRect(2, 3, 12, 1);
    g.fillStyle(0xcccccc);
    g.fillRect(3, 3, 2, 1);
    g.generateTexture('backup_tape', 16, 16);

    g.destroy();

    // Animate energy drink blinking
    this.anims.create({
      key: 'energy_drink_blink',
      frames: [
        { key: 'energy_drink', frame: 0 }
      ],
      frameRate: 4,
      repeat: -1
    });
  }

  private generateDocPage(): void {
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    // small white page
    g.fillStyle(0xffffff);
    g.fillRect(2, 1, 11, 13);
    g.fillStyle(0xdddddd);
    g.fillRect(2, 1, 11, 1);
    g.fillRect(2, 13, 11, 1);
    g.fillRect(2, 1, 1, 13);
    g.fillRect(12, 1, 1, 13);
    // dog-ear
    g.fillStyle(0xcccccc);
    g.fillRect(10, 1, 3, 3);
    g.fillStyle(0xffffff);
    g.fillRect(10, 1, 2, 2);
    // text lines
    g.fillStyle(0x888888);
    g.fillRect(4, 4, 6, 1);
    g.fillRect(4, 6, 7, 1);
    g.fillRect(4, 8, 5, 1);
    g.fillRect(4, 10, 6, 1);
    g.fillRect(4, 12, 4, 1);

    g.generateTexture('doc_page', 16, 16);
    g.destroy();
  }

  private generateProjectiles(): void {
    const g = this.make.graphics({ x: 0, y: 0 }, false);

    // kill9 projectile (orange fireball) 8×8
    g.clear();
    g.fillStyle(0xff6600);
    g.fillRect(1, 1, 6, 6);
    g.fillStyle(0xff9900);
    g.fillRect(2, 2, 4, 4);
    g.fillStyle(0xffcc00);
    g.fillRect(3, 3, 2, 2);
    g.fillStyle(0xff3300);
    g.fillRect(0, 2, 1, 4);
    g.fillRect(7, 2, 1, 4);
    g.fillRect(2, 0, 4, 1);
    g.fillRect(2, 7, 4, 1);
    g.generateTexture('kill9_proj', 8, 8);

    // printer bullet (paper projectile) 8×8
    g.clear();
    g.fillStyle(0xffffff);
    g.fillRect(1, 2, 6, 5);
    g.fillStyle(0xdddddd);
    g.fillRect(1, 2, 6, 1);
    g.fillRect(1, 6, 6, 1);
    // crumpled look
    g.fillStyle(0xcccccc);
    g.fillRect(2, 3, 2, 1);
    g.fillRect(5, 4, 1, 2);
    g.fillRect(3, 5, 2, 1);
    g.generateTexture('printer_bullet', 8, 8);

    g.destroy();
  }

  private generateStars(): void {
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    // star for energy drink effect
    g.fillStyle(0xffff00);
    g.fillRect(7, 0, 2, 16);
    g.fillRect(0, 7, 16, 2);
    g.fillRect(2, 2, 2, 2);
    g.fillRect(12, 2, 2, 2);
    g.fillRect(2, 12, 2, 2);
    g.fillRect(12, 12, 2, 2);
    g.fillStyle(0xffffff);
    g.fillRect(7, 7, 2, 2);

    g.generateTexture('stars', 16, 16);
    g.destroy();
  }

  private generateExplosion(): void {
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    g.fillStyle(0xffcc00);
    g.fillRect(4, 0, 8, 4);
    g.fillRect(0, 4, 4, 8);
    g.fillRect(12, 4, 4, 8);
    g.fillRect(4, 12, 8, 4);
    g.fillStyle(0xff6600);
    g.fillRect(4, 4, 8, 8);
    g.fillStyle(0xffffff);
    g.fillRect(6, 6, 4, 4);

    g.generateTexture('explosion', 16, 16);
    g.destroy();
  }

  private generateBackground(): void {
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    // office background (480×270)
    // sky/ceiling
    g.fillStyle(0xf0f0e0);
    g.fillRect(0, 0, 480, 270);
    // ceiling tiles
    g.fillStyle(0xe0e0d0);
    for (let x = 0; x < 480; x += 32) {
      g.fillRect(x, 0, 31, 16);
    }
    // fluorescent lights
    g.fillStyle(0xffffee);
    for (let x = 16; x < 480; x += 96) {
      g.fillRect(x, 2, 48, 8);
      g.fillStyle(0xccccaa);
      g.fillRect(x, 2, 48, 1);
      g.fillStyle(0xffffee);
    }
    // wall (back)
    g.fillStyle(0xd8d8cc);
    g.fillRect(0, 16, 480, 140);
    // wall decoration - windows
    for (let x = 20; x < 480; x += 120) {
      g.fillStyle(0x88aacc);
      g.fillRect(x, 25, 64, 48);
      g.fillStyle(0xaaccee);
      g.fillRect(x + 2, 27, 28, 20);
      g.fillRect(x + 34, 27, 28, 20);
      g.fillRect(x + 2, 51, 28, 20);
      g.fillRect(x + 34, 51, 28, 20);
      g.fillStyle(0xffffff);
      g.fillRect(x + 3, 28, 8, 6);
      g.fillRect(x + 35, 28, 8, 6);
    }
    // floor area (carpet)
    g.fillStyle(0x558866);
    g.fillRect(0, 160, 480, 110);
    // carpet pattern
    g.fillStyle(0x447755);
    for (let x = 0; x < 480; x += 16) {
      for (let y = 160; y < 270; y += 16) {
        if ((x + y) % 32 === 0) {
          g.fillRect(x, y, 16, 16);
        }
      }
    }

    g.generateTexture('background', 480, 270);
    g.destroy();
  }

  private generateBuggyCode(): void {
    // 2 frames × 16×16 = 32×16 — red glitchy butterfly
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    const drawBuggy = (ox: number, wingUp: boolean) => {
      // Body
      g.fillStyle(0xcc0000);
      g.fillRect(ox + 6, 4, 4, 8);
      // Head
      g.fillStyle(0xff2222);
      g.fillRect(ox + 5, 2, 6, 4);
      // Evil eyes
      g.fillStyle(0xffff00);
      g.fillRect(ox + 5, 3, 2, 2);
      g.fillRect(ox + 9, 3, 2, 2);
      // Wings
      g.fillStyle(0xff4444);
      if (wingUp) {
        g.fillRect(ox + 0, 2, 6, 4);
        g.fillRect(ox + 10, 2, 6, 4);
        g.fillStyle(0xff8888);
        g.fillRect(ox + 1, 3, 3, 2);
        g.fillRect(ox + 12, 3, 3, 2);
      } else {
        g.fillRect(ox + 0, 6, 6, 5);
        g.fillRect(ox + 10, 6, 6, 5);
        g.fillStyle(0xff8888);
        g.fillRect(ox + 1, 7, 3, 3);
        g.fillRect(ox + 12, 7, 3, 3);
      }
      // Glitch artifacts
      g.fillStyle(0xffff00);
      g.fillRect(ox + 2, 1, 1, 1);
      g.fillRect(ox + 13, 12, 1, 1);
    };

    drawBuggy(0, true);
    drawBuggy(16, false);

    g.generateTexture('buggy_code', 32, 16);
    g.destroy();

    this.anims.create({
      key: 'buggy_fly',
      frames: this.anims.generateFrameNumbers('buggy_code', { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1
    });
  }

  private generateCeo(): void {
    // 2 frames × 24×32 = 48×32
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    const drawCeo = (ox: number, armUp: boolean) => {
      // Suit (dark, expensive)
      g.fillStyle(0x1a1a2e);
      g.fillRect(ox + 2, 12, 20, 16);
      // Tie (gold)
      g.fillStyle(0xffcc00);
      g.fillRect(ox + 10, 12, 4, 10);
      g.fillRect(ox + 9, 13, 6, 2);
      // Shirt
      g.fillStyle(0xffffff);
      g.fillRect(ox + 8, 12, 8, 4);
      // Arms
      g.fillStyle(0x1a1a2e);
      if (armUp) {
        g.fillRect(ox + 0, 11, 3, 8);
        g.fillRect(ox + 21, 10, 3, 9);
      } else {
        g.fillRect(ox + 0, 13, 3, 8);
        g.fillRect(ox + 21, 13, 3, 8);
      }
      // Hands
      g.fillStyle(0xffcc99);
      g.fillRect(ox + 0, armUp ? 18 : 20, 4, 3);
      g.fillRect(ox + 20, armUp ? 17 : 20, 4, 3);
      // Pants
      g.fillStyle(0x0a0a1a);
      g.fillRect(ox + 2, 26, 20, 4);
      g.fillRect(ox + 2, 28, 8, 4);
      g.fillRect(ox + 14, 28, 8, 4);
      // Shoes
      g.fillStyle(0x111111);
      g.fillRect(ox + 1, 30, 9, 2);
      g.fillRect(ox + 14, 30, 9, 2);
      // Head
      g.fillStyle(0xffcc99);
      g.fillRect(ox + 5, 2, 14, 12);
      // Hair (grey, distinguished)
      g.fillStyle(0x888888);
      g.fillRect(ox + 5, 2, 14, 3);
      g.fillRect(ox + 5, 2, 2, 5);
      g.fillRect(ox + 17, 2, 2, 5);
      // Eyes (cold)
      g.fillStyle(0x0000cc);
      g.fillRect(ox + 7, 7, 3, 2);
      g.fillRect(ox + 14, 7, 3, 2);
      // Power-smile
      g.fillStyle(0xcc4444);
      g.fillRect(ox + 8, 11, 8, 1);
      // Smartphone / meeting request weapon
      g.fillStyle(0x333333);
      g.fillRect(ox + (armUp ? 20 : 20), armUp ? 13 : 17, 3, 5);
      g.fillStyle(0x4488ff);
      g.fillRect(ox + 21, armUp ? 14 : 18, 1, 3);
    };

    drawCeo(0, false);
    drawCeo(24, true);

    g.generateTexture('ceo', 48, 32);
    g.destroy();

    this.anims.create({
      key: 'ceo_idle',
      frames: this.anims.generateFrameNumbers('ceo', { start: 0, end: 0 }),
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'ceo_walk',
      frames: this.anims.generateFrameNumbers('ceo', { start: 0, end: 1 }),
      frameRate: 4,
      repeat: -1
    });

    // Meeting request projectile 12×8
    const gp = this.make.graphics({ x: 0, y: 0 }, false);
    gp.clear();
    gp.fillStyle(0xffffff);
    gp.fillRect(0, 1, 12, 6);
    gp.fillStyle(0xcccccc);
    gp.fillRect(0, 1, 12, 1);
    gp.fillRect(0, 6, 12, 1);
    gp.fillStyle(0x0044cc);
    gp.fillRect(1, 2, 10, 1);
    gp.fillRect(1, 4, 8, 1);
    // "MTG" text suggestion
    gp.fillStyle(0xcc2222);
    gp.fillRect(2, 3, 2, 1);
    gp.fillRect(5, 3, 2, 1);
    gp.generateTexture('meeting_proj', 12, 8);
    gp.destroy();
  }

  private generateBackgroundServerroom(): void {
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    // Dark blue-grey server room
    g.fillStyle(0x0d1117);
    g.fillRect(0, 0, 480, 270);

    // Ceiling — cable trays
    g.fillStyle(0x1a2030);
    g.fillRect(0, 0, 480, 20);
    g.fillStyle(0x2a3040);
    for (let x = 0; x < 480; x += 48) {
      g.fillRect(x, 5, 32, 8);
    }
    // Cable colors
    const cableColors = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff];
    for (let x = 0; x < 480; x += 16) {
      const c = cableColors[Math.floor(x / 16) % cableColors.length];
      g.fillStyle(c);
      g.fillRect(x, 8, 2, 12);
    }

    // Floor (raised floor tiles)
    g.fillStyle(0x1e2530);
    g.fillRect(0, 220, 480, 50);
    g.fillStyle(0x252d3a);
    for (let x = 0; x < 480; x += 32) {
      g.fillRect(x, 220, 31, 50);
    }
    g.fillStyle(0x1a2030);
    for (let x = 0; x < 480; x += 32) {
      g.fillRect(x, 220, 32, 1);
    }

    // Server racks in background
    g.fillStyle(0x1e2a3a);
    for (let x = 30; x < 480; x += 90) {
      g.fillRect(x, 20, 50, 200);
      g.fillStyle(0x0a1220);
      g.fillRect(x + 2, 22, 46, 196);
      // Blinking lights
      for (let y = 30; y < 210; y += 10) {
        g.fillStyle((x + y) % 30 === 0 ? 0xff2222 : (x + y) % 20 === 0 ? 0xffaa00 : 0x22ff44);
        g.fillRect(x + 4, y, 2, 3);
        g.fillRect(x + 8, y, 2, 3);
      }
      g.fillStyle(0x1e2a3a);
    }

    // Emergency strip lighting (floor level)
    g.fillStyle(0x004400);
    for (let x = 0; x < 480; x += 20) {
      g.fillRect(x, 218, 10, 2);
    }

    g.generateTexture('background_serverroom', 480, 270);
    g.destroy();
  }

  private generateBackgroundDatacenter(): void {
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    // Dark red emergency lighting
    g.fillStyle(0x1a0000);
    g.fillRect(0, 0, 480, 270);

    // Ceiling
    g.fillStyle(0x2a0000);
    g.fillRect(0, 0, 480, 18);
    // Emergency light strips
    g.fillStyle(0xcc0000);
    for (let x = 0; x < 480; x += 60) {
      g.fillRect(x, 2, 30, 4);
    }

    // Floor
    g.fillStyle(0x200000);
    g.fillRect(0, 225, 480, 45);
    // Floor grid
    g.fillStyle(0x2a0000);
    for (let x = 0; x < 480; x += 24) {
      g.fillRect(x, 225, 1, 45);
    }
    for (let y = 225; y < 270; y += 24) {
      g.fillRect(0, y, 480, 1);
    }

    // Server racks — all with red emergency light glow
    for (let x = 20; x < 480; x += 70) {
      g.fillStyle(0x300000);
      g.fillRect(x, 18, 45, 207);
      g.fillStyle(0x1a0000);
      g.fillRect(x + 2, 20, 41, 203);
      // Red blinking status lights
      for (let y = 28; y < 215; y += 8) {
        const on = (x + y) % 16 < 8;
        g.fillStyle(on ? 0xff0000 : 0x440000);
        g.fillRect(x + 3, y, 3, 2);
        g.fillStyle(on ? 0xcc4400 : 0x330000);
        g.fillRect(x + 8, y, 3, 2);
      }
    }

    // Warning signs
    g.fillStyle(0xcc8800);
    for (let x = 55; x < 480; x += 120) {
      // Triangle warning
      g.fillTriangle(x, 200, x + 16, 200, x + 8, 185);
      g.fillStyle(0x1a0000);
      g.fillRect(x + 7, 190, 2, 6);
      g.fillRect(x + 7, 198, 2, 2);
      g.fillStyle(0xcc8800);
    }

    g.generateTexture('background_datacenter', 480, 270);
    g.destroy();
  }

  private generateBackgroundMid(): void {
    // Mid parallax layer — window frames / partitions (480×270, transparent bg)
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    // Window frames every 120px
    for (let x = 10; x < 480; x += 120) {
      g.fillStyle(0x8899bb, 0.6);
      g.fillRect(x, 30, 70, 90);
      g.fillStyle(0x99aacc, 0.5);
      g.fillRect(x + 2, 32, 30, 40);
      g.fillRect(x + 36, 32, 30, 40);
      g.fillRect(x + 2, 76, 30, 40);
      g.fillRect(x + 36, 76, 30, 40);
      // Light reflection
      g.fillStyle(0xffffff, 0.2);
      g.fillRect(x + 4, 34, 8, 6);
    }

    g.generateTexture('background_mid', 480, 270);
    g.destroy();
  }

  private generateBackgroundNear(): void {
    // Near parallax layer — desk silhouettes (480×270)
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    // Desk silhouettes at bottom
    for (let x = 0; x < 480; x += 110) {
      // Desk surface
      g.fillStyle(0x3a2a10, 0.5);
      g.fillRect(x + 5, 200, 90, 10);
      // Monitor
      g.fillStyle(0x222222, 0.5);
      g.fillRect(x + 10, 175, 40, 26);
      g.fillStyle(0x111111, 0.4);
      g.fillRect(x + 12, 177, 36, 22);
      // Chair
      g.fillStyle(0x333333, 0.4);
      g.fillRect(x + 60, 195, 24, 16);
      g.fillRect(x + 66, 180, 12, 16);
    }

    g.generateTexture('background_near', 480, 270);
    g.destroy();
  }
}
