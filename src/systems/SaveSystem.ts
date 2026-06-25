const SAVE_KEY = 'super_admin_bros_save';

export interface HighScoreEntry {
  score: number;
  initials: string;
}

interface SaveData {
  highScore: number;
  lastScore: number;
  gamesPlayed: number;
  topScores: HighScoreEntry[];
}

export class SaveSystem {
  private static data: SaveData = {
    highScore: 0,
    lastScore: 0,
    gamesPlayed: 0,
    topScores: []
  };

  static load(): SaveData {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SaveData;
        SaveSystem.data = {
          ...parsed,
          topScores: parsed.topScores ?? []
        };
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

  static submitScore(score: number, initials: string): void {
    SaveSystem.load();
    const entry: HighScoreEntry = { score, initials: initials.toUpperCase().slice(0, 3) };
    SaveSystem.data.topScores.push(entry);
    SaveSystem.data.topScores.sort((a, b) => b.score - a.score);
    SaveSystem.data.topScores = SaveSystem.data.topScores.slice(0, 5);
    if (score > SaveSystem.data.highScore) {
      SaveSystem.data.highScore = score;
    }
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(SaveSystem.data));
    } catch {
      // ignore
    }
  }

  static getTopScores(): HighScoreEntry[] {
    return SaveSystem.data.topScores ?? [];
  }

  static isTopScore(score: number): boolean {
    const scores = SaveSystem.data.topScores ?? [];
    if (scores.length < 5) return score > 0;
    return score > scores[scores.length - 1].score;
  }

  static getHighScore(): number {
    return SaveSystem.load().highScore;
  }

  static getLastScore(): number {
    return SaveSystem.data.lastScore;
  }
}
