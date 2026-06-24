import Phaser from 'phaser';
import { TILE_SIZE } from '../config';
import { Player } from '../entities/Player';
import { Ticket } from '../entities/enemies/Ticket';
import { Printer } from '../entities/enemies/Printer';
import { PhishingMail } from '../entities/enemies/PhishingMail';
import { ClumsyUser } from '../entities/enemies/ClumsyUser';
import { Enemy } from '../entities/Enemy';
import { PowerUp, PowerUpType } from '../entities/PowerUp';
import { ClockSystem } from '../systems/ClockSystem';
import { ScoreSystem } from '../systems/ScoreSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { AudioSystem } from '../utils/AudioSystem';
import {
  LEVEL_DATA, LEVEL_WIDTH, LEVEL_HEIGHT,
  QUESTION_BLOCKS, PLATFORMS, ENEMIES, VPN,
  DOC_POSITIONS, CHECKPOINT_COL, CHECKPOINT_ROW,
  GOAL_COL, GOAL_ROW, QuestionContent
} from '../levels/levelData';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private map!: Phaser.Tilemaps.Tilemap;
  private tileset!: Phaser.Tilemaps.Tileset;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private platformGroup!: Phaser.Physics.Arcade.StaticGroup;
  private projectilesGroup!: Phaser.Physics.Arcade.Group;
  private enemyGroup!: Phaser.Physics.Arcade.Group;
  private docGroup!: Phaser.Physics.Arcade.StaticGroup;
  private powerUpGroup!: Phaser.Physics.Arcade.Group;
  private printerBulletGroup!: Phaser.Physics.Arcade.Group;

  private enemies: Enemy[] = [];
  private printers: Printer[] = [];
  private questionBlockStates: Map<string, boolean> = new Map();

  private clockSystem!: ClockSystem;
  private scoreSystem!: ScoreSystem;
  private audio!: AudioSystem;

  private checkpointSprite!: Phaser.GameObjects.Sprite;
  private goalSprite!: Phaser.GameObjects.Sprite;
  private backgroundTiles: Phaser.GameObjects.TileSprite | null = null;

  private levelComplete = false;
  private gameOver = false;
  private checkpointActivated = false;
  private playerDeathHandled = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.levelComplete = false;
    this.gameOver = false;
    this.checkpointActivated = false;
    this.playerDeathHandled = false;
    this.enemies = [];
    this.printers = [];
    this.questionBlockStates.clear();

    this.audio = AudioSystem.getInstance();

    // Initialize registry
    this.registry.set('lives', 3);
    this.registry.set('score', 0);
    this.registry.set('docs', 0);
    this.registry.set('clockTime', '14:00');
    this.registry.set('clockProgress', 0);
    this.registry.set('powerState', 'small');

    // Systems
    this.clockSystem = new ClockSystem(this);
    this.clockSystem.setCallbacks(
      () => this.handleClockFail(),
      () => this.handleEscalation()
    );

    this.scoreSystem = new ScoreSystem(this);
    this.scoreSystem.init(3);

    // World bounds
    this.physics.world.setBounds(0, 0, LEVEL_WIDTH * TILE_SIZE, LEVEL_HEIGHT * TILE_SIZE);

    // Groups
    this.enemyGroup = this.physics.add.group();
    this.docGroup = this.physics.add.staticGroup();
    this.powerUpGroup = this.physics.add.group();
    this.projectilesGroup = this.physics.add.group();
    this.printerBulletGroup = this.physics.add.group();

    // Background
    this.createBackground();

    // Tilemap
    this.createTilemap();

    // Platforms (one-way)
    this.createPlatforms();

    // Player
    this.player = new Player(this, 48, (LEVEL_HEIGHT - 3) * TILE_SIZE);
    this.player.init();
    this.player.setProjectilesGroup(this.projectilesGroup);

    // Enemies
    this.createEnemies();

    // Pickups
    this.createPickups();

    // VPN zones
    this.createVpnZones();

    // Checkpoint & Goal
    this.createCheckpointGoal();

    // Collisions
    this.setupCollisions();

    // Camera
    this.cameras.main.setBounds(0, 0, LEVEL_WIDTH * TILE_SIZE, LEVEL_HEIGHT * TILE_SIZE);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(80, 40);

    // HUD
    if (!this.scene.isActive('HudScene')) {
      this.scene.launch('HudScene');
    }

    // Music
    this.audio.startMusic();

    // Down key event for VPN
    this.events.on('player_down', (x: number, y: number) => {
      this.checkVpnEntry(x, y);
    });
  }

  private createBackground(): void {
    this.backgroundTiles = this.add.tileSprite(
      0, 0,
      LEVEL_WIDTH * TILE_SIZE, LEVEL_HEIGHT * TILE_SIZE,
      'background'
    );
    this.backgroundTiles.setOrigin(0, 0);
    this.backgroundTiles.setScrollFactor(0.3);
    this.backgroundTiles.setDepth(-10);
  }

  private createTilemap(): void {
    this.map = this.make.tilemap({
      data: LEVEL_DATA,
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE
    });

    // For data-based tilemaps, addTilesetImage takes (name, key, tileWidth, tileHeight)
    const ts = this.map.addTilesetImage('tileset', 'tileset', TILE_SIZE, TILE_SIZE, 0, 0);
    if (!ts) throw new Error('Tileset not found');
    this.tileset = ts;

    const layer = this.map.createLayer(0, this.tileset, 0, 0);
    if (!layer) throw new Error('Layer not created');
    this.groundLayer = layer;

    // Collision on solid tiles (tile index = tile value in data array)
    // 1=ground, 2=brick, 3=question, 4=used
    this.groundLayer.setCollision([1, 2, 3, 4]);
    this.groundLayer.setDepth(0);

    // Tile 5 (platform) is rendered but collision is handled by staticGroup
    // Remove platform tiles from the layer collision (they have separate physics)
  }

  private createPlatforms(): void {
    this.platformGroup = this.physics.add.staticGroup();

    for (const plat of PLATFORMS) {
      for (let col = plat.startCol; col <= plat.endCol; col++) {
        const px = col * TILE_SIZE + TILE_SIZE / 2;
        const py = plat.row * TILE_SIZE;
        // Create a thin invisible collider at the top of the platform
        const body = this.platformGroup.create(px, py, 'tileset') as Phaser.Physics.Arcade.Image;
        body.setFrame(5);
        body.setDisplaySize(TILE_SIZE, 6);
        body.refreshBody();
        body.setDepth(1);
      }
    }
  }

  private createEnemies(): void {
    for (const def of ENEMIES) {
      const x = def.tileX * TILE_SIZE + TILE_SIZE / 2;
      const y = def.tileY * TILE_SIZE - 8;

      switch (def.type) {
        case 'ticket': {
          const t = new Ticket(this, x, y);
          t.init();
          this.physics.add.collider(t, this.groundLayer);
          this.physics.add.collider(t, this.platformGroup);
          this.enemies.push(t);
          this.enemyGroup.add(t);
          break;
        }
        case 'printer': {
          const p = new Printer(this, x, y);
          p.init();
          this.physics.add.collider(p, this.groundLayer);
          this.physics.add.collider(p, this.platformGroup);
          this.enemies.push(p);
          this.enemyGroup.add(p);
          this.printers.push(p);
          // Add printer bullets to our shared bullet group
          this.physics.add.overlap(this.player, p.getBullets(), (_player, bullet) => {
            if (this.player.isInvulnerable()) {
              (bullet as Phaser.Physics.Arcade.Sprite).destroy();
              return;
            }
            (bullet as Phaser.Physics.Arcade.Sprite).destroy();
            const died = this.player.takeDamage();
            if (died) this.handlePlayerDeath();
          });
          this.physics.add.collider(p.getBullets(), this.groundLayer, (bullet) => {
            (bullet as Phaser.Physics.Arcade.Sprite).destroy();
          });
          // Player projectiles vs printer
          this.physics.add.overlap(this.projectilesGroup, p as unknown as Phaser.Physics.Arcade.Sprite, (proj) => {
            if (p.isAlive()) {
              p.die();
              this.scoreSystem.addScore(p.getScore() * 2);
              this.showScorePopup(p.x, p.y - 16, p.getScore() * 2);
              AudioSystem.getInstance().playEnemyDie();
            }
            (proj as Phaser.Physics.Arcade.Sprite).destroy();
          });
          break;
        }
        case 'phishing_mail': {
          const pm = new PhishingMail(this, x, y);
          pm.setInvertCallback((dur) => this.player.invertControls(dur));
          pm.init();
          this.enemies.push(pm);
          this.enemyGroup.add(pm);
          break;
        }
        case 'clumsy_user': {
          const cu = new ClumsyUser(this, x, y);
          cu.setPlatformsGroup(this.platformGroup);
          cu.init();
          this.physics.add.collider(cu, this.groundLayer);
          this.physics.add.collider(cu, this.platformGroup);
          this.enemies.push(cu);
          this.enemyGroup.add(cu);
          break;
        }
      }
    }
  }

  private createPickups(): void {
    // Doc pages as static group members
    for (const doc of DOC_POSITIONS) {
      const x = doc.col * TILE_SIZE + TILE_SIZE / 2;
      const y = doc.row * TILE_SIZE - 4;
      const d = this.docGroup.create(x, y, 'doc_page') as Phaser.Physics.Arcade.Image;
      d.setDepth(5);
      d.refreshBody();
    }
  }

  private createVpnZones(): void {
    const ex = VPN.entranceCol * TILE_SIZE + TILE_SIZE / 2;
    const ey = VPN.entranceRow * TILE_SIZE - 4;

    // Visual indicator for VPN entrance
    const vpnText = this.add.text(ex, ey - 16, '▼ VPN', {
      fontSize: '6px',
      color: '#cc88ff',
      fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(5);

    this.tweens.add({
      targets: vpnText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Visual for exit
    const exitX = VPN.exitCol * TILE_SIZE + TILE_SIZE / 2;
    const exitY = VPN.exitRow * TILE_SIZE - 4;
    const exitText = this.add.text(exitX, exitY - 16, '↑ VPN', {
      fontSize: '6px',
      color: '#cc88ff',
      fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(5);

    this.tweens.add({
      targets: exitText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1
    });
  }

  private createCheckpointGoal(): void {
    const cx = CHECKPOINT_COL * TILE_SIZE + TILE_SIZE / 2;
    const cy = CHECKPOINT_ROW * TILE_SIZE - 8;
    this.checkpointSprite = this.add.sprite(cx, cy, 'tileset');
    this.checkpointSprite.setFrame(8);
    this.checkpointSprite.setDepth(2);
    this.checkpointSprite.setScale(1.5);

    const gx = GOAL_COL * TILE_SIZE + TILE_SIZE / 2;
    const gy = GOAL_ROW * TILE_SIZE - 8;
    this.goalSprite = this.add.sprite(gx, gy, 'tileset');
    this.goalSprite.setFrame(9);
    this.goalSprite.setDepth(2);
    this.goalSprite.setScale(1.5);

    this.tweens.add({
      targets: this.goalSprite,
      scaleX: 1.7,
      scaleY: 1.7,
      duration: 600,
      yoyo: true,
      repeat: -1
    });
  }

  private setupCollisions(): void {
    // Player vs ground layer
    this.physics.add.collider(this.player, this.groundLayer, (_player, tile) => {
      const t = tile as Phaser.Tilemaps.Tile;
      if (t && t.index === 6) {
        this.player.takeDamage();
      }
      // Question block: hit from below
      if (t && t.index === 3) {
        const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
        if (playerBody.velocity.y < 0 && playerBody.blocked.up) {
          const key = `${t.x},${t.y}`;
          if (!this.questionBlockStates.get(key)) {
            this.questionBlockStates.set(key, true);
            this.triggerQuestionBlock(t.x, t.y, t.pixelX + TILE_SIZE / 2, t.pixelY + TILE_SIZE / 2);
            this.groundLayer.putTileAt(4, t.x, t.y);
          }
        }
      }
    });

    // Player vs platforms (one-way - only collide when coming from above)
    this.physics.add.collider(this.player, this.platformGroup, (player, _platform) => {
      const playerBody = (player as Phaser.Physics.Arcade.Sprite).body as Phaser.Physics.Arcade.Body;
      // If player is moving up, pass through
      if (playerBody.velocity.y < -10) {
        playerBody.checkCollision.down = false;
        this.time.delayedCall(50, () => { playerBody.checkCollision.down = true; });
      }
    });

    // Player vs enemies (overlap for custom stomp logic)
    this.physics.add.overlap(this.player, this.enemyGroup, (_player, enemy) => {
      const e = enemy as unknown as Enemy;
      if (!e.isAlive() || this.player.isInvulnerable()) return;

      const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
      const enemySprite = enemy as Phaser.Physics.Arcade.Sprite;

      const playerBottom = this.player.y + this.player.displayHeight / 2;
      const enemyTop = enemySprite.y - enemySprite.displayHeight / 2;
      const isStomp = playerBody.velocity.y > 50 && playerBottom <= enemyTop + 12;

      if (isStomp) {
        e.stomp();
        this.player.setVelocityY(-250);
        this.scoreSystem.addScore(e.getScore());
        this.showScorePopup(enemySprite.x, enemySprite.y - 16, e.getScore());
        AudioSystem.getInstance().playStomp();
        AudioSystem.getInstance().playEnemyDie();
      } else {
        const died = this.player.takeDamage();
        if (died) this.handlePlayerDeath();
        if (e instanceof PhishingMail) e.onHitPlayer();
      }
    });

    // Player vs doc pages
    this.physics.add.overlap(this.player, this.docGroup, (_player, doc) => {
      const d = doc as Phaser.Physics.Arcade.Image;
      if (!d.active) return;
      d.setActive(false);
      d.setVisible(false);
      const body = d.body as Phaser.Physics.Arcade.StaticBody;
      if (body) body.enable = false;
      this.scoreSystem.addDoc();
      AudioSystem.getInstance().playDocCollect();
      this.showScorePopup(d.x, d.y - 8, 10);
    });

    // Player vs power-ups (dynamic group)
    this.physics.add.overlap(this.player, this.powerUpGroup, (_player, pu) => {
      const p = pu as unknown as PowerUp;
      if (!p || !p.active || p.isCollected()) return;
      const type = p.collect();
      this.applyPowerUp(type);
    });

    // Player projectiles vs enemies
    this.physics.add.overlap(this.projectilesGroup, this.enemyGroup, (proj, enemy) => {
      const e = enemy as unknown as Enemy;
      if (e.isAlive()) {
        e.die();
        this.scoreSystem.addScore(e.getScore() * 2);
        this.showScorePopup((enemy as Phaser.Physics.Arcade.Sprite).x, (enemy as Phaser.Physics.Arcade.Sprite).y - 16, e.getScore() * 2);
        AudioSystem.getInstance().playEnemyDie();
      }
      (proj as Phaser.Physics.Arcade.Sprite).destroy();
    });

    // Player projectiles vs ground
    this.physics.add.collider(this.projectilesGroup, this.groundLayer, (proj) => {
      (proj as Phaser.Physics.Arcade.Sprite).destroy();
    });
  }

  private triggerQuestionBlock(tileX: number, tileY: number, pixelX: number, pixelY: number): void {
    let content: QuestionContent | null = null;
    for (const qb of QUESTION_BLOCKS) {
      if (qb.col === tileX && qb.row === tileY) {
        content = qb.content;
        break;
      }
    }

    AudioSystem.getInstance().playPowerUp();

    if (!content || content === 'doc') {
      // Single doc page pops out
      const img = this.docGroup.create(pixelX, pixelY - 20, 'doc_page') as Phaser.Physics.Arcade.Image;
      img.setDepth(5);
      img.refreshBody();
    } else if (content === 'doc5') {
      for (let i = 0; i < 5; i++) {
        const img = this.docGroup.create(pixelX + (i - 2) * 10, pixelY - 20, 'doc_page') as Phaser.Physics.Arcade.Image;
        img.setDepth(5);
        img.refreshBody();
      }
    } else {
      const typeKey = content as PowerUpType;
      const pu = new PowerUp(this, pixelX, pixelY - 24, typeKey);
      pu.spawnFromBlock(pixelX, pixelY);
      this.powerUpGroup.add(pu as unknown as Phaser.Physics.Arcade.Image);
    }
  }

  private applyPowerUp(type: PowerUpType): void {
    const audio = AudioSystem.getInstance();
    switch (type) {
      case 'coffee':
        this.player.applyPowerUp('coffee');
        this.registry.set('powerState', 'big');
        break;
      case 'sudo_flower':
        this.player.applyPowerUp('sudo_flower');
        this.registry.set('powerState', 'sudo');
        break;
      case 'energy_drink':
        this.player.applyPowerUp('energy_drink');
        this.showScorePopup(this.player.x, this.player.y - 20, 0, 'SPEED UP!');
        break;
      case 'backup_tape':
        this.player.applyPowerUp('backup_tape');
        this.scoreSystem.addLife();
        this.showScorePopup(this.player.x, this.player.y - 20, 0, '+1 LIFE!');
        audio.playPowerUp();
        break;
      case 'doc':
        this.scoreSystem.addDoc();
        audio.playDocCollect();
        this.showScorePopup(this.player.x, this.player.y - 8, 10);
        break;
      case 'doc5':
        for (let i = 0; i < 5; i++) this.scoreSystem.addDoc();
        audio.playDocCollect();
        this.showScorePopup(this.player.x, this.player.y - 8, 50, 'x5 DOCS!');
        break;
    }
  }

  private checkVpnEntry(playerX: number, playerY: number): void {
    const ex = VPN.entranceCol * TILE_SIZE + TILE_SIZE / 2;
    const ey = VPN.entranceRow * TILE_SIZE + TILE_SIZE / 2;
    const dist = Phaser.Math.Distance.Between(playerX, playerY, ex, ey);
    if (dist < 24) {
      const exitX = VPN.exitCol * TILE_SIZE + TILE_SIZE / 2;
      const exitY = VPN.exitRow * TILE_SIZE - 8;
      this.player.setPosition(exitX, exitY);
      this.player.setVelocity(0, 0);
      AudioSystem.getInstance().playVpnEnter();
      this.cameras.main.flash(300, 150, 0, 255);
      this.showScorePopup(exitX, exitY - 24, 0, 'VPN!');
    }
  }

  private handlePlayerDeath(): void {
    if (this.playerDeathHandled) return;
    this.playerDeathHandled = true;
    this.audio.stopMusic();

    const gameOver = this.scoreSystem.loseLife();
    if (gameOver) {
      this.time.delayedCall(1500, () => this.endGame(false));
    } else {
      this.time.delayedCall(1500, () => {
        this.playerDeathHandled = false;
        this.player.respawn();
        this.audio.startMusic();
      });
    }
  }

  private handleClockFail(): void {
    if (this.levelComplete || this.gameOver) return;
    this.showScorePopup(this.player.x, this.player.y - 30, 0, 'BEREITSCHAFTSDIENST!');
    this.time.delayedCall(1500, () => this.endGame(false));
  }

  private handleEscalation(): void {
    this.showScorePopup(this.player.x, this.player.y - 30, 0, '16:00! ESKALATION!');
    this.cameras.main.shake(300, 0.01);
  }

  private checkCheckpoint(): void {
    if (this.checkpointActivated) return;
    const cx = CHECKPOINT_COL * TILE_SIZE + TILE_SIZE / 2;
    const cy = CHECKPOINT_ROW * TILE_SIZE + TILE_SIZE / 2;
    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, cx, cy);
    if (dist < 32) {
      this.checkpointActivated = true;
      this.player.setCheckpoint(cx, cy - 8);
      AudioSystem.getInstance().playCheckpoint();
      this.showScorePopup(cx, cy - 24, 0, 'CHECKPOINT!');
      this.tweens.add({
        targets: this.checkpointSprite,
        scaleX: 2,
        scaleY: 2,
        duration: 200,
        yoyo: true
      });
      this.checkpointSprite.setTint(0xffff44);
    }
  }

  private checkGoal(): void {
    if (this.levelComplete) return;
    const gx = GOAL_COL * TILE_SIZE + TILE_SIZE / 2;
    const gy = GOAL_ROW * TILE_SIZE + TILE_SIZE / 2;
    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, gx, gy);
    if (dist < 32) {
      this.levelComplete = true;
      this.physics.pause();
      const timeBonus = this.clockSystem.getTimeBonus();
      const heightBonus = Math.max(0, Math.floor((gy - this.player.y) / TILE_SIZE) * 50);
      const total = timeBonus + heightBonus + 1000;
      this.scoreSystem.addScore(total);
      AudioSystem.getInstance().playLevelClear();
      this.cameras.main.flash(500, 255, 255, 0);
      this.showScorePopup(gx, gy - 40, total, 'FEIERABEND!');
      this.time.delayedCall(3000, () => this.endGame(true));
    }
  }

  private endGame(success: boolean): void {
    this.gameOver = true;
    this.audio.stopMusic();
    SaveSystem.save(this.scoreSystem.getScore());
    this.scene.stop('HudScene');
    this.scene.start('GameOverScene', {
      success,
      score: this.scoreSystem.getScore(),
      highScore: SaveSystem.getHighScore()
    });
  }

  private showScorePopup(x: number, y: number, points: number, label?: string): void {
    const text = label || `+${points}`;
    const color = label ? '#ffcc00' : (points > 500 ? '#ffcc00' : '#ffffff');
    const popup = this.add.text(x, y, text, {
      fontSize: '8px',
      color,
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(20);

    this.tweens.add({
      targets: popup,
      y: y - 24,
      alpha: 0,
      duration: 1200,
      ease: 'Quad.easeOut',
      onComplete: () => popup.destroy()
    });
  }

  update(_time: number, delta: number): void {
    if (this.gameOver || this.levelComplete) return;

    // Update clock
    this.clockSystem.update(delta);
    const escalated = this.clockSystem.isEscalated();

    // Update player
    if (!this.player.isDead) {
      this.player.update(delta);
    } else if (!this.playerDeathHandled) {
      this.handlePlayerDeath();
    }

    // Update enemies
    for (const enemy of this.enemies) {
      if (enemy.isAlive() && enemy.active) {
        enemy.updateAI(this.player, delta, escalated);
        // Clamp off-screen enemies
        if (enemy.x < 0) enemy.setX(8);
        if (enemy.x > LEVEL_WIDTH * TILE_SIZE) enemy.setX(LEVEL_WIDTH * TILE_SIZE - 8);
      }
    }

    // One-way platform pass-through from below
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    if (playerBody && playerBody.velocity.y < 0) {
      this.platformGroup.getChildren().forEach((child) => {
        const img = child as Phaser.Physics.Arcade.Image;
        if (!img.active) return;
        const pBody = img.body as Phaser.Physics.Arcade.StaticBody;
        if (pBody) {
          const playerBottom = this.player.y + this.player.displayHeight / 2;
          if (playerBottom > img.y) {
            pBody.enable = false;
            this.time.delayedCall(100, () => { if (pBody) pBody.enable = true; });
          }
        }
      });
    }

    // Check proximity objectives
    this.checkCheckpoint();
    this.checkGoal();

    // Sync power state
    this.registry.set('powerState', this.player.getPowerState());

    // Parallax background
    if (this.backgroundTiles) {
      this.backgroundTiles.tilePositionX = this.cameras.main.scrollX * 0.3;
    }
  }
}
