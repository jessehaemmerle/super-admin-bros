import { LevelConfig, DocDef, PlatformDef, stampPlatforms } from './levelData';

// ─── LEVEL 3: Netzwerk-Etage ───────────────────────────────────────────────
// Führt die neuen Mechaniken ein: Viren (teilen sich beim Stompen),
// Server-Lüfter (Aufwind) und fahrende Plattformen über den Gruben.

const W = 210;
const H = 17;

const PLATFORMS: PlatformDef[] = [
  { startCol: 12,  endCol: 17,  row: 11 },
  { startCol: 42,  endCol: 46,  row: 9  },
  { startCol: 60,  endCol: 66,  row: 10 },
  { startCol: 86,  endCol: 92,  row: 8  },
  { startCol: 120, endCol: 126, row: 9  },
  { startCol: 154, endCol: 158, row: 10 },
  { startCol: 180, endCol: 186, row: 11 }
];

function buildData(): number[][] {
  const d: number[][] = Array.from({ length: H }, () => new Array(W).fill(0));

  // Ground rows 14-16
  const gaps: [number, number][] = [
    [18, 23], [48, 53], [78, 84], [110, 117], [140, 146], [172, 178]
  ];
  for (const row of [14, 15, 16]) {
    for (let col = 0; col < W; col++) {
      if (!gaps.some(([s, e]) => col >= s && col <= e)) d[row][col] = 1;
    }
  }

  // Patch-Panels / Rack-Türme (tile 10)
  const rackCols = [30, 31, 70, 71, 100, 101, 130, 131, 160, 161];
  for (const col of rackCols) {
    const topRow = col >= 70 && col <= 71 ? 8 : 9;
    for (let row = topRow; row <= 13; row++) d[row][col] = 10;
  }

  // Brick ledges
  for (let col = 55; col <= 57; col++) d[12][col] = 2;
  for (let col = 90; col <= 92; col++) d[11][col] = 2;
  for (let col = 150; col <= 152; col++) d[12][col] = 2;

  // Question blocks
  d[12][8]   = 3;
  d[10][40]  = 3;
  d[12][75]  = 3;
  d[10][105] = 3;
  d[12][135] = 3;
  d[12][168] = 3;
  d[8][190]  = 3;

  // Checkpoint & Goal
  d[14][105] = 8;
  d[14][203] = 9;

  // VPN skips the second gap
  d[14][44] = 7;
  d[14][56] = 7;

  // Spikes (Kabelsalat unter Strom)
  for (let col = 86; col <= 88; col++) d[14][col] = 6;
  for (let col = 119; col <= 121; col++) d[14][col] = 6;

  stampPlatforms(d, PLATFORMS, W);

  return d;
}

function buildDocs(): DocDef[] {
  const pos = [
    [3,13],[6,13],[10,13],[14,10],[16,10],[25,13],[28,13],[33,13],
    [37,13],[43,8],[45,8],[55,11],[58,13],[62,9],[65,9],[68,13],
    [74,13],[76,11],[88,7],[90,7],[94,13],[97,13],[103,13],[107,13],
    [112,10],[115,10],[122,8],[125,8],[128,13],[133,13],[137,13],[143,9],
    [148,13],[151,11],[156,9],[163,13],[166,13],[170,13],[175,10],[182,10],
    [185,10],[192,13],[196,13],[200,13]
  ];
  return pos.map(([col, row]) => ({ col, row }));
}

export const LEVEL_NETWORK: LevelConfig = {
  data: buildData(),
  width: W,
  height: H,
  questionBlocks: [
    { col: 8,   row: 12, content: 'coffee' },
    { col: 40,  row: 10, content: 'hotfix' },
    { col: 75,  row: 12, content: 'doc5' },
    { col: 105, row: 10, content: 'sudo_flower' },
    { col: 135, row: 12, content: 'energy_drink' },
    { col: 168, row: 12, content: 'hotfix' },
    { col: 190, row: 8,  content: 'backup_tape' }
  ],
  platforms: PLATFORMS,
  movingPlatforms: [
    { col: 18,  row: 11, axis: 'x', range: 4, speed: 40 },
    { col: 80,  row: 8,  axis: 'y', range: 4, speed: 35 },
    { col: 111, row: 11, axis: 'x', range: 4, speed: 50 },
    { col: 173, row: 11, axis: 'x', range: 3, speed: 45 }
  ],
  fans: [
    { col: 27, row: 13 },
    { col: 95, row: 13 },
    { col: 148, row: 13 }
  ],
  enemies: [
    { type: 'virus',        tileX: 12,  tileY: 14 },
    { type: 'ticket',       tileX: 35,  tileY: 14 },
    { type: 'buggy_code',   tileX: 55,  tileY: 7  },
    { type: 'virus',        tileX: 60,  tileY: 14 },
    { type: 'printer',      tileX: 70,  tileY: 7  },
    { type: 'virus',        tileX: 90,  tileY: 14 },
    { type: 'phishing_mail',tileX: 100, tileY: 9  },
    { type: 'virus',        tileX: 125, tileY: 14 },
    { type: 'ticket',       tileX: 150, tileY: 14 },
    { type: 'phishing_mail',tileX: 165, tileY: 10 },
    { type: 'virus',        tileX: 185, tileY: 14 },
    { type: 'clumsy_user',  tileX: 195, tileY: 14 }
  ],
  docPositions: buildDocs(),
  vpn: { entranceCol: 44, entranceRow: 14, exitCol: 56, exitRow: 14 },
  checkpointCol: 105,
  checkpointRow: 14,
  goalCol: 203,
  goalRow: 14,
  secretRooms: [],
  backgroundTheme: 'serverroom',
  hasBoss: false
};
