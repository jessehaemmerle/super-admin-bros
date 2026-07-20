import Phaser from 'phaser';
import { Enemy } from '../Enemy';

// Virus: läuft wie ein Ticket, aber ein großer Virus "verbreitet sich" —
// beim Stompen zerfällt er in zwei schnellere Mini-Viren (GameScene spawnt
// sie über shouldSplit()). Mini-Viren sterben normal.
export class Virus extends Enemy {
  private baseSpeed: number;
  readonly mini: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, mini = false) {
    super(scene, x, y, 'virus');
    this.mini = mini;
    this.baseSpeed = mini ? 85 : 45;
    this.scoreValue = mini ? 100 : 250;
  }

  init(): void {
    if (this.mini) {
      // Scale first: the body auto-derives its size from frame × scale.
      this.setScale(0.5);
    }
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      if (!this.mini) {
        body.setSize(13, 12);
        body.setOffset(1, 4);
      }
      body.setCollideWorldBounds(false);
      body.setGravityY(0);
    }
    this.setVelocityX(-this.baseSpeed);
    this.anims.play('virus_walk', true);
  }

  shouldSplit(): boolean {
    return !this.mini;
  }

  updateAI(_player: Phaser.GameObjects.GameObject, _delta: number, escalated: boolean): void {
    if (this.isDead) return;
    const speed = escalated ? this.baseSpeed * 1.2 : this.baseSpeed;
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body) return;

    // Turn around at walls
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
      this.anims.play('virus_walk', true);
    }
  }
}
