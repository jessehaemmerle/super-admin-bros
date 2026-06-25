import Phaser from 'phaser';
import { PHYSICS } from '../config';
import { AudioSystem } from '../utils/AudioSystem';

export type PlayerState = 'idle' | 'running' | 'jumping' | 'falling' | 'hurt' | 'dead';
export type PowerUpState = 'small' | 'big' | 'sudo';

export interface PlayerConfig {
  playerId: 1 | 2;
  tint?: number;
}

// Virtual touch/gamepad input — set from HudScene touch buttons
export const TouchInput = {
  left: false,
  right: false,
  jump: false,
  fire: false,
  p2left: false,
  p2right: false,
  p2jump: false,
  p2fire: false
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  private playerState: PlayerState = 'idle';
  private powerState: PowerUpState = 'small';
  readonly playerId: 1 | 2;

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { up: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key };
  private shiftKey!: Phaser.Input.Keyboard.Key;
  private fireKey!: Phaser.Input.Keyboard.Key;
  private xKey!: Phaser.Input.Keyboard.Key;
  // Player 2 keys (WASD already used by P1 alt keys, so P2 uses IJKL + Z)
  private p2keys!: { up: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; fire: Phaser.Input.Keyboard.Key };

  // Physics state
  private lastGrounded = 0;
  private jumpBufferTimer = 0;
  private jumpKeyHeld = false;
  private rising = false;
  private canJump = true;
  private coyoteActive = false;

  // Timers
  private invulTimer = 0;
  private invulDuration = 1500;
  private isInvul = false;
  private blinkTimer = 0;
  private energyDrinkTimer = 0;
  private energyDrinkActive = false;
  private invertControlsTimer = 0;
  private controlsInverted = false;
  private fireTimer = 0;
  private fireCooldown = 300;

  // Callbacks / groups
  private projectilesGroup?: Phaser.Physics.Arcade.Group;
  private checkpointX = 0;
  private checkpointY = 0;
  private facingRight = true;

  // State flags
  public isDead = false;
  public isHurt = false;

  constructor(scene: Phaser.Scene, x: number, y: number, config: PlayerConfig = { playerId: 1 }) {
    super(scene, x, y, 'hank_small', 0);
    this.playerId = config.playerId;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(10);
    if (config.tint) this.setTint(config.tint);
    this.checkpointX = x;
    this.checkpointY = y;
  }

  setupInput(): void {
    if (!this.scene.input.keyboard) return;
    if (this.playerId === 1) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
      this.wasd = {
        up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
      };
      this.shiftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
      this.fireKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
      this.xKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    } else {
      // Player 2: IJKL + Z
      this.p2keys = {
        up:    this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
        left:  this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
        right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
        down:  this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
        fire:  this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
      };
    }
  }

  setProjectilesGroup(group: Phaser.Physics.Arcade.Group): void {
    this.projectilesGroup = group;
  }

  setCheckpoint(x: number, y: number): void {
    this.checkpointX = x;
    this.checkpointY = y;
  }

  invertControls(duration: number): void {
    if (this.isInvul || this.powerState === 'sudo') return;
    this.controlsInverted = true;
    this.invertControlsTimer = duration;
    // Visual indicator - tint red briefly
    this.setTint(0xff4444);
    this.scene.time.delayedCall(200, () => { if (!this.isInvul) this.clearTint(); });
  }

  getPowerState(): PowerUpState {
    return this.powerState;
  }

  getPlayerState(): PlayerState {
    return this.playerState;
  }

  applyPowerUp(type: string): void {
    const audio = AudioSystem.getInstance();
    switch (type) {
      case 'coffee':
        if (this.powerState === 'small') {
          this.powerState = 'big';
          audio.playPowerUp();
          this.updateSprite();
          this.resizeBody();
        }
        break;
      case 'sudo_flower':
        if (this.powerState === 'big' || this.powerState === 'sudo') {
          this.powerState = 'sudo';
          audio.playPowerUp();
          this.updateSprite();
          this.resizeBody();
        } else {
          // First go big, then sudo
          this.powerState = 'big';
          this.scene.time.delayedCall(100, () => {
            this.powerState = 'sudo';
            audio.playPowerUp();
            this.updateSprite();
            this.resizeBody();
          });
        }
        break;
      case 'energy_drink':
        this.energyDrinkActive = true;
        this.energyDrinkTimer = 8000;
        this.isInvul = true;
        this.invulTimer = 8000;
        this.setTint(0xffff44);
        audio.playPowerUp();
        break;
      case 'backup_tape':
        // +1 life handled by GameScene
        audio.playPowerUp();
        break;
    }
  }

  takeDamage(): boolean {
    if (this.isInvul || this.isDead || this.playerState === 'dead') return false;
    const audio = AudioSystem.getInstance();
    audio.playDamage();

    if (this.powerState === 'sudo') {
      this.powerState = 'big';
      this.updateSprite();
      this.resizeBody();
      this.startInvulnerability();
      this.playerState = 'hurt';
      return false;
    } else if (this.powerState === 'big') {
      this.powerState = 'small';
      this.updateSprite();
      this.resizeBody();
      this.startInvulnerability();
      this.playerState = 'hurt';
      return false;
    } else {
      // small → dead
      this.playerState = 'dead';
      this.isDead = true;
      this.setVelocity(0, -200);
      return true;
    }
  }

  private startInvulnerability(): void {
    this.isInvul = true;
    this.invulTimer = this.invulDuration;
    this.isHurt = true;
    this.scene.time.delayedCall(300, () => { this.isHurt = false; });
  }

  private updateSprite(): void {
    if (this.powerState === 'sudo') {
      this.setTexture('hank_sudo');
    } else if (this.powerState === 'big') {
      this.setTexture('hank_big');
    } else {
      this.setTexture('hank_small');
    }
    this.resizeBody();
  }

  private resizeBody(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body) return;
    if (this.powerState === 'small') {
      body.setSize(10, 20);
      body.setOffset(3, 4);
    } else {
      body.setSize(10, 28);
      body.setOffset(3, 4);
    }
  }

  init(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setGravityY(0); // gravity comes from world
      body.setMaxVelocityY(600);
      body.setCollideWorldBounds(true);
    }
    this.resizeBody();
    this.updateSprite();
    this.anims.play('hank_idle', true);
    this.setupInput();
  }

  respawn(): void {
    this.setPosition(this.checkpointX, this.checkpointY);
    this.setVelocity(0, 0);
    this.isDead = false;
    this.playerState = 'idle';
    this.powerState = 'small';
    this.isInvul = false;
    this.invulTimer = 0;
    this.controlsInverted = false;
    this.invertControlsTimer = 0;
    this.clearTint();
    this.setAlpha(1);
    this.updateSprite();
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) body.enable = true;
    this.setActive(true);
    this.setVisible(true);
  }

  fireProjectile(): void {
    if (this.powerState !== 'sudo' || !this.projectilesGroup) return;
    const proj = this.scene.physics.add.sprite(
      this.x + (this.facingRight ? 12 : -12),
      this.y,
      'kill9_proj'
    );
    const projBody = proj.body as Phaser.Physics.Arcade.Body;
    if (projBody) {
      projBody.setAllowGravity(false);
    }
    proj.setVelocityX(this.facingRight ? 280 : -280);
    this.projectilesGroup.add(proj);
    AudioSystem.getInstance().playJump();
    // Auto-destroy
    this.scene.time.delayedCall(3000, () => {
      if (proj && proj.active) proj.destroy();
    });
  }

  update(delta: number): void {
    if (!this.cursors || this.isDead) {
      if (this.isDead) {
        this.updateAnimation();
      }
      return;
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body) return;

    const onGround = body.blocked.down;
    const now = this.scene.time.now;

    // Coyote time tracking
    if (onGround) {
      this.lastGrounded = now;
      this.coyoteActive = false;
    }

    const canCoyoteJump = (now - this.lastGrounded) <= PHYSICS.COYOTE_TIME;

    // Invulnerability timer
    if (this.isInvul) {
      this.invulTimer -= delta;
      this.blinkTimer += delta;
      // Blink every 100ms
      if (this.blinkTimer >= 100) {
        this.blinkTimer = 0;
        this.setAlpha(this.alpha < 0.5 ? 1 : 0.3);
      }
      if (this.invulTimer <= 0) {
        this.isInvul = false;
        this.setAlpha(1);
        this.clearTint();
        if (this.energyDrinkActive) {
          this.energyDrinkActive = false;
        }
      }
    }

    // Energy drink speed boost
    if (this.energyDrinkActive) {
      this.energyDrinkTimer -= delta;
      if (this.energyDrinkTimer <= 0) {
        this.energyDrinkActive = false;
      }
    }

    // Inverted controls timer
    if (this.controlsInverted) {
      this.invertControlsTimer -= delta;
      if (this.invertControlsTimer <= 0) {
        this.controlsInverted = false;
        this.clearTint();
      }
    }

    // Input — Player 1 (cursors + WASD + touch) or Player 2 (IJKL + touch)
    let leftKey: boolean, rightKey: boolean, jumpKey: boolean, downKey: boolean;
    let sprintKey: boolean, fireKeyDown: boolean;

    if (this.playerId === 1) {
      const touch = TouchInput;
      leftKey     = this.cursors.left.isDown  || this.wasd.left.isDown   || touch.left;
      rightKey    = this.cursors.right.isDown || this.wasd.right.isDown  || touch.right;
      jumpKey     = this.cursors.up.isDown    || this.wasd.up.isDown     || this.cursors.space.isDown || touch.jump;
      downKey     = this.cursors.down.isDown  || this.wasd.down.isDown;
      sprintKey   = this.shiftKey?.isDown ?? false;
      fireKeyDown = (this.fireKey?.isDown || this.xKey?.isDown || touch.fire) ?? false;
    } else {
      const touch = TouchInput;
      leftKey     = (this.p2keys?.left.isDown  ?? false) || touch.p2left;
      rightKey    = (this.p2keys?.right.isDown ?? false) || touch.p2right;
      jumpKey     = (this.p2keys?.up.isDown    ?? false) || touch.p2jump;
      downKey     = (this.p2keys?.down.isDown  ?? false);
      sprintKey   = false;
      fireKeyDown = (this.p2keys?.fire.isDown  ?? false) || touch.p2fire;
    }

    const moveLeft = this.controlsInverted ? rightKey : leftKey;
    const moveRight = this.controlsInverted ? leftKey : rightKey;

    // Horizontal movement
    const hasSpeedUpgrade = (this as unknown as { _upgSpeed?: boolean })._upgSpeed === true;
    const baseSpeed = hasSpeedUpgrade ? PHYSICS.RUN_SPEED * 1.25 : PHYSICS.RUN_SPEED;
    const maxSpeed = (this.energyDrinkActive || sprintKey) ? PHYSICS.SPRINT_SPEED : baseSpeed;
    const accel = onGround ? PHYSICS.ACCEL_GROUND : PHYSICS.ACCEL_GROUND * PHYSICS.AIR_CONTROL;
    const friction = onGround ? PHYSICS.FRICTION_GROUND : PHYSICS.FRICTION_GROUND * PHYSICS.AIR_CONTROL;

    if (moveLeft) {
      this.facingRight = false;
      this.setFlipX(true);
      if (body.velocity.x > -maxSpeed) {
        body.velocity.x = Math.max(body.velocity.x - accel * (delta / 1000), -maxSpeed);
      }
    } else if (moveRight) {
      this.facingRight = true;
      this.setFlipX(false);
      if (body.velocity.x < maxSpeed) {
        body.velocity.x = Math.min(body.velocity.x + accel * (delta / 1000), maxSpeed);
      }
    } else {
      // Apply friction
      if (body.velocity.x > 0) {
        body.velocity.x = Math.max(0, body.velocity.x - friction * (delta / 1000));
      } else if (body.velocity.x < 0) {
        body.velocity.x = Math.min(0, body.velocity.x + friction * (delta / 1000));
      }
    }

    // Jump buffer
    const jumpJustPressed = this.playerId === 1
      ? (Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
         Phaser.Input.Keyboard.JustDown(this.wasd.up) ||
         Phaser.Input.Keyboard.JustDown(this.cursors.space))
      : (this.p2keys ? Phaser.Input.Keyboard.JustDown(this.p2keys.up) : false);

    if (jumpJustPressed) {
      this.jumpBufferTimer = PHYSICS.JUMP_BUFFER;
    }
    if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer -= delta;
    }

    // Jump execution
    if (this.jumpBufferTimer > 0 && (onGround || canCoyoteJump)) {
      this.jumpBufferTimer = 0;
      this.coyoteActive = false;
      body.velocity.y = PHYSICS.JUMP_VELOCITY;
      this.rising = true;
      this.playerState = 'jumping';
      AudioSystem.getInstance().playJump();
    }

    // Variable jump - release early to cut jump height
    if (this.rising) {
      if (!jumpKey && body.velocity.y < 0) {
        body.velocity.y *= (1 - (1 - PHYSICS.VARIABLE_JUMP_MULT) * delta / 50);
        if (body.velocity.y > -100) {
          this.rising = false;
        }
      }
      if (body.velocity.y >= 0) {
        this.rising = false;
      }
    }

    // Fire projectile
    if (this.powerState === 'sudo' && fireKeyDown) {
      this.fireTimer -= delta;
      if (this.fireTimer <= 0) {
        this.fireTimer = this.fireCooldown;
        this.fireProjectile();
      }
    } else {
      this.fireTimer = Math.max(0, this.fireTimer - delta);
    }

    // VPN teleport check (pressing down on VPN tile) — emit a per-player event
    // so player 2's down-press doesn't trigger player 1's VPN.
    if (downKey) {
      this.scene.events.emit(this.playerId === 2 ? 'player2_down' : 'player_down', this.x, this.y);
    }

    // Update player state
    if (this.playerState !== 'hurt' && this.playerState !== 'dead') {
      if (!onGround) {
        if (body.velocity.y < 0) {
          this.playerState = 'jumping';
        } else {
          this.playerState = 'falling';
        }
      } else {
        if (Math.abs(body.velocity.x) > 10) {
          this.playerState = 'running';
        } else {
          this.playerState = 'idle';
        }
      }
    }

    this.updateAnimation();
  }

  private updateAnimation(): void {
    if (!this.anims) return;
    const prefix = this.powerState === 'sudo' ? 'hank_sudo_' :
                   this.powerState === 'big' ? 'hank_big_' : 'hank_';

    switch (this.playerState) {
      case 'idle':
        this.anims.play(prefix + 'idle', true);
        break;
      case 'running':
        this.anims.play(prefix + 'run', true);
        break;
      case 'jumping':
        this.anims.play(prefix + 'jump', true);
        break;
      case 'falling':
        this.anims.play(prefix + 'fall', true);
        break;
      case 'hurt':
        this.anims.play(prefix + 'hurt', true);
        if (!this.isHurt) {
          this.playerState = 'idle';
        }
        break;
      case 'dead':
        this.anims.play(prefix + 'hurt', true);
        break;
    }
  }

  isEnergyDrinkActive(): boolean {
    return this.energyDrinkActive;
  }

  isInvulnerable(): boolean {
    return this.isInvul;
  }

  applyUpgradeSpeed(): void {
    // Permanent speed boost via fireCooldown and sprint baseline
    // We store it in a flag and it's read in update via PHYSICS constants override
    (this as unknown as { _upgSpeed: boolean })._upgSpeed = true;
  }

  applyUpgradeFire(): void {
    this.fireCooldown = 150;
  }

  applyStartShield(): void {
    this.isInvul = true;
    this.invulTimer = 3000;
  }
}
