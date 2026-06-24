import Phaser from 'phaser';
import { Enemy } from '../Enemy';

export class Printer extends Enemy {
  private shootTimer = 0;
  private shootInterval = 2500; // ms
  public bullets: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'printer');
    this.scoreValue = 200;
    this.bullets = scene.physics.add.group();
  }

  init(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setSize(22, 22);
      body.setOffset(1, 1);
      body.setImmovable(true);
      body.setAllowGravity(false);
    }
    this.setVelocity(0, 0);
  }

  updateAI(player: Phaser.GameObjects.GameObject, delta: number, escalated: boolean): void {
    if (this.isDead) return;
    const interval = escalated ? this.shootInterval * 0.7 : this.shootInterval;
    this.shootTimer += delta;
    if (this.shootTimer >= interval) {
      this.shootTimer = 0;
      this.shoot(player as Phaser.Physics.Arcade.Sprite);
    }
  }

  private shoot(player: Phaser.Physics.Arcade.Sprite): void {
    const bullet = this.scene.physics.add.sprite(this.x, this.y - 8, 'printer_bullet');
    const body = bullet.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setAllowGravity(false);
    }
    const dx = player.x - this.x;
    const angle = Math.atan2(player.y - this.y, dx);
    const speed = 150;
    bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    this.bullets.add(bullet);

    // Auto-destroy after 5 seconds
    this.scene.time.delayedCall(5000, () => {
      if (bullet && bullet.active) bullet.destroy();
    });
  }

  getBullets(): Phaser.Physics.Arcade.Group {
    return this.bullets;
  }
}
