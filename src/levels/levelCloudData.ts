import { LevelConfig, DocDef, PlatformDef, stampPlatforms } from './levelData';

// ─── LEVEL 4: Cloud ────────────────────────────────────────────────────────
// "Wir migrieren in die Cloud!" — ein Himmel-Level aus schwebenden Insel-
// Servern. Fester Boden gibt es nur am Start und am Ziel; dazwischen tragen
// Inseln, fahrende Plattformen und Lüfter-Aufwinde. Abstürzen ist hier die
// eigentliche Gefahr.

const W = 200;
const H = 17;

const PLATFORMS: PlatformDef[] = [
  { startCol: 28,  endCol: 31,  row: 11 },
  { startCol: 40,  endCol: 43,  row: 10 },
  { startCol: 52,  endCol: 56,  row: 10 },
  { startCol: 66,  endCol: 70,  row: 9  },
  { startCol: 82,  endCol: 86,  row: 9  },
  { startCol: 96,  endCol: 99,  row: 10 },
  { startCol: 110, endCol: 114, row: 9  },
  { startCol: 124, endCol: 128, row: 9  },
  { startCol: 138, endCol: 142, row: 9  },
  { startCol: 154, endCol: 157, row: 10 },
  { startCol: 166, endCol: 169, row: 10 },
  { startCol: 180, endCol: 184, row: 12 }
];

// Schwebende Server-Inseln: [startCol, endCol, row]
const ISLANDS: [number, number, number][] = [
  [20, 26, 12], [32, 38, 10], [44, 50, 12], [58, 64, 9],
  [72, 79, 11], [88, 94, 8], [100, 108, 12], [116, 122, 10],
  [130, 136, 8], [144, 152, 11], [158, 164, 9], [170, 178, 12]
];

function buildData(): number[][] {
  const d: number[][] = Array.from({ length: H }, () => new Array(W).fill(0));

  // Fester Boden nur an Start und Ziel
  for (const row of [14, 15, 16]) {
    for (let col = 0; col <= 14; col++) d[row][col] = 1;
    for (let col = 185; col < W; col++) d[row][col] = 1;
  }

  for (const [sc, ec, row] of ISLANDS) {
    for (let col = sc; col <= ec; col++) d[row][col] = 1;
  }

  // Brick ledge above the tallest stretch
  for (let col = 90; col <= 92; col++) d[6][col] = 2;

  // Question blocks (above islands)
  d[9][23]  = 3;
  d[6][61]  = 3;
  d[8][75]  = 3;
  d[5][89]  = 3;
  d[7][119] = 3;
  d[5][133] = 3;
  d[6][161] = 3;

  // Checkpoint on the middle island, goal on the end ground
  d[11][104] = 8;
  d[14][194] = 9;

  stampPlatforms(d, PLATFORMS, W);

  return d;
}

function buildDocs(): DocDef[] {
  const pos = [
    [3,13],[6,13],[10,13],[22,11],[25,11],[29,10],[34,9],[37,9],
    [41,9],[46,11],[49,11],[54,9],[60,8],[63,8],[68,8],[74,10],
    [77,10],[84,8],[90,7],[93,7],[97,9],[102,11],[107,11],[112,8],
    [118,9],[121,9],[126,8],[132,7],[135,7],[140,8],[146,10],[150,10],
    [156,9],[160,8],[163,8],[168,9],[172,11],[176,11],[182,11],[188,13],
    [192,13],[196,13]
  ];
  return pos.map(([col, row]) => ({ col, row }));
}

export const LEVEL_CLOUD: LevelConfig = {
  data: buildData(),
  width: W,
  height: H,
  questionBlocks: [
    { col: 23,  row: 9, content: 'doc5' },
    { col: 61,  row: 6, content: 'hotfix' },
    { col: 75,  row: 8, content: 'coffee' },
    { col: 89,  row: 5, content: 'sudo_flower' },
    { col: 119, row: 7, content: 'energy_drink' },
    { col: 133, row: 5, content: 'hotfix' },
    { col: 161, row: 6, content: 'backup_tape' }
  ],
  platforms: PLATFORMS,
  movingPlatforms: [
    { col: 15,  row: 12, axis: 'x', range: 3, speed: 45 },
    { col: 51,  row: 9,  axis: 'y', range: 3, speed: 35 },
    { col: 80,  row: 10, axis: 'x', range: 5, speed: 50 },
    { col: 109, row: 8,  axis: 'y', range: 3, speed: 40 },
    { col: 153, row: 9,  axis: 'x', range: 4, speed: 50 },
    { col: 179, row: 12, axis: 'x', range: 3, speed: 45 }
  ],
  fans: [
    { col: 35,  row: 9  },
    { col: 76,  row: 10 },
    { col: 101, row: 11 },
    { col: 147, row: 10 },
    { col: 188, row: 13 }
  ],
  enemies: [
    { type: 'buggy_code',   tileX: 30,  tileY: 6  },
    { type: 'virus',        tileX: 35,  tileY: 10 },
    { type: 'phishing_mail',tileX: 50,  tileY: 8  },
    { type: 'virus',        tileX: 61,  tileY: 9  },
    { type: 'virus',        tileX: 76,  tileY: 11 },
    { type: 'buggy_code',   tileX: 85,  tileY: 6  },
    { type: 'phishing_mail',tileX: 110, tileY: 7  },
    { type: 'virus',        tileX: 119, tileY: 10 },
    { type: 'virus',        tileX: 133, tileY: 8  },
    { type: 'buggy_code',   tileX: 140, tileY: 6  },
    { type: 'phishing_mail',tileX: 168, tileY: 8  },
    { type: 'virus',        tileX: 174, tileY: 12 },
    { type: 'ticket',       tileX: 190, tileY: 14 }
  ],
  docPositions: buildDocs(),
  vpn: null,
  checkpointCol: 104,
  checkpointRow: 11,
  goalCol: 194,
  goalRow: 14,
  secretRooms: [],
  backgroundTheme: 'cloud',
  hasBoss: false
};
