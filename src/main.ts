import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './config';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { HudScene } from './scenes/HudScene';
import { GameOverScene } from './scenes/GameOverScene';
import { LevelTransitionScene } from './scenes/LevelTransitionScene';
import { ShopScene } from './scenes/ShopScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#87ceeb',
  parent: 'game-container',
  pixelArt: true,
  roundPixels: true,
  scale: {
    // NONE + manual integer zoom: scaling the 480×270 canvas by a whole-number
    // factor keeps every pixel uniform and crisp. FIT scales by fractional
    // factors (e.g. 2.33×), which makes nearest-neighbour pixels uneven sizes
    // and looks blurry. autoCenter keeps the canvas centred with letterboxing.
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 1400 },
      debug: false
    }
  },
  scene: [BootScene, MenuScene, LevelTransitionScene, ShopScene, GameScene, HudScene, GameOverScene]
};

const game = new Phaser.Game(config);

// Scale the canvas by the largest whole-number factor that fits the window, so
// pixels stay sharp. Re-applied on resize. Falls back to a fractional zoom only
// when the window is smaller than the native 480×270 (so it never overflows).
// Guards against 0-sized measurements at load (hidden tab / iframe / pre-layout):
// a zero zoom would blank the canvas and stall the render loop, so we retry on
// the next frame until valid dimensions are available, and never zoom below 1×.
function applyCrispZoom(): void {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (!w || !h) {
    requestAnimationFrame(applyCrispZoom);
    return;
  }
  const fit = Math.min(w / GAME_WIDTH, h / GAME_HEIGHT);
  const zoom = fit >= 1 ? Math.floor(fit) : Math.max(fit, 0.1);
  game.scale.setZoom(zoom);
}

applyCrispZoom();
window.addEventListener('resize', applyCrispZoom);
