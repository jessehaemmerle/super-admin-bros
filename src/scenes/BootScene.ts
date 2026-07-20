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
    this.generateVirus();
    this.generateFan();
    this.generateHotfix();
    this.generateCeo();
    this.generateBackgroundServerroom();
    this.generateBackgroundDatacenter();
    this.generateBackgroundCloud();
    this.generateMidNearLayers();

    this.scene.start('MenuScene');
  }

  /**
   * Registers numbered sub-frames on a flat texture produced by generateTexture(),
   * so it can be used as a spritesheet by generateFrameNumbers() / setFrame().
   * Phaser's Graphics.generateTexture() only creates a single __BASE frame, so any
   * animation or setFrame(n) call would otherwise reference a non-existent frame.
   */
  private sliceSheet(key: string, frameW: number, frameH: number): void {
    const tex = this.textures.get(key);
    const src = tex.getSourceImage() as HTMLImageElement | HTMLCanvasElement;
    const cols = Math.max(1, Math.floor(src.width / frameW));
    const rows = Math.max(1, Math.floor(src.height / frameH));
    let idx = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        tex.add(idx++, 0, col * frameW, row * frameH, frameW, frameH);
      }
    }
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
    this.sliceSheet('hank_small', 16, 24);

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
    this.sliceSheet('hank_big', 16, 32);

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
    this.sliceSheet('hank_sudo', 16, 32);

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
    // 12 tiles × 16px wide × 16px tall = 192×16
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    // 0: transparent (empty) — nothing.

    // 1: ground — slate raised-floor panel (neutral across all themes).
    g.fillStyle(0x46505e); g.fillRect(16, 0, 16, 16);          // body
    g.fillStyle(0x5b6675); g.fillRect(16, 0, 16, 3);           // top bevel
    g.fillStyle(0x6d7a8b); g.fillRect(16, 0, 16, 1);           // top highlight
    g.fillStyle(0x363e49); g.fillRect(16, 13, 16, 3);          // bottom shade
    g.fillStyle(0x2b323b); g.fillRect(16, 15, 16, 1);
    // panel studs (interior so they tile seamlessly)
    g.fillStyle(0x5b6675); g.fillRect(19, 6, 2, 2); g.fillRect(27, 6, 2, 2);
    g.fillStyle(0x363e49); g.fillRect(19, 8, 2, 1); g.fillRect(27, 8, 2, 1);

    // 2: brick — masonry with mortar lines + offset courses.
    g.fillStyle(0x9c5a3c); g.fillRect(32, 0, 16, 16);          // brick body
    g.fillStyle(0xb56e4a); g.fillRect(32, 0, 16, 1);           // top highlight
    g.fillStyle(0x6e3c26); g.fillRect(32, 15, 16, 1);          // bottom shade
    g.fillStyle(0x5a3020);                                     // mortar
    g.fillRect(32, 7, 16, 2);                                  // horizontal seam
    g.fillRect(40, 0, 1, 7); g.fillRect(36, 9, 1, 7);          // vertical seams (offset)
    g.fillStyle(0xae6646);                                     // brick face highlights
    g.fillRect(33, 2, 6, 4); g.fillRect(42, 2, 5, 4);
    g.fillRect(33, 10, 2, 4); g.fillRect(38, 10, 7, 4);

    // 3: question block — bright beveled gold with a crisp "?".
    g.fillStyle(0xf2b417); g.fillRect(48, 0, 16, 16);          // gold body
    g.fillStyle(0xffd84a); g.fillRect(48, 0, 16, 2); g.fillRect(48, 0, 2, 16); // light TL
    g.fillStyle(0xb87d0e); g.fillRect(48, 14, 16, 2); g.fillRect(62, 0, 2, 16); // dark BR
    g.fillStyle(0x7a5208);                                     // corner rivets
    g.fillRect(49, 1, 1, 1); g.fillRect(62, 1, 1, 1); g.fillRect(49, 14, 1, 1); g.fillRect(62, 14, 1, 1);
    // "?" — dark drop shadow then white
    g.fillStyle(0x7a5208);
    g.fillRect(54, 4, 6, 2); g.fillRect(58, 5, 2, 3); g.fillRect(55, 8, 3, 2); g.fillRect(55, 11, 3, 2);
    g.fillStyle(0xffffff);
    g.fillRect(53, 3, 6, 2); g.fillRect(57, 4, 2, 3); g.fillRect(54, 7, 3, 2); g.fillRect(54, 10, 3, 2);

    // 4: used block — spent bronze block with center rivet.
    g.fillStyle(0x8a7034); g.fillRect(64, 0, 16, 16);
    g.fillStyle(0xa3884a); g.fillRect(64, 0, 16, 2); g.fillRect(64, 0, 2, 16);
    g.fillStyle(0x5e4c20); g.fillRect(64, 14, 16, 2); g.fillRect(78, 0, 2, 16);
    g.fillStyle(0x5e4c20); g.fillRect(71, 7, 2, 2);

    // 5: platform — one-way metal plank with a bright walk-on edge (top 6px).
    g.fillStyle(0x7a8290); g.fillRect(80, 0, 16, 6);           // plank body
    g.fillStyle(0xbcc6d4); g.fillRect(80, 0, 16, 2);           // bright top surface
    g.fillStyle(0x4c545f); g.fillRect(80, 5, 16, 1);           // underside shadow
    g.fillStyle(0x99a3b1);                                     // rivets
    g.fillRect(82, 3, 2, 1); g.fillRect(88, 3, 2, 1); g.fillRect(93, 3, 2, 1);

    // 6: hazard — red spikes on a dark base with warning stripe.
    g.fillStyle(0x1b1b1f); g.fillRect(96, 7, 16, 9);          // base
    g.fillStyle(0xf0c020); g.fillRect(96, 7, 16, 2);          // warning stripe
    g.fillStyle(0x1b1b1f);
    for (let i = 0; i < 4; i++) g.fillRect(97 + i * 4, 7, 2, 2);
    for (let i = 0; i < 4; i++) {                              // spikes
      g.fillStyle(0xe23a3a);
      g.fillTriangle(96 + i * 4, 7, 96 + i * 4 + 2, 0, 96 + i * 4 + 4, 7);
      g.fillStyle(0xff7a6a);                                  // spike highlight
      g.fillTriangle(96 + i * 4 + 1, 6, 96 + i * 4 + 2, 1, 96 + i * 4 + 2, 6);
    }

    // 7: VPN portal — glowing purple gateway with an up-arrow.
    g.fillStyle(0x2a103f); g.fillRect(112, 0, 16, 16);
    g.fillStyle(0x6a2ab0); g.fillRect(113, 1, 14, 14);
    g.fillStyle(0x9a4ae0); g.fillRect(114, 2, 12, 12);
    g.fillStyle(0xc98bff); g.fillRect(115, 3, 10, 4);          // top glow
    g.fillStyle(0xffffff);                                     // up-arrow
    g.fillRect(119, 5, 2, 7);
    g.fillTriangle(116, 7, 120, 3, 124, 7);

    // 8: checkpoint — green commit flag on a pole.
    g.fillStyle(0xbfc6cf); g.fillRect(135, 1, 2, 14);         // pole
    g.fillStyle(0x8c929b); g.fillRect(133, 14, 6, 2);         // base
    g.fillStyle(0x27c24a); g.fillTriangle(137, 2, 137, 9, 145, 5);  // flag
    g.fillStyle(0x179033); g.fillTriangle(137, 6, 137, 9, 142, 7);  // flag shade
    g.fillStyle(0xffffff); g.fillRect(139, 4, 2, 2);          // check mark dot

    // 9: goal — glowing green EXIT door (Feierabend!).
    g.fillStyle(0x20262f); g.fillRect(144, 0, 16, 16);        // frame
    g.fillStyle(0x1f9f3e); g.fillRect(146, 1, 12, 15);        // door
    g.fillStyle(0x33c659); g.fillRect(146, 1, 12, 2);         // top light
    g.fillStyle(0x14702a); g.fillRect(146, 13, 12, 3);        // bottom shade
    g.fillStyle(0xeafff0); g.fillRect(154, 8, 2, 2);          // knob
    g.fillStyle(0xffffff);                                     // exit arrow →
    g.fillRect(148, 6, 4, 1); g.fillTriangle(151, 4, 151, 8, 154, 6);

    // 10: server rack — solid dark cabinet with status LEDs (Level 2/3 walls).
    g.fillStyle(0x1e2a3a); g.fillRect(160, 0, 16, 16);        // cabinet frame
    g.fillStyle(0x2c3a4e); g.fillRect(160, 0, 16, 1); g.fillRect(160, 0, 1, 16); // light TL
    g.fillStyle(0x121a24); g.fillRect(160, 15, 16, 1); g.fillRect(175, 0, 1, 16); // dark BR
    g.fillStyle(0x0a1220); g.fillRect(162, 2, 12, 12);        // dark front panel
    g.fillStyle(0x1b2430);                                     // rack units
    g.fillRect(163, 3, 10, 3); g.fillRect(163, 7, 10, 3); g.fillRect(163, 11, 10, 3);
    g.fillStyle(0x33dd66);                                     // green LEDs
    g.fillRect(164, 4, 1, 1); g.fillRect(164, 8, 1, 1); g.fillRect(164, 12, 1, 1);
    g.fillStyle(0x44aaff);                                     // blue LEDs
    g.fillRect(166, 4, 1, 1); g.fillRect(166, 12, 1, 1);
    g.fillStyle(0xffaa00); g.fillRect(166, 8, 1, 1);           // amber LED

    // 11: fake wall — same masonry as tile 2 so the secret passage blends in.
    g.fillStyle(0x9c5a3c); g.fillRect(176, 0, 16, 16);
    g.fillStyle(0xb56e4a); g.fillRect(176, 0, 16, 1);
    g.fillStyle(0x6e3c26); g.fillRect(176, 15, 16, 1);
    g.fillStyle(0x5a3020);
    g.fillRect(176, 7, 16, 2);
    g.fillRect(184, 0, 1, 7); g.fillRect(180, 9, 1, 7);
    g.fillStyle(0xae6646);
    g.fillRect(177, 2, 6, 4); g.fillRect(186, 2, 5, 4);
    g.fillRect(177, 10, 2, 4); g.fillRect(182, 10, 7, 4);

    g.generateTexture('tileset', 192, 16);
    g.destroy();
    this.sliceSheet('tileset', 16, 16);
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
    this.sliceSheet('ticket', 16, 16);

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
    this.sliceSheet('phishing_mail', 16, 16);

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
    this.sliceSheet('clumsy_user', 16, 24);

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
    // Office FAR layer (480×270): distant back wall + bright sky windows.
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    // Warm corporate wall with a soft vertical gradient (two bands).
    g.fillStyle(0xe6e3d8); g.fillRect(0, 0, 480, 270);
    g.fillStyle(0xf1efe6); g.fillRect(0, 0, 480, 130);

    // Acoustic-tile ceiling with recessed fluorescent fixtures.
    g.fillStyle(0xd4d1c4); g.fillRect(0, 0, 480, 24);
    g.fillStyle(0xc5c2b4);
    for (let x = 0; x <= 480; x += 40) g.fillRect(x, 0, 1, 24);
    for (let x = 28; x < 480; x += 128) {
      g.fillStyle(0xfffdf0); g.fillRect(x, 7, 60, 7);
      g.fillStyle(0xffffff); g.fillRect(x + 2, 8, 56, 2);
    }

    // Panoramic windows onto a clear blue sky — the bright "Mario" backdrop.
    for (let wx = 26; wx < 480; wx += 156) {
      g.fillStyle(0x97a3b6); g.fillRect(wx - 5, 40, 120, 98);          // outer frame
      g.fillStyle(0x6fb7ec); g.fillRect(wx, 45, 110, 88);             // sky (lower)
      g.fillStyle(0x9ad2f4); g.fillRect(wx, 45, 110, 42);             // sky (upper, lighter)
      // distant skyline silhouettes
      g.fillStyle(0x8fb8d8);
      g.fillRect(wx + 12, 104, 16, 28); g.fillRect(wx + 34, 96, 12, 36);
      g.fillRect(wx + 62, 110, 18, 22); g.fillRect(wx + 86, 100, 14, 32);
      // clouds
      g.fillStyle(0xffffff);
      g.fillRect(wx + 18, 60, 24, 6); g.fillRect(wx + 14, 64, 32, 5);
      g.fillRect(wx + 66, 80, 22, 5); g.fillRect(wx + 62, 84, 30, 5);
      // mullions
      g.fillStyle(0x97a3b6);
      g.fillRect(wx + 53, 45, 4, 88); g.fillRect(wx, 87, 110, 4);
    }

    // Baseboard + faint floor (mostly hidden behind the ground tiles).
    g.fillStyle(0xbab6a8); g.fillRect(0, 150, 480, 5);
    g.fillStyle(0xd2cdbe); g.fillRect(0, 155, 480, 115);

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
    this.sliceSheet('buggy_code', 16, 16);

    this.anims.create({
      key: 'buggy_fly',
      frames: this.anims.generateFrameNumbers('buggy_code', { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1
    });
  }

  private generateVirus(): void {
    // 2 frames × 16×16 = 32×16 — green blob with angry eyes and spikes
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    const drawVirus = (ox: number, squish: boolean) => {
      const top = squish ? 6 : 4;
      // blob body
      g.fillStyle(0x33bb33);
      g.fillRect(ox + 2, top + 2, 12, 14 - top - 2);
      g.fillRect(ox + 3, top, 10, 14 - top);
      // belly highlight
      g.fillStyle(0x55dd55);
      g.fillRect(ox + 4, top + 1, 8, 3);
      // bottom shade
      g.fillStyle(0x1e8a1e);
      g.fillRect(ox + 2, 12, 12, 2);
      // spikes on top
      g.fillStyle(0x1e8a1e);
      g.fillRect(ox + 4, top - 2, 2, 2);
      g.fillRect(ox + 7, top - 2, 2, 2);
      g.fillRect(ox + 10, top - 2, 2, 2);
      // eyes
      g.fillStyle(0xffffff);
      g.fillRect(ox + 4, top + 3, 3, 3);
      g.fillRect(ox + 9, top + 3, 3, 3);
      g.fillStyle(0x111111);
      g.fillRect(ox + 5, top + 4, 2, 2);
      g.fillRect(ox + 10, top + 4, 2, 2);
      // angry mouth
      g.fillStyle(0x0a4a0a);
      g.fillRect(ox + 6, top + 7, 4, 1);
      // feet
      g.fillStyle(0x1e8a1e);
      g.fillRect(ox + 3, 14, 3, 2);
      g.fillRect(ox + 10, 14, 3, 2);
    };

    drawVirus(0, false);
    drawVirus(16, true);

    g.generateTexture('virus', 32, 16);
    g.destroy();
    this.sliceSheet('virus', 16, 16);

    this.anims.create({
      key: 'virus_walk',
      frames: this.anims.generateFrameNumbers('virus', { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1
    });
  }

  private generateFan(): void {
    // 2 frames × 16×16 = 32×16 — server fan with rotating blades
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    const drawFan = (ox: number, diagonal: boolean) => {
      // housing
      g.fillStyle(0x3a4250);
      g.fillRect(ox + 1, 1, 14, 14);
      g.fillStyle(0x4c5666);
      g.fillRect(ox + 1, 1, 14, 2);
      g.fillStyle(0x2a303a);
      g.fillRect(ox + 1, 13, 14, 2);
      // corner screws
      g.fillStyle(0x8a94a4);
      g.fillRect(ox + 2, 2, 1, 1); g.fillRect(ox + 13, 2, 1, 1);
      g.fillRect(ox + 2, 13, 1, 1); g.fillRect(ox + 13, 13, 1, 1);
      // dark opening
      g.fillStyle(0x14181e);
      g.fillRect(ox + 3, 3, 10, 10);
      // blades (two rotation states)
      g.fillStyle(0x9ab0c8);
      if (diagonal) {
        g.fillRect(ox + 4, 4, 3, 3);
        g.fillRect(ox + 9, 4, 3, 3);
        g.fillRect(ox + 4, 9, 3, 3);
        g.fillRect(ox + 9, 9, 3, 3);
      } else {
        g.fillRect(ox + 7, 3, 2, 4);
        g.fillRect(ox + 7, 9, 2, 4);
        g.fillRect(ox + 3, 7, 4, 2);
        g.fillRect(ox + 9, 7, 4, 2);
      }
      // hub
      g.fillStyle(0xd0d8e4);
      g.fillRect(ox + 7, 7, 2, 2);
    };

    drawFan(0, false);
    drawFan(16, true);

    g.generateTexture('fan', 32, 16);
    g.destroy();
    this.sliceSheet('fan', 16, 16);

    this.anims.create({
      key: 'fan_spin',
      frames: this.anims.generateFrameNumbers('fan', { start: 0, end: 1 }),
      frameRate: 12,
      repeat: -1
    });
  }

  private generateHotfix(): void {
    // 16×16 — green patch/bandage with a white plus (rewinds the clock)
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    g.fillStyle(0x1b7a2f);
    g.fillRect(2, 2, 12, 12);
    g.fillStyle(0x27a842);
    g.fillRect(3, 3, 10, 10);
    // stitch dots along the edge
    g.fillStyle(0x1b7a2f);
    g.fillRect(4, 4, 1, 1); g.fillRect(11, 4, 1, 1);
    g.fillRect(4, 11, 1, 1); g.fillRect(11, 11, 1, 1);
    // white plus
    g.fillStyle(0xffffff);
    g.fillRect(7, 4, 2, 8);
    g.fillRect(4, 7, 8, 2);
    // little clock hand hint (top-left sparkle)
    g.fillStyle(0xd0ffd8);
    g.fillRect(3, 3, 2, 1);

    g.generateTexture('hotfix', 16, 16);
    g.destroy();
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
    this.sliceSheet('ceo', 24, 32);

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

  private generateBackgroundCloud(): void {
    // Bright open sky for the cloud level.
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();

    // Sky gradient in three bands
    g.fillStyle(0x6db6e8); g.fillRect(0, 0, 480, 270);
    g.fillStyle(0x84c4ee); g.fillRect(0, 90, 480, 180);
    g.fillStyle(0x9fd4f4); g.fillRect(0, 180, 480, 90);

    // Sun (top right) with glow
    g.fillStyle(0xfff2b8); g.fillCircle(408, 46, 26);
    g.fillStyle(0xffe36e); g.fillCircle(408, 46, 20);
    g.fillStyle(0xfff6d8); g.fillCircle(402, 40, 6);

    // Distant cloud banks
    g.fillStyle(0xffffff, 0.85);
    const clouds: [number, number, number][] = [
      [40, 60, 34], [150, 100, 42], [260, 50, 30],
      [330, 130, 46], [90, 180, 38], [230, 210, 44], [420, 200, 36]
    ];
    for (const [cx, cy, w] of clouds) {
      g.fillRect(cx, cy, w, 8);
      g.fillRect(cx - 8, cy + 5, w + 16, 7);
      g.fillRect(cx + 6, cy - 5, w - 12, 6);
    }

    // Tiny distant "cloud servers" drifting between the clouds
    g.fillStyle(0xd8e4f0);
    g.fillRect(120, 70, 14, 10); g.fillRect(300, 170, 14, 10); g.fillRect(60, 230, 14, 10);
    g.fillStyle(0x33dd66);
    g.fillRect(122, 72, 2, 2); g.fillRect(302, 172, 2, 2); g.fillRect(62, 232, 2, 2);

    g.generateTexture('background_cloud', 480, 270);
    g.destroy();
  }

  // ── Per-theme parallax layers ────────────────────────────────────────────
  // Each theme gets its own MID (mid-distance structures) and NEAR (foreground
  // silhouettes) layer so office furniture never bleeds into the server/data
  // levels. GameScene applies the layer alpha (mid 0.7 / near 0.5), so shapes
  // here are drawn solid for crisp parallax depth.

  private generateMidNearLayers(): void {
    this.makeOfficeMid();  this.makeOfficeNear();
    this.makeServerMid();  this.makeServerNear();
    this.makeDataMid();    this.makeDataNear();
    this.makeCloudMid();   this.makeCloudNear();
  }

  private makeCloudMid(): void {
    // Fluffy mid-distance clouds carrying little server crates.
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();
    for (let x = 10; x < 480; x += 140) {
      const y = 90 + ((x / 140 | 0) % 3) * 50;
      g.fillStyle(0xffffff);
      g.fillRect(x, y, 76, 14);
      g.fillRect(x - 12, y + 9, 100, 12);
      g.fillRect(x + 14, y - 8, 44, 10);
      // server crate riding the cloud
      g.fillStyle(0x4c5666); g.fillRect(x + 28, y - 22, 20, 15);
      g.fillStyle(0x2a303a); g.fillRect(x + 30, y - 20, 16, 11);
      g.fillStyle(0x33dd66); g.fillRect(x + 31, y - 18, 2, 2);
      g.fillStyle(0x44aaff); g.fillRect(x + 35, y - 18, 2, 2);
      // antenna
      g.fillStyle(0x8a94a4); g.fillRect(x + 44, y - 30, 1, 8);
      g.fillStyle(0xff5555); g.fillRect(x + 43, y - 31, 3, 2);
    }
    g.generateTexture('background_mid_cloud', 480, 270);
    g.destroy();
  }

  private makeCloudNear(): void {
    // Foreground cloud wisps drifting past.
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();
    g.fillStyle(0xffffff);
    for (let x = -20; x < 480; x += 110) {
      const y = 200 + ((x / 110 | 0) % 2) * 40;
      g.fillRect(x, y, 90, 10);
      g.fillRect(x + 12, y - 6, 56, 8);
      g.fillRect(x - 10, y + 7, 110, 8);
    }
    // a couple of high wisps
    g.fillRect(60, 30, 70, 6); g.fillRect(76, 25, 40, 6);
    g.fillRect(300, 55, 80, 6); g.fillRect(318, 50, 46, 6);
    g.generateTexture('background_near_cloud', 480, 270);
    g.destroy();
  }

  private makeOfficeMid(): void {
    // Cubicle partitions + a wall clock — mid distance.
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();
    for (let x = 8; x < 480; x += 130) {
      g.fillStyle(0x7f8aa3); g.fillRect(x, 96, 92, 70);          // partition panel
      g.fillStyle(0x8e98b0); g.fillRect(x + 3, 99, 86, 8);       // top rail highlight
      g.fillStyle(0x6c7691); g.fillRect(x, 160, 92, 6);          // base shadow
      // sticky-note board
      g.fillStyle(0xf2e9a8); g.fillRect(x + 16, 116, 12, 12);
      g.fillStyle(0xa8d6f2); g.fillRect(x + 34, 120, 12, 12);
      g.fillStyle(0xf2b6c4); g.fillRect(x + 56, 114, 12, 12);
    }
    // round wall clock
    g.fillStyle(0xf4f2ea); g.fillCircle(240, 60, 16);
    g.fillStyle(0x4a4f5c); g.fillCircle(240, 60, 16); g.fillStyle(0xf4f2ea); g.fillCircle(240, 60, 13);
    g.fillStyle(0x2a2f3a); g.fillRect(239, 50, 2, 11); g.fillRect(240, 59, 8, 2);
    g.generateTexture('background_mid_office', 480, 270);
    g.destroy();
  }

  private makeOfficeNear(): void {
    // Foreground desks with monitors + chairs + a plant.
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();
    for (let x = -10; x < 480; x += 122) {
      g.fillStyle(0x5a4424); g.fillRect(x + 6, 206, 96, 12);     // desk top
      g.fillStyle(0x3c2c16); g.fillRect(x + 6, 218, 96, 6);
      g.fillStyle(0x46341a); g.fillRect(x + 14, 224, 6, 30); g.fillRect(x + 88, 224, 6, 30); // legs
      g.fillStyle(0x23262e); g.fillRect(x + 16, 178, 44, 28);    // monitor
      g.fillStyle(0x3a6ea5); g.fillRect(x + 18, 180, 40, 24);
      g.fillStyle(0x14161c); g.fillRect(x + 34, 206, 8, 4);      // monitor stand
      // office chair
      g.fillStyle(0x2c2f38); g.fillRect(x + 70, 200, 26, 8); g.fillRect(x + 78, 176, 12, 26);
      g.fillStyle(0x14161c); g.fillRect(x + 80, 208, 4, 24);
      // potted plant
      g.fillStyle(0x2f7d3a); g.fillRect(x + 104, 184, 14, 22);
      g.fillStyle(0x8a5a2a); g.fillRect(x + 105, 204, 12, 12);
    }
    g.generateTexture('background_near_office', 480, 270);
    g.destroy();
  }

  private makeServerMid(): void {
    // Rows of distant server cabinets with status LEDs.
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();
    for (let x = 6; x < 480; x += 66) {
      g.fillStyle(0x2a3344); g.fillRect(x, 70, 54, 150);         // cabinet
      g.fillStyle(0x344056); g.fillRect(x + 2, 72, 50, 4);       // top edge
      g.fillStyle(0x0e141d); g.fillRect(x + 5, 80, 44, 132);     // dark front
      for (let y = 86; y < 206; y += 12) {                       // rack units
        g.fillStyle(0x1b2230); g.fillRect(x + 7, y, 40, 9);
        g.fillStyle((x + y) % 24 < 12 ? 0x33dd66 : 0x1f7a3a); g.fillRect(x + 9, y + 3, 3, 3);
        g.fillStyle((x + y) % 36 < 12 ? 0x44aaff : 0x1f5a8a); g.fillRect(x + 14, y + 3, 3, 3);
      }
    }
    g.generateTexture('background_mid_server', 480, 270);
    g.destroy();
  }

  private makeServerNear(): void {
    // Foreground overhead cable trays + hanging bundles.
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();
    g.fillStyle(0x10151d); g.fillRect(0, 188, 480, 82);          // raised-floor edge
    g.fillStyle(0x1b2430); g.fillRect(0, 188, 480, 5);
    const cable = [0xcc3a3a, 0x3acc5a, 0x3a7acc, 0xccaa3a, 0xaa3acc];
    for (let x = 18; x < 480; x += 54) {                          // hanging cables from top
      const c = cable[(x / 54 | 0) % cable.length];
      g.fillStyle(c); g.fillRect(x, 0, 4, 40 + ((x % 3) * 10));
      g.fillStyle(0x0c0f15); g.fillRect(x - 6, 0, 16, 8);
    }
    g.generateTexture('background_near_server', 480, 270);
    g.destroy();
  }

  private makeDataMid(): void {
    // Glowing red server rows receding into the dark.
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();
    for (let x = 4; x < 480; x += 74) {
      g.fillStyle(0x2a0c0c); g.fillRect(x, 60, 60, 170);
      g.fillStyle(0x3a1010); g.fillRect(x + 2, 62, 56, 4);
      g.fillStyle(0x120404); g.fillRect(x + 5, 70, 50, 152);
      for (let y = 78; y < 214; y += 11) {
        const on = (x + y) % 22 < 11;
        g.fillStyle(on ? 0xff3030 : 0x551010); g.fillRect(x + 8, y, 4, 3);
        g.fillStyle(on ? 0xff8030 : 0x552010); g.fillRect(x + 16, y, 4, 3);
        g.fillStyle(0x331515); g.fillRect(x + 26, y, 24, 3);
      }
    }
    g.generateTexture('background_mid_data', 480, 270);
    g.destroy();
  }

  private makeDataNear(): void {
    // Foreground dark server pillars with red glow + warning stripes.
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.clear();
    g.fillStyle(0x180404); g.fillRect(0, 196, 480, 74);
    for (let x = -8; x < 480; x += 150) {
      g.fillStyle(0x220808); g.fillRect(x + 10, 150, 40, 90);     // pillar
      g.fillStyle(0x3a0c0c); g.fillRect(x + 10, 150, 40, 5);
      g.fillStyle(0xff2a2a); g.fillRect(x + 16, 162, 28, 3);      // glowing strip
      g.fillStyle(0x991a1a); g.fillRect(x + 16, 172, 28, 2);
      // hazard chevrons at the base
      g.fillStyle(0xd8a01e);
      for (let i = 0; i < 5; i++) g.fillRect(x + 12 + i * 8, 236, 5, 6);
      g.fillStyle(0x180404);
      for (let i = 0; i < 5; i++) g.fillRect(x + 16 + i * 8, 236, 3, 6);
    }
    g.generateTexture('background_near_data', 480, 270);
    g.destroy();
  }
}
