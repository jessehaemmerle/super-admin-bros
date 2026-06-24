import Phaser from 'phaser';

export class ScoreSystem {
  private scene: Phaser.Scene;
  private score = 0;
  private docs = 0;
  private lives = 3;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  init(lives: number): void {
    this.score = 0;
    this.docs = 0;
    this.lives = lives;
    this.sync();
  }

  addScore(points: number): void {
    this.score += points;
    this.sync();
  }

  addDoc(): void {
    this.docs++;
    this.score += 10;
    // Every 100 docs = extra life
    if (this.docs > 0 && this.docs % 100 === 0) {
      this.lives++;
    }
    this.sync();
  }

  addLife(): void {
    this.lives++;
    this.sync();
  }

  loseLife(): boolean {
    this.lives--;
    this.sync();
    return this.lives <= 0;
  }

  getLives(): number {
    return this.lives;
  }

  getScore(): number {
    return this.score;
  }

  getDocs(): number {
    return this.docs;
  }

  private sync(): void {
    this.scene.registry.set('score', this.score);
    this.scene.registry.set('docs', this.docs);
    this.scene.registry.set('lives', this.lives);
  }
}
