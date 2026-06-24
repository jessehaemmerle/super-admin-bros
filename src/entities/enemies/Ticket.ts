import Phaser from 'phaser';
import { Enemy } from '../Enemy';

export class Ticket extends Enemy {
  private baseSpeed = 50;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'ticket');
    this.scoreValue = 100;
  }

  init(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setSize(14, 14);
      body.setOffset(1, 0);
      body.setCollideWorldBounds(false);
      body.setGravityY(0);
    }
    this.setVelocityX(-this.baseSpeed);
    this.anims.play('ticket_walk', true);
    this.setFlipX(false);
  }

  updateAI(_player: Phaser.GameObjects.GameObject, _delta: number, escalated: boolean): void {
    if (this.isDead) return;
    const speed = escalated ? this.baseSpeed * 1.15 : this.baseSpeed;
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body) return;

    // Turn around at edges and walls
    if (body.blocked.left || body.blocked.right) {
      const newVx = -(body.velocity.x > 0 ? speed : -speed);
      this.setVelocityX(newVx);
      this.setFlipX(newVx > 0);
    }

    // Maintain speed
    if (Math.abs(body.velocity.x) < speed * 0.5) {
      const dir = this.flipX ? 1 : -1;
      this.setVelocityX(dir * speed);
    }

    if (!this.anims.isPlaying) {
      this.anims.play('ticket_walk', true);
    }
  }
}
