import Phaser from 'phaser';

export type PowerUpType = 'coffee' | 'sudo_flower' | 'energy_drink' | 'backup_tape' | 'doc' | 'doc5';

export class PowerUp extends Phaser.Physics.Arcade.Sprite {
  public powerType: PowerUpType;
  private collected = false;
  private bobTimer = 0;
  private startY: number;

  constructor(scene: Phaser.Scene, x: number, y: number, type: PowerUpType) {
    super(scene, x, y, type === 'doc' || type === 'doc5' ? 'doc_page' : type);
    this.powerType = type;
    this.startY = y;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setAllowGravity(false);
      body.setImmovable(true);
    }
    this.setDepth(5);
  }

  update(delta: number): void {
    if (this.collected) return;
    this.bobTimer += delta / 1000;
    this.y = this.startY + Math.sin(this.bobTimer * 3) * 2;
  }

  collect(): PowerUpType {
    if (this.collected) return this.powerType;
    this.collected = true;
    this.scene.tweens.add({
      targets: this,
      y: this.y - 20,
      alpha: 0,
      duration: 300,
      onComplete: () => this.destroy()
    });
    return this.powerType;
  }

  isCollected(): boolean {
    return this.collected;
  }

  spawnFromBlock(blockX: number, blockY: number): void {
    this.x = blockX;
    this.y = blockY - 16;
    this.startY = blockY - 16;
    // Animate upward spawn
    this.scene.tweens.add({
      targets: this,
      y: blockY - 24,
      duration: 200,
      ease: 'Quad.easeOut'
    });
  }
}
