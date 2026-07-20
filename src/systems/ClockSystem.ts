import Phaser from 'phaser';
import { CLOCK } from '../config';
import { AudioSystem } from '../utils/AudioSystem';

export class ClockSystem {
  private scene: Phaser.Scene;
  private elapsed = 0; // real seconds elapsed
  private escalated = false;
  private alarmed = false;
  private failed = false;
  private onFailCallback?: () => void;
  private onEscalateCallback?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setCallbacks(onFail: () => void, onEscalate: () => void): void {
    this.onFailCallback = onFail;
    this.onEscalateCallback = onEscalate;
  }

  reset(): void {
    this.elapsed = 0;
    this.escalated = false;
    this.alarmed = false;
    this.failed = false;
  }

  update(delta: number): void {
    this.elapsed += delta / 1000;

    const progress = Math.min(this.elapsed / CLOCK.REAL_SECONDS, 1);
    const totalMinutes = progress * 180; // 14:00 to 17:00 = 180 minutes
    const hour = 14 + Math.floor(totalMinutes / 60);
    const minute = Math.floor(totalMinutes % 60);
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    this.scene.registry.set('clockTime', timeStr);
    this.scene.registry.set('clockProgress', progress);

    // Escalation at 16:00 (120 real seconds)
    if (!this.escalated && this.elapsed >= 120) {
      this.escalated = true;
      if (this.onEscalateCallback) {
        this.onEscalateCallback();
      }
    }

    // Fail condition at 17:00 (180 real seconds)
    if (!this.alarmed && this.elapsed >= 178) {
      this.alarmed = true;
      AudioSystem.getInstance().play17Alarm();
    }
    if (!this.failed && this.elapsed >= CLOCK.REAL_SECONDS) {
      this.failed = true;
      if (this.onFailCallback) {
        this.onFailCallback();
      }
    }
  }

  // Hotfix power-up: winds the clock back. One real second equals one
  // in-game minute (180 s ↔ 14:00-17:00), so `minutes` maps 1:1 to seconds.
  rewind(minutes: number): void {
    this.elapsed = Math.max(0, this.elapsed - minutes);
    if (this.elapsed < 178) this.alarmed = false;
  }

  getElapsed(): number {
    return this.elapsed;
  }

  getProgress(): number {
    return Math.min(this.elapsed / CLOCK.REAL_SECONDS, 1);
  }

  isEscalated(): boolean {
    return this.escalated;
  }

  getTimeBonus(): number {
    // More bonus for finishing earlier
    const remaining = CLOCK.REAL_SECONDS - this.elapsed;
    return Math.max(0, Math.floor(remaining * 100));
  }
}
