import Phaser from 'phaser';
import { Enemy } from '../Enemy';

export class ClumsyUser extends Enemy {
  private baseSpeed = 40;
  private detectionRange = 160;
  private platformsGroup?: Phaser.Physics.Arcade.StaticGroup;
  private removedTiles: Phaser.Tilemaps.Tile[] = [];
  private platformTimer = 0;
  private platformInterval = 2000; // ms - removes a platform tile every 2s when near player

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'clumsy_user');
    this.scoreValue = 300;
  }

  setPlatformsGroup(group: Phaser.Physics.Arcade.StaticGroup): void {
    this.platformsGroup = group;
  }

  init(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setSize(12, 22);
      body.setOffset(2, 1);
      body.setCollideWorldBounds(false);
      body.setGravityY(0);
    }
    this.setVelocityX(-this.baseSpeed);
    this.anims.play('clumsy_walk', true);
  }

  updateAI(player: Phaser.GameObjects.GameObject, delta: number, escalated: boolean): void {
    if (this.isDead) return;
    const speed = escalated ? this.baseSpeed * 1.1 : this.baseSpeed;
    const playerSprite = player as Phaser.Physics.Arcade.Sprite;
    const dist = Phaser.Math.Distance.Between(this.x, this.y, playerSprite.x, playerSprite.y);
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body) return;

    if (dist < this.detectionRange) {
      // Follow player slowly
      const dx = playerSprite.x - this.x;
      const dir = dx > 0 ? 1 : -1;
      this.setVelocityX(dir * speed);
      this.setFlipX(dir < 0);

      // Platform disruption
      this.platformTimer += delta;
      if (this.platformTimer >= this.platformInterval && this.platformsGroup) {
        this.platformTimer = 0;
        // Remove a nearby platform tile
        this.removePlatformNear(playerSprite.x, playerSprite.y);
      }
    } else {
      // Wander
      if (body.blocked.left || body.blocked.right) {
        this.setVelocityX(body.velocity.x > 0 ? -speed : speed);
        this.setFlipX(body.velocity.x < 0);
      }
    }

    if (!this.anims.isPlaying) {
      this.anims.play('clumsy_walk', true);
    }
  }

  private removePlatformNear(_px: number, _py: number): void {
    if (!this.platformsGroup) return;
    const children = this.platformsGroup.getChildren() as Phaser.Physics.Arcade.Image[];
    if (children.length === 0) return;
    // Remove the closest platform tile to this enemy
    let closest: Phaser.Physics.Arcade.Image | null = null;
    let closestDist = Infinity;
    for (const child of children) {
      const d = Phaser.Math.Distance.Between(this.x, this.y, child.x, child.y);
      if (d < closestDist && d < 100) {
        closestDist = d;
        closest = child;
      }
    }
    if (closest) {
      // Make tile blink and disappear temporarily
      this.scene.tweens.add({
        targets: closest,
        alpha: 0,
        duration: 300,
        yoyo: false,
        onComplete: () => {
          if (closest) {
            closest.setActive(false);
            closest.setVisible(false);
            const body = closest.body as Phaser.Physics.Arcade.StaticBody;
            if (body) body.enable = false;
            // Restore after 5 seconds
            this.scene.time.delayedCall(5000, () => {
              if (closest) {
                closest.setActive(true);
                closest.setVisible(true);
                closest.setAlpha(1);
                const body2 = closest.body as Phaser.Physics.Arcade.StaticBody;
                if (body2) body2.enable = true;
              }
            });
          }
        }
      });
    }
  }
}
