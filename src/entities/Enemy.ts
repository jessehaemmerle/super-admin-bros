import Phaser from 'phaser';

export abstract class Enemy extends Phaser.Physics.Arcade.Sprite {
  protected alive = true;
  protected speed = 50;
  protected isDead = false;
  protected scoreValue = 100;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  abstract init(): void;
  abstract updateAI(player: Phaser.GameObjects.GameObject, delta: number, escalated: boolean): void;

  getScore(): number {
    return this.scoreValue;
  }

  isAlive(): boolean {
    return this.alive && !this.isDead;
  }

  stomp(): void {
    if (this.isDead) return;
    this.isDead = true;
    this.alive = false;
    this.setVelocity(0, 0);
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.enable = false;
    }
    // Flatten and fade
    this.scene.tweens.add({
      targets: this,
      scaleY: 0.2,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.destroy();
      }
    });
  }

  die(): void {
    if (this.isDead) return;
    this.isDead = true;
    this.alive = false;
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.enable = false;
    }
    this.scene.tweens.add({
      targets: this,
      y: this.y - 30,
      alpha: 0,
      duration: 400,
      onComplete: () => {
        this.destroy();
      }
    });
  }
}
