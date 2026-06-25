import Phaser from 'phaser';
import { Enemy } from '../Enemy';

export class BuggyCode extends Enemy {
  private baseSpeed = 70;
  private zigzagTimer = 0;
  private zigzagInterval = 600;
  private dirX = 1;
  private dirY = 1;
  private teleportTimer = 0;
  private teleportInterval = 5000;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'buggy_code');
    this.scoreValue = 175;
    this.baseY = y;
  }

  private baseY: number;

  init(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setSize(12, 12);
      body.setOffset(2, 2);
      body.setAllowGravity(false);
      body.setCollideWorldBounds(true);
    }
    this.anims.play('buggy_fly', true);
    this.setVelocity(this.dirX * this.baseSpeed, this.dirY * 40);
  }

  updateAI(player: Phaser.GameObjects.GameObject, delta: number, escalated: boolean): void {
    if (this.isDead) return;
    const speed = escalated ? this.baseSpeed * 1.3 : this.baseSpeed;
    const playerSprite = player as Phaser.Physics.Arcade.Sprite;
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body) return;

    // Zigzag movement
    this.zigzagTimer += delta;
    if (this.zigzagTimer >= this.zigzagInterval) {
      this.zigzagTimer = 0;
      this.zigzagInterval = Phaser.Math.Between(300, 800);
      this.dirY *= -1;
    }

    // Chase player horizontally
    const dx = playerSprite.x - this.x;
    this.dirX = dx > 0 ? 1 : -1;
    this.setFlipX(this.dirX < 0);

    const dist = Math.abs(dx);
    const chaseSpeed = dist < 80 ? speed * 1.5 : speed;
    this.setVelocityX(this.dirX * chaseSpeed);
    this.setVelocityY(this.dirY * 50);

    // Teleport near player (chaos mechanic)
    this.teleportTimer += delta;
    if (this.teleportTimer >= this.teleportInterval) {
      this.teleportTimer = 0;
      const offsetX = Phaser.Math.Between(-60, 60);
      const offsetY = Phaser.Math.Between(-40, 40);
      this.setPosition(playerSprite.x + offsetX, playerSprite.y + offsetY);
      this.scene.cameras.main.flash(100, 255, 0, 0, false);
    }

    // Wall bounce
    if (body.blocked.left) this.dirX = 1;
    if (body.blocked.right) this.dirX = -1;

    if (!this.anims.isPlaying) {
      this.anims.play('buggy_fly', true);
    }
  }
}
