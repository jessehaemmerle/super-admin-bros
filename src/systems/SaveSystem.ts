const SAVE_KEY = 'super_admin_bros_save';

interface SaveData {
  highScore: number;
  lastScore: number;
  gamesPlayed: number;
}

export class SaveSystem {
  private static data: SaveData = {
    highScore: 0,
    lastScore: 0,
    gamesPlayed: 0
  };

  static load(): SaveData {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        SaveSystem.data = JSON.parse(raw) as SaveData;
      }
    } catch {
      // ignore
    }
    return SaveSystem.data;
  }

  static save(score: number): void {
    const data = SaveSystem.data;
    data.gamesPlayed++;
    data.lastScore = score;
    if (score > data.highScore) {
      data.highScore = score;
    }
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  static getHighScore(): number {
    return SaveSystem.load().highScore;
  }

  static getLastScore(): number {
    return SaveSystem.data.lastScore;
  }
}
