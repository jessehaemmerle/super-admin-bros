export interface Upgrades {
  extraSpeed: boolean;
  fasterFire: boolean;
  startShield: boolean;
  extraLives: number;
}

export class UpgradeSystem {
  private static upgrades: Upgrades = {
    extraSpeed: false,
    fasterFire: false,
    startShield: false,
    extraLives: 0
  };

  static reset(): void {
    UpgradeSystem.upgrades = {
      extraSpeed: false,
      fasterFire: false,
      startShield: false,
      extraLives: 0
    };
  }

  static get(): Upgrades {
    return { ...UpgradeSystem.upgrades };
  }

  static applyExtraSpeed(): void { UpgradeSystem.upgrades.extraSpeed = true; }
  static applyFasterFire(): void { UpgradeSystem.upgrades.fasterFire = true; }
  static applyStartShield(): void { UpgradeSystem.upgrades.startShield = true; }
  static applyExtraLife(): void { UpgradeSystem.upgrades.extraLives++; }

  static hasExtraSpeed(): boolean { return UpgradeSystem.upgrades.extraSpeed; }
  static hasFasterFire(): boolean { return UpgradeSystem.upgrades.fasterFire; }
  static hasStartShield(): boolean { return UpgradeSystem.upgrades.startShield; }
  static getExtraLives(): number { return UpgradeSystem.upgrades.extraLives; }
}
