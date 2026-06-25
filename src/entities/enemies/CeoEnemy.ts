import Phaser from 'phaser';
import { Enemy } from '../Enemy';
import { AudioSystem } from '../../utils/AudioSystem';

export class CeoEnemy extends Enemy {
  private hp = 6;
  private phase = 1;
  private shootTimer = 0;
  private moveTimer = 0;
  private moveDir = -1;
  private healthBar!: Phaser.GameObjects.Graphics;
  private healthBarBg!: Phaser.GameObjects.Graphics;
  public bullets: Phaser.Physics.Arcade.Group;
  private onDieCallback?: () => void;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'ceo');
    this.scoreValue = 2000;
    this.bullets = scene.physics.add.group();
    this.createHealthBar();
  }

  private createHealthBar(): void {
    this.healthBarBg = this.scene.add.graphics();
    this.healthBarBg.fillStyle(0x440000);
    this.healthBarBg.fillRect(-32, -28, 64, 6);
    this.healthBarBg.setDepth(20);

    this.healthBar = this.scene.add.graphics();
    this.healthBar.setDepth(21);
    this.updateHealthBar();
  }

  private updateHealthBar(): void {
    this.healthBar.clear();
    const pct = Math.max(0, this.hp / 6);
    const color = pct > 0.5 ? 0x22cc44 : pct > 0.25 ? 0xccaa22 : 0xcc2222;
    this.healthBar.fillStyle(color);
    this.healthBar.fillRect(this.x - 32, this.y - 28, Math.floor(64 * pct), 6);
    this.healthBarBg.clear();
    this.healthBarBg.fillStyle(0x440000);
    this.healthBarBg.fillRect(this.x - 32, this.y - 28, 64, 6);
  }

  setOnDieCallback(cb: () => void): void {
    this.onDieCallback = cb;
  }

  init(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setSize(20, 30);
      body.setOffset(2, 2);
      body.setGravityY(0);
      body.setCollideWorldBounds(true);
    }
    this.setVelocityX(this.moveDir * 60);
  }

  takeBossHit(): boolean {
    if (this.isDead) return false;
    this.hp--;
    AudioSystem.getInstance().playBossHit();
    this.setTint(0xff4444);
    this.scene.time.delayedCall(150, () => { if (!this.isDead) this.clearTint(); });
    this.updateHealthBar();

    if (this.hp <= 4 && this.phase === 1) {
      this.phase = 2;
      this.scene.cameras.main.shake(200, 0.02);
    }
    if (this.hp <= 2 && this.phase === 2) {
      this.phase = 3;
      this.scene.cameras.main.shake(300, 0.03);
      this.setTint(0xff2222);
    }
    if (this.hp <= 0) {
      this.bossDie();
      return true;
    }
    return false;
  }

  private bossDie(): void {
    this.isDead = true;
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) body.enable = false;
    this.healthBar.destroy();
    this.healthBarBg.destroy();
    // Explosion sequence
    for (let i = 0; i < 8; i++) {
      this.scene.time.delayedCall(i * 150, () => {
        if (!this.scene) return;
        const ex = this.x + Phaser.Math.Between(-24, 24);
        const ey = this.y + Phaser.Math.Between(-20, 20);
        const boom = this.scene.add.sprite(ex, ey, 'explosion');
        boom.setDepth(25);
        this.scene.time.delayedCall(300, () => { if (boom) boom.destroy(); });
      });
    }
    this.scene.time.delayedCall(1200, () => {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        y: this.y + 40,
        duration: 600,
        onComplete: () => {
          this.destroy();
          if (this.onDieCallback) this.onDieCallback();
        }
      });
    });
  }

  getBullets(): Phaser.Physics.Arcade.Group {
    return this.bullets;
  }

  updateAI(player: Phaser.GameObjects.GameObject, delta: number, _escalated: boolean): void {
    if (this.isDead) return;
    const playerSprite = player as Phaser.Physics.Arcade.Sprite;
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body) return;

    // Movement
    const moveSpeed = 60 + this.phase * 20;
    this.moveTimer += delta;
    if (this.moveTimer > 2000 / this.phase) {
      this.moveTimer = 0;
      this.moveDir *= -1;
      this.setVelocityX(this.moveDir * moveSpeed);
    }
    this.setFlipX(this.moveDir > 0);
    this.updateHealthBar();

    // Shooting
    const shootInterval = Math.max(600, 2000 - this.phase * 400);
    this.shootTimer += delta;
    if (this.shootTimer >= shootInterval) {
      this.shootTimer = 0;
      this.shoot(playerSprite);
    }
  }

  private shoot(player: Phaser.Physics.Arcade.Sprite): void {
    if (this.isDead) return;
    const count = this.phase === 3 ? 3 : this.phase === 2 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      this.scene.time.delayedCall(i * 120, () => {
        if (this.isDead || !this.scene) return;
        const bullet = this.scene.physics.add.sprite(this.x, this.y - 8, 'meeting_proj');
        const bBody = bullet.body as Phaser.Physics.Arcade.Body;
        if (bBody) bBody.setAllowGravity(false);
        const angleOffset = (i - Math.floor(count / 2)) * 0.3;
        const baseAngle = Math.atan2(player.y - this.y, player.x - this.x);
        const speed = 160 + this.phase * 20;
        bullet.setVelocity(
          Math.cos(baseAngle + angleOffset) * speed,
          Math.sin(baseAngle + angleOffset) * speed
        );
        bullet.setDepth(8);
        this.bullets.add(bullet);
        this.scene.time.delayedCall(4000, () => { if (bullet?.active) bullet.destroy(); });
      });
    }
    AudioSystem.getInstance().playBossShoot();
  }

  stomp(): void {
    // Boss can't be stomped, take hit instead
    this.takeBossHit();
  }

  die(): void {
    this.takeBossHit();
  }
}
