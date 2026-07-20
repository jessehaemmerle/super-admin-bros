import Phaser from 'phaser';
import { TILE_SIZE, COMBO, TOTAL_LEVELS, PHYSICS } from '../config';
import { Player, PlayerConfig, TouchInput } from '../entities/Player';
import { Ticket } from '../entities/enemies/Ticket';
import { Printer } from '../entities/enemies/Printer';
import { PhishingMail } from '../entities/enemies/PhishingMail';
import { ClumsyUser } from '../entities/enemies/ClumsyUser';
import { BuggyCode } from '../entities/enemies/BuggyCode';
import { Virus } from '../entities/enemies/Virus';
import { CeoEnemy } from '../entities/enemies/CeoEnemy';
import { Enemy } from '../entities/Enemy';
import { PowerUp, PowerUpType } from '../entities/PowerUp';
import { ClockSystem } from '../systems/ClockSystem';
import { ScoreSystem } from '../systems/ScoreSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { UpgradeSystem } from '../systems/UpgradeSystem';
import { AudioSystem } from '../utils/AudioSystem';
import { LevelConfig, QuestionContent, MovingPlatformDef } from '../levels/levelData';
import { LEVEL_1 } from '../levels/levelData';
import { LEVEL_2 } from '../levels/level2Data';
import { LEVEL_NETWORK } from '../levels/levelNetworkData';
import { LEVEL_CLOUD } from '../levels/levelCloudData';
import { LEVEL_BOSS } from '../levels/levelBossData';

const LEVELS: LevelConfig[] = [LEVEL_1, LEVEL_2, LEVEL_NETWORK, LEVEL_CLOUD, LEVEL_BOSS];

interface ActiveMovingPlatform {
  sprite: Phaser.Physics.Arcade.Image;
  def: MovingPlatformDef;
  min: number;
  max: number;
  dir: number;
  prevX: number;
  prevY: number;
}

interface GameSceneData {
  levelIndex?: number;
  numPlayers?: number;
  score?: number;
}

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private player2?: Player;
  private numPlayers = 1;
  private levelIndex = 1;
  private levelConfig!: LevelConfig;

  private map!: Phaser.Tilemaps.Tilemap;
  private tileset!: Phaser.Tilemaps.Tileset;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private platformGroup!: Phaser.Physics.Arcade.StaticGroup;
  private projectilesGroup!: Phaser.Physics.Arcade.Group;
  private enemyGroup!: Phaser.Physics.Arcade.Group;
  private docGroup!: Phaser.Physics.Arcade.StaticGroup;
  private powerUpGroup!: Phaser.Physics.Arcade.Group;
  private p2projectilesGroup!: Phaser.Physics.Arcade.Group;

  private enemies: Enemy[] = [];
  private movingPlatforms: ActiveMovingPlatform[] = [];
  private ceoEnemy?: CeoEnemy;
  private questionBlockStates: Map<string, boolean> = new Map();

  private clockSystem!: ClockSystem;
  private scoreSystem!: ScoreSystem;
  private audio!: AudioSystem;

  private checkpointSprite!: Phaser.GameObjects.Sprite;
  private goalSprite!: Phaser.GameObjects.Sprite;

  // Parallax layers
  private bgFar: Phaser.GameObjects.TileSprite | null = null;
  private bgMid: Phaser.GameObjects.TileSprite | null = null;
  private bgNear: Phaser.GameObjects.TileSprite | null = null;

  // State
  private levelComplete = false;
  private gameOver = false;
  private checkpointActivated = false;
  private playerDeathHandled = false;
  private p2DeathHandled = false;
  private p1Out = false;
  private p2Out = false;
  private p2Lives = 0;
  private bossDefeated = false;
  private startScore = 0;

  // Combo system
  private comboCount = 0;
  private comboTimer = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: GameSceneData): void {
    this.levelIndex = data.levelIndex ?? 1;
    this.numPlayers = data.numPlayers ?? 1;
    this.startScore = data.score ?? 0;
    this.levelConfig = LEVELS[this.levelIndex - 1] ?? LEVEL_1;
  }

  create(): void {
    this.levelComplete = false;
    this.gameOver = false;
    this.checkpointActivated = false;
    this.playerDeathHandled = false;
    this.p2DeathHandled = false;
    this.p1Out = false;
    this.p2Out = false;
    this.bossDefeated = false;
    this.enemies = [];
    this.movingPlatforms = [];
    this.ceoEnemy = undefined;
    this.questionBlockStates.clear();
    this.comboCount = 0;
    this.comboTimer = 0;

    // Reset touch input
    Object.assign(TouchInput, { left: false, right: false, jump: false, fire: false, p2left: false, p2right: false, p2jump: false, p2fire: false });

    this.audio = AudioSystem.getInstance();

    const upgrades = UpgradeSystem.get();
    const startLives = 3 + upgrades.extraLives;
    this.p2Lives = this.numPlayers > 1 ? startLives : 0;

    this.registry.set('lives',        startLives);
    this.registry.set('lives2',       this.p2Lives);
    this.registry.set('score',        this.startScore);
    this.registry.set('docs',         0);
    this.registry.set('clockTime',    '14:00');
    this.registry.set('clockProgress',0);
    this.registry.set('powerState',   'small');
    this.registry.set('powerState2',  'small');
    this.registry.set('comboCount',   0);
    this.registry.set('levelIndex',   this.levelIndex);
    this.registry.set('numPlayers',   this.numPlayers);

    const lv = this.levelConfig;
    const worldW = lv.width  * TILE_SIZE;
    const worldH = lv.height * TILE_SIZE;

    this.clockSystem = new ClockSystem(this);
    this.clockSystem.setCallbacks(
      () => this.handleClockFail(),
      () => this.handleEscalation()
    );

    this.scoreSystem = new ScoreSystem(this);
    this.scoreSystem.init(startLives, this.startScore);

    // Extend the bottom of the physics world below the level so the player can
    // actually FALL into pits (a death-plane check in update() then costs a life).
    // Left/right/top stay bounded; the camera bounds remain at the real height.
    this.physics.world.setBounds(0, 0, worldW, worldH + 240);

    this.enemyGroup        = this.physics.add.group();
    this.docGroup          = this.physics.add.staticGroup();
    this.powerUpGroup      = this.physics.add.group({ runChildUpdate: true });
    this.projectilesGroup  = this.physics.add.group();
    this.p2projectilesGroup= this.physics.add.group();

    this.createBackground(lv.backgroundTheme, worldW, worldH);
    this.createTilemap(lv);
    this.createPlatforms(lv);

    // Player 1
    const p1Config: PlayerConfig = { playerId: 1 };
    this.player = new Player(this, 48, (lv.height - 3) * TILE_SIZE, p1Config);
    this.player.init();
    this.player.setProjectilesGroup(this.projectilesGroup);
    if (upgrades.extraSpeed)  this.player.applyUpgradeSpeed();
    if (upgrades.fasterFire)  this.player.applyUpgradeFire();
    if (upgrades.startShield) this.player.applyStartShield();

    // Player 2
    if (this.numPlayers === 2) {
      const p2Config: PlayerConfig = { playerId: 2, tint: 0xaaffaa };
      this.player2 = new Player(this, 80, (lv.height - 3) * TILE_SIZE, p2Config);
      this.player2.init();
      this.player2.setProjectilesGroup(this.p2projectilesGroup);
      if (upgrades.extraSpeed) this.player2.applyUpgradeSpeed();
      if (upgrades.fasterFire) this.player2.applyUpgradeFire();
    }

    this.createMovingPlatforms(lv);
    this.createFans(lv);
    this.createEnemies(lv);
    this.createPickups(lv);
    this.createVpnZones(lv);
    this.createCheckpointGoal(lv);
    this.setupCollisions();

    // Camera
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    if (this.numPlayers === 1) {
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
      this.cameras.main.setDeadzone(80, 40);
    }

    // HUD
    if (!this.scene.isActive('HudScene')) {
      this.scene.launch('HudScene');
    }

    this.audio.startMusic();

    // Scene event listeners survive a scene restart, so drop stale handlers
    // from a previous level first — they capture the old level's VPN layout.
    this.events.off('player_down');
    this.events.off('player2_down');
    this.events.on('player_down', (x: number, y: number) => {
      this.checkVpnEntry(this.player, x, y, this.levelConfig);
    });
    this.events.on('player2_down', (x: number, y: number) => {
      if (this.player2) this.checkVpnEntry(this.player2, x, y, this.levelConfig);
    });
  }

  private createBackground(theme: string, worldW: number, worldH: number): void {
    const suffix  = theme === 'serverroom' ? 'server'
                  : theme === 'datacenter' ? 'data'
                  : theme === 'cloud'      ? 'cloud'
                  : 'office';
    const farKey  = theme === 'serverroom' ? 'background_serverroom'
                  : theme === 'datacenter' ? 'background_datacenter'
                  : theme === 'cloud'      ? 'background_cloud'
                  : 'background';
    const midKey  = `background_mid_${suffix}`;
    const nearKey = `background_near_${suffix}`;

    this.bgFar = this.add.tileSprite(0, 0, worldW, worldH, farKey)
      .setOrigin(0, 0).setScrollFactor(0.1).setDepth(-10);

    this.bgMid = this.add.tileSprite(0, 0, worldW, worldH, midKey)
      .setOrigin(0, 0).setScrollFactor(0.3).setDepth(-9).setAlpha(0.7);

    this.bgNear = this.add.tileSprite(0, 0, worldW, worldH, nearKey)
      .setOrigin(0, 0).setScrollFactor(0.6).setDepth(-8).setAlpha(0.5);
  }

  private createTilemap(lv: LevelConfig): void {
    this.map = this.make.tilemap({
      data: lv.data,
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE
    });

    const ts = this.map.addTilesetImage('tileset', 'tileset', TILE_SIZE, TILE_SIZE, 0, 0);
    if (!ts) throw new Error('Tileset not found');
    this.tileset = ts;

    const layer = this.map.createLayer(0, this.tileset, 0, 0);
    if (!layer) throw new Error('Layer not created');
    this.groundLayer = layer;

    // Tile 11 (fake wall) = no collision; all others as before
    this.groundLayer.setCollision([1, 2, 3, 4, 6, 10]);
    this.groundLayer.setDepth(0);

    // Fake wall tiles rendered as brick (tile index 2 shares the same frame)
    this.groundLayer.forEachTile(tile => {
      if (tile.index === 11) {
        tile.setCollision(false, false, false, false);
      }
    });

    // Secret room: add subtle tint hint on fake walls
    if (lv.secretRooms.length > 0) {
      for (const sr of lv.secretRooms) {
        for (let row = sr.fakeWallRow; row < sr.fakeWallRow + sr.fakeWallHeight; row++) {
          for (let col = sr.fakeWallStartCol; col <= sr.fakeWallEndCol; col++) {
            const tile = this.groundLayer.getTileAt(col, row);
            if (tile) {
              tile.tint = 0xaaaaff; // subtle blue hint
            }
          }
        }
        // Hint text
        const hx = sr.fakeWallStartCol * TILE_SIZE + TILE_SIZE / 2;
        const hy = sr.fakeWallRow * TILE_SIZE - 8;
        const hint = this.add.text(hx, hy, '?', {
          fontSize: '6px', color: '#8888ff', fontFamily: 'monospace'
        }).setOrigin(0.5).setDepth(3).setAlpha(0);
        this.tweens.add({ targets: hint, alpha: 0.7, duration: 1000, yoyo: true, repeat: -1 });
      }
    }
  }

  private createPlatforms(lv: LevelConfig): void {
    this.platformGroup = this.physics.add.staticGroup();
    for (const plat of lv.platforms) {
      for (let col = plat.startCol; col <= plat.endCol; col++) {
        const px = col * TILE_SIZE + TILE_SIZE / 2;
        const py = plat.row * TILE_SIZE;
        const body = this.platformGroup.create(px, py, 'tileset') as Phaser.Physics.Arcade.Image;
        body.setFrame(5);
        body.setDisplaySize(TILE_SIZE, 6);
        body.refreshBody();
        body.setDepth(1);
      }
    }
  }

  private createMovingPlatforms(lv: LevelConfig): void {
    for (const def of lv.movingPlatforms) {
      // 3 tiles wide, same plank frame as the static one-way platforms
      const x = def.col * TILE_SIZE + TILE_SIZE * 1.5;
      const y = def.row * TILE_SIZE;
      const img = this.physics.add.image(x, y, 'tileset', 5);
      img.setDisplaySize(TILE_SIZE * 3, 6);
      img.setDepth(1);
      const body = img.body as Phaser.Physics.Arcade.Body;
      body.setAllowGravity(false);
      body.setImmovable(true);

      const start = def.axis === 'x' ? x : y;
      const mp: ActiveMovingPlatform = {
        sprite: img,
        def,
        min: start,
        max: start + def.range * TILE_SIZE,
        dir: 1,
        prevX: x,
        prevY: y
      };
      this.movingPlatforms.push(mp);

      // One-way from above: pass when the player's feet are at or above the
      // plank — a velocity check alone would drop riders off platforms that
      // move upward (separation zeroes/negates velocity.y).
      const fromAbove: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (pl) => {
        const pb = (pl as Phaser.Physics.Arcade.Sprite).body as Phaser.Physics.Arcade.Body;
        return pb.bottom <= body.top + 10;
      };
      this.physics.add.collider(this.player, img, undefined, fromAbove);
      if (this.player2) this.physics.add.collider(this.player2, img, undefined, fromAbove);
    }
  }

  private updateMovingPlatforms(): void {
    for (const mp of this.movingPlatforms) {
      const body = mp.sprite.body as Phaser.Physics.Arcade.Body;
      const pos = mp.def.axis === 'x' ? mp.sprite.x : mp.sprite.y;
      if (pos >= mp.max && mp.dir > 0) mp.dir = -1;
      if (pos <= mp.min && mp.dir < 0) mp.dir = 1;
      if (mp.def.axis === 'x') body.setVelocityX(mp.dir * mp.def.speed);
      else body.setVelocityY(mp.dir * mp.def.speed);

      // Carry riders: apply the platform's frame delta to anyone standing on
      // it (Arcade physics has no platform friction of its own).
      const dx = mp.sprite.x - mp.prevX;
      const dy = mp.sprite.y - mp.prevY;
      if (dx !== 0 || dy > 0) {
        for (const p of [this.player, this.player2]) {
          if (!p || p.isDead) continue;
          const pb = p.body as Phaser.Physics.Arcade.Body;
          const standing =
            pb.bottom >= body.top - 2 && pb.bottom <= body.top + 6 &&
            pb.right > body.left && pb.left < body.right &&
            pb.velocity.y >= 0;
          if (standing) {
            p.x += dx;
            if (dy > 0) p.y += dy;
          }
        }
      }
      mp.prevX = mp.sprite.x;
      mp.prevY = mp.sprite.y;
    }
  }

  private createFans(lv: LevelConfig): void {
    for (const def of lv.fans) {
      const x = def.col * TILE_SIZE + TILE_SIZE / 2;
      const y = def.row * TILE_SIZE + TILE_SIZE / 2;
      const fan = this.add.sprite(x, y, 'fan');
      fan.play('fan_spin');
      fan.setDepth(2);

      // Updraft column above the fan
      const zone = this.add.zone(x, y - TILE_SIZE * 2, 14, TILE_SIZE * 4);
      this.physics.add.existing(zone, true);

      const boost = (playerRef: Player): Phaser.Types.Physics.Arcade.ArcadePhysicsCallback => () => {
        const pb = playerRef.body as Phaser.Physics.Arcade.Body;
        if (pb.velocity.y > -260) {
          playerRef.setVelocityY(-520);
          AudioSystem.getInstance().playFanBoost();
        }
      };
      this.physics.add.overlap(this.player, zone, boost(this.player));
      if (this.player2) this.physics.add.overlap(this.player2, zone, boost(this.player2));

      // drifting air-flow hint
      const puff = this.add.text(x, y - 22, '≈', {
        fontSize: '8px', color: '#bcd6ee', fontFamily: 'monospace'
      }).setOrigin(0.5).setDepth(2).setAlpha(0.8);
      this.tweens.add({
        targets: puff, y: y - 44, alpha: 0, duration: 900, repeat: -1, ease: 'Quad.easeOut'
      });
    }
  }

  private createEnemies(lv: LevelConfig): void {
    for (const def of lv.enemies) {
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
          this.setupEnemyBullets(p.getBullets());
          break;
        }
        case 'phishing_mail': {
          const pm = new PhishingMail(this, x, y);
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
        case 'buggy_code': {
          const bc = new BuggyCode(this, x, y);
          bc.init();
          this.enemies.push(bc);
          this.enemyGroup.add(bc);
          break;
        }
        case 'virus': {
          const v = new Virus(this, x, y);
          v.init();
          this.physics.add.collider(v, this.groundLayer);
          this.physics.add.collider(v, this.platformGroup);
          this.enemies.push(v);
          this.enemyGroup.add(v);
          break;
        }
        case 'ceo': {
          const ceo = new CeoEnemy(this, x, y);
          ceo.init();
          ceo.setOnDieCallback(() => this.onBossDead());
          this.physics.add.collider(ceo, this.groundLayer);
          this.ceoEnemy = ceo;
          this.enemies.push(ceo);
          this.enemyGroup.add(ceo);
          this.setupEnemyBullets(ceo.getBullets());
          break;
        }
      }
    }
  }

  // Wires an enemy bullet group against both players and the ground.
  // Bullets always vanish on contact; damage only lands if the player is
  // vulnerable. Used for printer paper jams and CEO meeting requests alike.
  private setupEnemyBullets(bullets: Phaser.Physics.Arcade.Group): void {
    const hitPlayer = (playerRef: Player, onDeath: () => void): Phaser.Types.Physics.Arcade.ArcadePhysicsCallback =>
      (_pl, bullet) => {
        (bullet as Phaser.Physics.Arcade.Sprite).destroy();
        if (playerRef.isInvulnerable()) return;
        const died = playerRef.takeDamage();
        if (died) onDeath();
      };

    this.physics.add.overlap(this.player, bullets, hitPlayer(this.player, () => this.handlePlayerDeath()));
    if (this.player2) {
      this.physics.add.overlap(this.player2, bullets, hitPlayer(this.player2, () => this.handleP2Death()));
    }
    this.physics.add.collider(bullets, this.groundLayer, (bullet) => {
      (bullet as Phaser.Physics.Arcade.Sprite).destroy();
    });
  }

  private createPickups(lv: LevelConfig): void {
    for (const doc of lv.docPositions) {
      const x = doc.col * TILE_SIZE + TILE_SIZE / 2;
      const y = doc.row * TILE_SIZE - 4;
      const d = this.docGroup.create(x, y, 'doc_page') as Phaser.Physics.Arcade.Image;
      d.setDepth(5);
      d.refreshBody();
    }
  }

  private createVpnZones(lv: LevelConfig): void {
    if (!lv.vpn) return;
    const { entranceCol, entranceRow, exitCol, exitRow } = lv.vpn;
    const addLabel = (col: number, row: number, text: string) => {
      const tx = col * TILE_SIZE + TILE_SIZE / 2;
      const ty = row * TILE_SIZE - 4;
      const t = this.add.text(tx, ty - 16, text, {
        fontSize: '6px', color: '#cc88ff', fontFamily: 'monospace'
      }).setOrigin(0.5).setDepth(5);
      this.tweens.add({ targets: t, alpha: 0.3, duration: 800, yoyo: true, repeat: -1 });
    };
    addLabel(entranceCol, entranceRow, '▼ VPN');
    addLabel(exitCol, exitRow, '↑ VPN');
  }

  private createCheckpointGoal(lv: LevelConfig): void {
    const cx = lv.checkpointCol * TILE_SIZE + TILE_SIZE / 2;
    const cy = lv.checkpointRow * TILE_SIZE - 8;
    this.checkpointSprite = this.add.sprite(cx, cy, 'tileset').setFrame(8).setDepth(2).setScale(1.5);

    const gx = lv.goalCol * TILE_SIZE + TILE_SIZE / 2;
    const gy = lv.goalRow * TILE_SIZE - 8;
    this.goalSprite = this.add.sprite(gx, gy, 'tileset').setFrame(9).setDepth(2).setScale(1.5);
    this.tweens.add({ targets: this.goalSprite, scaleX: 1.7, scaleY: 1.7, duration: 600, yoyo: true, repeat: -1 });
  }

  private setupCollisions(): void {
    // Player 1 vs ground
    this.physics.add.collider(this.player, this.groundLayer, (_player, tile) => {
      const t = tile as Phaser.Tilemaps.Tile;
      if (t?.index === 6) {
        const died = this.player.takeDamage();
        if (died) this.handlePlayerDeath();
      }
      if (t?.index === 3) {
        // Hit from below: by the time this callback runs, Arcade physics has
        // already zeroed the upward velocity during separation, so we must test
        // blocked.up (the player is pressing against the block) — NOT velocity.y.
        const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
        if (playerBody.blocked.up) {
          const key = `${t.x},${t.y}`;
          if (!this.questionBlockStates.get(key)) {
            this.questionBlockStates.set(key, true);
            this.triggerQuestionBlock(t.x, t.y, t.pixelX + TILE_SIZE / 2, t.pixelY + TILE_SIZE / 2);
            this.groundLayer.putTileAt(4, t.x, t.y);
          }
        }
      }
    });

    // Player 2 vs ground
    if (this.player2) {
      this.physics.add.collider(this.player2, this.groundLayer, (_player, tile) => {
        const t = tile as Phaser.Tilemaps.Tile;
        if (t?.index === 6) {
          const died = this.player2!.takeDamage();
          if (died) this.handleP2Death();
        }
      });
    }

    // One-way platforms (process callback)
    this.physics.add.collider(this.player, this.platformGroup, undefined, (player, _platform) => {
      return (player as Phaser.Physics.Arcade.Sprite).body!.velocity.y >= 0;
    });
    if (this.player2) {
      this.physics.add.collider(this.player2, this.platformGroup, undefined, (player, _platform) => {
        return (player as Phaser.Physics.Arcade.Sprite).body!.velocity.y >= 0;
      });
    }

    // Player 1 vs enemies (stomp)
    this.physics.add.overlap(this.player, this.enemyGroup, (_player, enemy) => {
      this.handlePlayerEnemyOverlap(this.player, enemy as unknown as Enemy, false);
    });

    // Player 2 vs enemies
    if (this.player2) {
      this.physics.add.overlap(this.player2, this.enemyGroup, (_player, enemy) => {
        this.handlePlayerEnemyOverlap(this.player2!, enemy as unknown as Enemy, true);
      });
    }

    // Player vs docs
    const collectDoc = (playerRef: Player) => {
      this.physics.add.overlap(playerRef, this.docGroup, (_player, doc) => {
        const d = doc as Phaser.Physics.Arcade.Image;
        if (!d.active) return;
        d.setActive(false).setVisible(false);
        const body = d.body as Phaser.Physics.Arcade.StaticBody;
        if (body) body.enable = false;
        this.scoreSystem.addDoc();
        AudioSystem.getInstance().playDocCollect();
        this.showScorePopup(d.x, d.y - 8, 10);
      });
    };
    collectDoc(this.player);
    if (this.player2) collectDoc(this.player2);

    // Player vs power-ups
    const collectPowerUp = (playerRef: Player) => {
      this.physics.add.overlap(playerRef, this.powerUpGroup, (_player, pu) => {
        const p = pu as unknown as PowerUp;
        if (!p?.active || p.isCollected()) return;
        const type = p.collect();
        this.applyPowerUp(type, playerRef);
      });
    };
    collectPowerUp(this.player);
    if (this.player2) collectPowerUp(this.player2);

    // Projectiles vs enemies — the boss only takes 1 HP per hit and awards its
    // score once via onBossDead, never per projectile.
    const projectileHit: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (proj, enemy) => {
      const e = enemy as unknown as Enemy;
      if (e.isAlive()) {
        if (e instanceof CeoEnemy) {
          const dead = e.takeBossHit();
          if (dead) this.onBossDead();
        } else {
          e.die();
          this.onEnemyKilled(e, true);
        }
      }
      (proj as Phaser.Physics.Arcade.Sprite).destroy();
    };

    this.physics.add.overlap(this.projectilesGroup, this.enemyGroup, projectileHit);
    this.physics.add.collider(this.projectilesGroup, this.groundLayer, (proj) => {
      (proj as Phaser.Physics.Arcade.Sprite).destroy();
    });

    if (this.player2) {
      this.physics.add.overlap(this.p2projectilesGroup, this.enemyGroup, projectileHit);
      this.physics.add.collider(this.p2projectilesGroup, this.groundLayer, (proj) => {
        (proj as Phaser.Physics.Arcade.Sprite).destroy();
      });
    }
  }

  private handlePlayerEnemyOverlap(playerRef: Player, e: Enemy, isP2: boolean): void {
    if (!e.isAlive() || playerRef.isInvulnerable()) return;
    const playerBody = playerRef.body as Phaser.Physics.Arcade.Body;
    const enemySprite = e as unknown as Phaser.Physics.Arcade.Sprite;
    const playerBottom = playerRef.y + playerRef.displayHeight / 2;
    const enemyTop = enemySprite.y - enemySprite.displayHeight / 2;
    const isStomp = playerBody.velocity.y > 50 && playerBottom <= enemyTop + 12;

    if (isStomp) {
      if (e instanceof CeoEnemy) {
        const dead = (e as CeoEnemy).takeBossHit();
        if (dead) this.onBossDead();
      } else {
        if (e instanceof Virus && e.shouldSplit()) {
          this.spawnMiniViruses(enemySprite.x, enemySprite.y);
        }
        e.stomp();
        this.onEnemyKilled(e, false);
      }
      playerRef.setVelocityY(PHYSICS.STOMP_BOUNCE);
      AudioSystem.getInstance().playStomp();
    } else {
      // Invert BEFORE takeDamage: invertControls is a no-op while invulnerable,
      // and takeDamage starts the invulnerability window.
      if (e instanceof PhishingMail) playerRef.invertControls(1500);
      const died = playerRef.takeDamage();
      if (died) {
        if (isP2) this.handleP2Death();
        else this.handlePlayerDeath();
      }
    }
  }

  // Ein gestompter großer Virus "verbreitet sich": zwei schnellere
  // Mini-Viren flitzen in beide Richtungen davon. Deferred by a tick so no
  // bodies are created mid-physics-step.
  private spawnMiniViruses(x: number, y: number): void {
    this.time.delayedCall(0, () => {
      if (this.gameOver || this.levelComplete) return;
      for (const dir of [-1, 1]) {
        const mini = new Virus(this, x + dir * 8, y - 2, true);
        mini.init();
        mini.setVelocityX(dir * 85);
        mini.setFlipX(dir > 0);
        this.physics.add.collider(mini, this.groundLayer);
        this.physics.add.collider(mini, this.platformGroup);
        this.enemies.push(mini);
        this.enemyGroup.add(mini);
      }
    });
  }

  private onEnemyKilled(e: Enemy, byProjectile: boolean): void {
    const base = e.getScore() * (byProjectile ? 2 : 1);
    const multiplier = Math.min(this.comboCount + 1, COMBO.MAX_MULTIPLIER);
    const pts = base * multiplier;
    this.scoreSystem.addScore(pts);
    this.showScorePopup(
      (e as unknown as Phaser.Physics.Arcade.Sprite).x,
      (e as unknown as Phaser.Physics.Arcade.Sprite).y - 16,
      pts,
      multiplier > 1 ? `x${multiplier} COMBO!` : undefined
    );
    AudioSystem.getInstance().playEnemyDie();

    if (!byProjectile) {
      this.comboCount++;
      this.comboTimer = COMBO.TIMEOUT_MS;
      if (this.comboCount > 1) AudioSystem.getInstance().playCombo(this.comboCount);
      this.registry.set('comboCount', this.comboCount);
    }
  }

  private onBossDead(): void {
    // Reached both directly (stomp/projectile that lands the killing blow) and
    // via the CeoEnemy die-callback — reward exactly once.
    if (this.bossDefeated) return;
    this.bossDefeated = true;
    AudioSystem.getInstance().playBossDie();
    this.scoreSystem.addScore(this.ceoEnemy?.getScore() ?? 2000);
    this.showScorePopup(
      this.levelConfig.goalCol * TILE_SIZE,
      this.levelConfig.goalRow * TILE_SIZE - 30,
      2000,
      'CHEF BESIEGT!'
    );
    this.cameras.main.shake(500, 0.03);
    this.cameras.main.flash(400, 255, 100, 0);
  }

  private triggerQuestionBlock(tileX: number, tileY: number, pixelX: number, pixelY: number): void {
    let content: QuestionContent | null = null;
    for (const qb of this.levelConfig.questionBlocks) {
      if (qb.col === tileX && qb.row === tileY) { content = qb.content; break; }
    }
    AudioSystem.getInstance().playPowerUp();

    if (!content || content === 'doc') {
      const img = this.docGroup.create(pixelX, pixelY - 20, 'doc_page') as Phaser.Physics.Arcade.Image;
      img.setDepth(5).refreshBody();
    } else if (content === 'doc5') {
      for (let i = 0; i < 5; i++) {
        const img = this.docGroup.create(pixelX + (i - 2) * 10, pixelY - 20, 'doc_page') as Phaser.Physics.Arcade.Image;
        img.setDepth(5).refreshBody();
      }
    } else {
      const pu = new PowerUp(this, pixelX, pixelY - 24, content as PowerUpType);
      pu.spawnFromBlock(pixelX, pixelY);
      this.powerUpGroup.add(pu as unknown as Phaser.Physics.Arcade.Image);
    }
  }

  private applyPowerUp(type: PowerUpType, playerRef: Player): void {
    const audio = AudioSystem.getInstance();
    switch (type) {
      case 'coffee':
        playerRef.applyPowerUp('coffee');
        this.registry.set(playerRef.playerId === 1 ? 'powerState' : 'powerState2', 'big');
        break;
      case 'sudo_flower':
        playerRef.applyPowerUp('sudo_flower');
        this.registry.set(playerRef.playerId === 1 ? 'powerState' : 'powerState2', 'sudo');
        break;
      case 'energy_drink':
        playerRef.applyPowerUp('energy_drink');
        this.showScorePopup(playerRef.x, playerRef.y - 20, 0, 'SPEED UP!');
        break;
      case 'backup_tape':
        playerRef.applyPowerUp('backup_tape');
        this.scoreSystem.addLife();
        this.showScorePopup(playerRef.x, playerRef.y - 20, 0, '+1 LIFE!');
        audio.playPowerUp();
        break;
      case 'doc':
        this.scoreSystem.addDoc();
        audio.playDocCollect();
        this.showScorePopup(playerRef.x, playerRef.y - 8, 10);
        break;
      case 'doc5':
        for (let i = 0; i < 5; i++) this.scoreSystem.addDoc();
        audio.playDocCollect();
        this.showScorePopup(playerRef.x, playerRef.y - 8, 50, 'x5 DOCS!');
        break;
      case 'hotfix':
        // Hotfix eingespielt — die Uhr springt 20 Minuten zurück
        this.clockSystem.rewind(20);
        audio.playPowerUp();
        this.showScorePopup(playerRef.x, playerRef.y - 20, 0, 'HOTFIX! -20 MIN');
        break;
    }
  }

  private checkVpnEntry(playerRef: Player, playerX: number, playerY: number, lv: LevelConfig): void {
    if (!lv.vpn) return;
    const { entranceCol, entranceRow, exitCol, exitRow } = lv.vpn;
    const ex = entranceCol * TILE_SIZE + TILE_SIZE / 2;
    const ey = entranceRow * TILE_SIZE + TILE_SIZE / 2;
    if (Phaser.Math.Distance.Between(playerX, playerY, ex, ey) < 24) {
      const exitX = exitCol * TILE_SIZE + TILE_SIZE / 2;
      const exitY = exitRow * TILE_SIZE - 8;
      playerRef.setPosition(exitX, exitY);
      playerRef.setVelocity(0, 0);
      AudioSystem.getInstance().playVpnEnter();
      this.cameras.main.flash(300, 150, 0, 255);
      this.showScorePopup(exitX, exitY - 24, 0, 'VPN!');
    }
  }

  private handlePlayerDeath(): void {
    if (this.playerDeathHandled) return;
    this.playerDeathHandled = true;
    const outOfLives = this.scoreSystem.loseLife();
    if (!outOfLives) {
      this.time.delayedCall(1500, () => {
        this.playerDeathHandled = false;
        this.player.respawn();
        if (!this.audio.isMusicPlaying()) this.audio.startMusic();
      });
      return;
    }
    // Player 1 is out for good; the game continues as long as player 2 lives.
    this.p1Out = true;
    if (!this.player2 || this.p2Out) {
      this.audio.stopMusic();
      this.time.delayedCall(1500, () => this.endGame(false));
    } else {
      this.time.delayedCall(1500, () => this.removePlayer(this.player));
    }
  }

  private handleP2Death(): void {
    if (!this.player2 || this.p2DeathHandled) return;
    this.p2DeathHandled = true;
    this.p2Lives--;
    this.registry.set('lives2', Math.max(0, this.p2Lives));
    if (this.p2Lives > 0) {
      this.time.delayedCall(1500, () => {
        this.p2DeathHandled = false;
        this.player2!.respawn();
      });
      return;
    }
    this.p2Out = true;
    if (this.p1Out) {
      this.audio.stopMusic();
      this.time.delayedCall(1500, () => this.endGame(false));
    } else {
      this.time.delayedCall(1500, () => this.removePlayer(this.player2!));
    }
  }

  private removePlayer(p: Player): void {
    p.setActive(false).setVisible(false);
    const body = p.body as Phaser.Physics.Arcade.Body;
    if (body) body.enable = false;
  }

  private handleClockFail(): void {
    if (this.levelComplete || this.gameOver) return;
    this.showScorePopup(this.player.x, this.player.y - 30, 0, 'BEREITSCHAFTSDIENST!');
    this.audio.stopMusic();
    this.time.delayedCall(1500, () => this.endGame(false));
  }

  private handleEscalation(): void {
    this.showScorePopup(this.player.x, this.player.y - 30, 0, '16:00! ESKALATION!');
    this.cameras.main.shake(300, 0.01);
  }

  private checkCheckpoint(): void {
    if (this.checkpointActivated) return;
    const lv = this.levelConfig;
    const cx = lv.checkpointCol * TILE_SIZE + TILE_SIZE / 2;
    const cy = lv.checkpointRow * TILE_SIZE + TILE_SIZE / 2;
    const near = (p?: Player) =>
      !!p && !p.isDead && Phaser.Math.Distance.Between(p.x, p.y, cx, cy) < 32;
    if (near(this.player) || near(this.player2)) {
      this.checkpointActivated = true;
      this.player.setCheckpoint(cx, cy - 8);
      if (this.player2) this.player2.setCheckpoint(cx + 20, cy - 8);
      AudioSystem.getInstance().playCheckpoint();
      this.showScorePopup(cx, cy - 24, 0, 'CHECKPOINT!');
      this.tweens.add({ targets: this.checkpointSprite, scaleX: 2, scaleY: 2, duration: 200, yoyo: true });
      this.checkpointSprite.setTint(0xffff44);
    }
  }

  private checkGoal(): void {
    if (this.levelComplete) return;
    const lv = this.levelConfig;

    // Boss level: goal only appears after boss dies
    if (lv.hasBoss && this.ceoEnemy && !this.ceoEnemy.isDead) return;

    const gx = lv.goalCol * TILE_SIZE + TILE_SIZE / 2;
    const gy = lv.goalRow * TILE_SIZE + TILE_SIZE / 2;

    const atGoal = (p?: Player) =>
      !!p && !p.isDead && Phaser.Math.Distance.Between(p.x, p.y, gx, gy) < 32;
    const reached = atGoal(this.player) || atGoal(this.player2);

    if (reached) {
      this.levelComplete = true;
      this.physics.pause();
      const timeBonus = this.clockSystem.getTimeBonus();
      const total = timeBonus + 1000;
      this.scoreSystem.addScore(total);
      AudioSystem.getInstance().playLevelClear();
      this.cameras.main.flash(500, 255, 255, 0);
      this.showScorePopup(gx, gy - 40, total, 'FEIERABEND!');
      this.time.delayedCall(2500, () => {
        if (this.levelIndex < TOTAL_LEVELS) {
          this.endLevel();
        } else {
          this.endGame(true);
        }
      });
    }
  }

  private endLevel(): void {
    this.audio.stopMusic();
    SaveSystem.save(this.scoreSystem.getScore());
    this.scene.stop('HudScene');
    this.scene.start('ShopScene', {
      score: this.scoreSystem.getScore(),
      levelIndex: this.levelIndex + 1,
      numPlayers: this.numPlayers
    });
  }

  private endGame(success: boolean): void {
    this.gameOver = true;
    this.audio.stopMusic();
    SaveSystem.save(this.scoreSystem.getScore());
    UpgradeSystem.reset();
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
      fontSize: '8px', color, fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(20);
    this.tweens.add({
      targets: popup, y: y - 24, alpha: 0, duration: 1200,
      ease: 'Quad.easeOut', onComplete: () => popup.destroy()
    });
  }

  update(_time: number, delta: number): void {
    if (this.gameOver || this.levelComplete) return;

    this.clockSystem.update(delta);
    const escalated = this.clockSystem.isEscalated();

    this.updateMovingPlatforms();

    // Combo decay
    if (this.comboCount > 0) {
      this.comboTimer -= delta;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
        this.registry.set('comboCount', 0);
      }
    }

    // Pit death — fell below the level floor. Mark dead; the blocks below then
    // route it through the normal life-loss / respawn flow.
    const pitY = this.levelConfig.height * TILE_SIZE + 16;
    if (!this.player.isDead && this.player.y > pitY) {
      this.player.isDead = true;
      AudioSystem.getInstance().playDamage();
    }
    if (this.player2 && !this.player2.isDead && this.player2.y > pitY) {
      this.player2.isDead = true;
      AudioSystem.getInstance().playDamage();
    }

    // Player 1
    if (!this.player.isDead) {
      this.player.update(delta);
    } else if (!this.playerDeathHandled) {
      this.handlePlayerDeath();
    }

    // Player 2
    if (this.player2) {
      if (!this.player2.isDead) {
        this.player2.update(delta);
      } else if (!this.p2DeathHandled) {
        this.handleP2Death();
      }
    }

    // Enemies — chase whichever player is still in the game
    const primaryTarget = (this.player.isDead && this.player2 && !this.player2.isDead)
      ? this.player2
      : this.player;
    for (const enemy of this.enemies) {
      if (enemy.isAlive() && enemy.active) {
        const sprite = enemy as unknown as Phaser.Physics.Arcade.Sprite;
        // Walkers that marched into a pit are gone — clean them up.
        if (sprite.y > pitY + 32) {
          enemy.isDead = true;
          sprite.destroy();
          continue;
        }
        enemy.updateAI(primaryTarget, delta, escalated);
        if (sprite.x < 0) sprite.setX(8);
        if (sprite.x > this.levelConfig.width * TILE_SIZE) {
          sprite.setX(this.levelConfig.width * TILE_SIZE - 8);
        }
      }
    }

    // 2P camera: follow midpoint (or the surviving player once one is out)
    if (this.numPlayers === 2 && this.player2) {
      const midX = this.p1Out ? this.player2.x : this.p2Out ? this.player.x
        : (this.player.x + this.player2.x) / 2;
      const midY = this.p1Out ? this.player2.y : this.p2Out ? this.player.y
        : (this.player.y + this.player2.y) / 2;
      const cam = this.cameras.main;
      const halfW = cam.width / 2;
      const halfH = cam.height / 2;
      const clampX = Phaser.Math.Clamp(midX - halfW, 0, this.levelConfig.width * TILE_SIZE - cam.width);
      const clampY = Phaser.Math.Clamp(midY - halfH, 0, this.levelConfig.height * TILE_SIZE - cam.height);
      cam.setScroll(
        Phaser.Math.Linear(cam.scrollX, clampX, 0.1),
        Phaser.Math.Linear(cam.scrollY, clampY, 0.08)
      );
    }

    this.checkCheckpoint();
    this.checkGoal();

    // Sync power states
    this.registry.set('powerState',  this.player.getPowerState());
    if (this.player2) {
      this.registry.set('powerState2', this.player2.getPowerState());
    }

    // Parallax
    const sx = this.cameras.main.scrollX;
    if (this.bgFar)  this.bgFar.tilePositionX  = sx * 0.1;
    if (this.bgMid)  this.bgMid.tilePositionX  = sx * 0.3;
    if (this.bgNear) this.bgNear.tilePositionX  = sx * 0.6;
  }
}
