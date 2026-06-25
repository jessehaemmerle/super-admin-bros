import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SHOP_PRICES } from '../config';
import { UpgradeSystem } from '../systems/UpgradeSystem';
import { AudioSystem } from '../utils/AudioSystem';

interface ShopData {
  score: number;
  levelIndex: number;
  numPlayers: number;
}

interface ShopItem {
  key: string;
  label: string;
  desc: string;
  price: number;
  bought: boolean;
  apply: () => void;
  canBuy: () => boolean;
}

export class ShopScene extends Phaser.Scene {
  private shopData!: ShopData;
  private budget = 0;
  private selectedIndex = 0;
  private items: ShopItem[] = [];
  private itemTexts: Phaser.GameObjects.Text[] = [];
  private budgetText!: Phaser.GameObjects.Text;
  private keys!: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; confirm: Phaser.Input.Keyboard.Key; skip: Phaser.Input.Keyboard.Key };

  constructor() {
    super({ key: 'ShopScene' });
  }

  init(data: ShopData): void {
    this.shopData = data;
    this.budget = Math.floor(data.score * 0.3); // 30% of score as shop currency
  }

  create(): void {
    // Background
    const bg = this.add.graphics();
    bg.fillStyle(0x0a0a1a, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    bg.fillStyle(0x1a1a3a, 1);
    bg.fillRect(20, 20, GAME_WIDTH - 40, GAME_HEIGHT - 40);
    bg.lineStyle(2, 0x4444aa);
    bg.strokeRect(20, 20, GAME_WIDTH - 40, GAME_HEIGHT - 40);

    this.add.text(GAME_WIDTH / 2, 32, '── SHOP ──', {
      fontSize: '12px',
      color: '#ffcc00',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 46, 'Investiere deine Punkte weise!', {
      fontSize: '6px',
      color: '#aaaaaa',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    // Budget
    this.budgetText = this.add.text(GAME_WIDTH / 2, 58, `BUDGET: ${this.budget} P`, {
      fontSize: '8px',
      color: '#44ff88',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.buildItems();
    this.renderItems();

    // Controls hint
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 30, '↑↓ Auswählen   ENTER Kaufen   ESC Weiter', {
      fontSize: '6px',
      color: '#666666',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 20, '[ SPACE / ESC = Weiter ohne Kauf ]', {
      fontSize: '6px',
      color: '#888888',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    // Keys
    if (this.input.keyboard) {
      this.keys = {
        up:      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
        down:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
        confirm: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
        skip:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
      };
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).once('down', () => this.proceed());
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).once('down', () => this.proceed());
    }

    this.updateSelection();
  }

  private buildItems(): void {
    this.items = [
      {
        key: 'extra_life',
        label: `+1 Leben`,
        desc: 'Startet das nächste Level mit einem extra Leben.',
        price: SHOP_PRICES.EXTRA_LIFE,
        bought: false,
        apply: () => UpgradeSystem.applyExtraLife(),
        canBuy: () => true
      },
      {
        key: 'extra_speed',
        label: 'Turbo-Schuhe',
        desc: 'Dauerhaft schneller. Einmalig kaufbar.',
        price: SHOP_PRICES.EXTRA_SPEED,
        bought: UpgradeSystem.hasExtraSpeed(),
        apply: () => UpgradeSystem.applyExtraSpeed(),
        canBuy: () => !UpgradeSystem.hasExtraSpeed()
      },
      {
        key: 'faster_fire',
        label: 'Sudo-Overlock',
        desc: 'Sudo-Feuerrate verdoppelt. Einmalig kaufbar.',
        price: SHOP_PRICES.FASTER_FIRE,
        bought: UpgradeSystem.hasFasterFire(),
        apply: () => UpgradeSystem.applyFasterFire(),
        canBuy: () => !UpgradeSystem.hasFasterFire()
      },
      {
        key: 'start_shield',
        label: 'Startschild',
        desc: 'Startet nächstes Level 3 Sek. unverwundbar.',
        price: SHOP_PRICES.START_SHIELD,
        bought: UpgradeSystem.hasStartShield(),
        apply: () => UpgradeSystem.applyStartShield(),
        canBuy: () => !UpgradeSystem.hasStartShield()
      }
    ];
  }

  private renderItems(): void {
    this.itemTexts.forEach(t => t.destroy());
    this.itemTexts = [];

    const startY = 78;
    const lineH = 38;

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const y = startY + i * lineH;
      const affordable = this.budget >= item.price && item.canBuy() && !item.bought;

      const nameColor = item.bought ? '#444444' : affordable ? '#ffffff' : '#666666';
      const priceColor = item.bought ? '#444444' : affordable ? '#ffcc00' : '#884400';

      const prefix = item.bought ? '[✓] ' : '[  ] ';
      const nameText = this.add.text(36, y, prefix + item.label, {
        fontSize: '8px',
        color: nameColor,
        fontFamily: 'monospace'
      });

      const priceText = this.add.text(GAME_WIDTH - 40, y, `${item.price} P`, {
        fontSize: '8px',
        color: priceColor,
        fontFamily: 'monospace'
      }).setOrigin(1, 0);

      const descText = this.add.text(40, y + 12, item.desc, {
        fontSize: '5px',
        color: '#888888',
        fontFamily: 'monospace'
      });

      this.itemTexts.push(nameText, priceText, descText);
    }
  }

  private updateSelection(): void {
    this.renderItems();

    const startY = 78;
    const lineH = 38;
    const y = startY + this.selectedIndex * lineH;

    // Highlight selected row
    if (this.itemTexts.length > 0) {
      // Highlight the name text of selected item
      const nameIdx = this.selectedIndex * 3;
      if (this.itemTexts[nameIdx]) {
        const item = this.items[this.selectedIndex];
        if (!item.bought && item.canBuy() && this.budget >= item.price) {
          this.itemTexts[nameIdx].setColor('#ffff44');
        }
      }
    }

    // Selector arrow
    this.children.list
      .filter(c => c.name === 'selector')
      .forEach(c => c.destroy());

    const arrow = this.add.text(28, y, '▶', {
      fontSize: '8px',
      color: '#ffcc00',
      fontFamily: 'monospace'
    });
    arrow.setName('selector');
  }

  update(): void {
    if (!this.keys) return;

    if (Phaser.Input.Keyboard.JustDown(this.keys.up)) {
      this.selectedIndex = (this.selectedIndex - 1 + this.items.length) % this.items.length;
      this.updateSelection();
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.down)) {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
      this.updateSelection();
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.confirm)) {
      this.tryBuy();
    }
  }

  private tryBuy(): void {
    const item = this.items[this.selectedIndex];
    if (!item || item.bought || !item.canBuy() || this.budget < item.price) return;

    this.budget -= item.price;
    item.bought = true;
    item.apply();
    AudioSystem.getInstance().playShopBuy();

    this.budgetText.setText(`BUDGET: ${this.budget} P`);
    this.updateSelection();

    this.showFeedback(`${item.label} gekauft!`, '#44ff88');
  }

  private showFeedback(msg: string, color: string): void {
    const t = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, msg, {
      fontSize: '9px',
      color,
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(50);

    this.tweens.add({
      targets: t,
      y: GAME_HEIGHT / 2 - 10,
      alpha: 0,
      duration: 1200,
      ease: 'Quad.easeOut',
      onComplete: () => t.destroy()
    });
  }

  private proceed(): void {
    const next = this.shopData.levelIndex;
    this.scene.start('LevelTransitionScene', {
      levelIndex: next,
      numPlayers: this.shopData.numPlayers
    });
  }
}
