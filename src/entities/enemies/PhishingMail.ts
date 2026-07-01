import Phaser from 'phaser';
import { Enemy } from '../Enemy';

export class PhishingMail extends Enemy {
  private baseSpeed = 80;
  private sinTime = 0;
  private amplitude = 30;
  private baseY: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'phishing_mail');
    this.baseY = y;
    this.scoreValue = 150;
  }

  init(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setSize(12, 10);
      body.setOffset(2, 3);
      body.setAllowGravity(false);
      body.setCollideWorldBounds(false);
    }
    this.anims.play('phishing_fly', true);
  }

  updateAI(player: Phaser.GameObjects.GameObject, delta: number, escalated: boolean): void {
    if (this.isDead) return;
    const speed = escalated ? this.baseSpeed * 1.15 : this.baseSpeed;
    const playerSprite = player as Phaser.Physics.Arcade.Sprite;
    const dx = playerSprite.x - this.x;
    const dist = Math.abs(dx);

    if (dist > 8) {
      const dir = dx > 0 ? 1 : -1;
      this.setVelocityX(dir * speed);
      this.setFlipX(dir < 0);
    } else {
      this.setVelocityX(0);
    }

    // Sine wave vertical movement
    this.sinTime += delta / 1000;
    const targetY = this.baseY + Math.sin(this.sinTime * 3) * this.amplitude;
    this.setVelocityY((targetY - this.y) * 5);

    if (!this.anims.isPlaying) {
      this.anims.play('phishing_fly', true);
    }
  }
}
