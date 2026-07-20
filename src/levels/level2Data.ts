import { LevelConfig, DocDef, PlatformDef, stampPlatforms } from './levelData';

const W = 220;
const H = 17;

const PLATFORMS: PlatformDef[] = [
  { startCol: 15, endCol: 20, row: 10 },
  { startCol: 30, endCol: 36, row: 9 },
  { startCol: 58, endCol: 64, row: 7 },
  { startCol: 78, endCol: 84, row: 10 },
  { startCol: 95, endCol: 102, row: 8 },
  { startCol: 130, endCol: 137, row: 11 },
  { startCol: 155, endCol: 162, row: 9 },
  { startCol: 180, endCol: 188, row: 11 },
  { startCol: 200, endCol: 208, row: 10 }
];

function buildData(): number[][] {
  const d: number[][] = Array.from({ length: H }, () => new Array(W).fill(0));

  // Ground rows 14-16
  const gaps: [number, number][] = [
    [20, 24], [50, 54], [80, 85], [120, 126], [160, 166], [195, 200]
  ];
  for (const row of [14, 15, 16]) {
    for (let col = 0; col < W; col++) {
      if (!gaps.some(([s, e]) => col >= s && col <= e)) d[row][col] = 1;
    }
  }

  // Server racks (tile 10) — walls and structures
  // Left server cluster
  for (let row = 9; row <= 13; row++) {
    d[row][10] = 10; d[row][11] = 10;
    d[row][28] = 10; d[row][29] = 10;
  }
  // Mid server cluster
  for (let row = 8; row <= 13; row++) {
    d[row][60] = 10; d[row][61] = 10;
    d[row][75] = 10; d[row][76] = 10;
  }
  // Right server cluster
  for (let row = 7; row <= 13; row++) {
    d[row][100] = 10; d[row][101] = 10;
    d[row][115] = 10; d[row][116] = 10;
  }
  // Raised server floor sections
  for (let col = 130; col <= 155; col++) d[13][col] = 1;
  for (let col = 140; col <= 150; col++) d[11][col] = 10;

  // Brick walls
  for (let col = 40; col <= 42; col++) d[12][col] = 2;
  for (let col = 90; col <= 93; col++) d[11][col] = 2;
  for (let col = 170; col <= 173; col++) d[12][col] = 2;

  // Question blocks
  d[12][6]   = 3;
  d[11][35]  = 3;
  d[9][65]   = 3;
  d[8][105]  = 3;
  d[10][145] = 3;
  d[9][185]  = 3;

  // Secret passage: cable duct at row 5, cols 55-70 (walk on top)
  for (let col = 55; col <= 70; col++) d[5][col] = 1;
  // Access: brick staircase up
  for (let i = 0; i < 4; i++) {
    d[13 - i][50 + i] = 2;
  }

  // Checkpoint & Goal
  d[14][110] = 8;
  d[14][212] = 9;

  // VPN
  d[14][45] = 7;
  d[14][55] = 7;

  // Spikes in server room floor
  for (let col = 21; col <= 23; col++) d[14][col] = 6;
  for (let col = 81; col <= 84; col++) d[14][col] = 6;

  // Platforms
  stampPlatforms(d, PLATFORMS, W);

  return d;
}

function buildDocs(): DocDef[] {
  const pos = [
    [3,13],[8,12],[13,13],[18,13],[26,13],[31,10],[37,13],[42,12],
    [46,13],[52,8],[57,6],[63,6],[68,6],[71,12],[78,11],[82,13],
    [88,12],[92,13],[97,9],[103,9],[108,13],[112,13],[118,13],[122,13],
    [127,13],[132,12],[138,12],[142,11],[147,11],[152,12],[158,10],[163,13],
    [167,12],[172,13],[178,13],[182,12],[186,10],[190,13],[195,13],[200,13],
    [205,13],[210,13]
  ];
  return pos.map(([col, row]) => ({ col, row }));
}

export const LEVEL_2: LevelConfig = {
  data: buildData(),
  width: W,
  height: H,
  questionBlocks: [
    { col: 6,   row: 12, content: 'coffee' },
    { col: 35,  row: 11, content: 'doc5' },
    { col: 65,  row: 9,  content: 'energy_drink' },
    { col: 105, row: 8,  content: 'sudo_flower' },
    { col: 145, row: 10, content: 'doc' },
    { col: 185, row: 9,  content: 'backup_tape' }
  ],
  platforms: PLATFORMS,
  enemies: [
    { type: 'ticket',       tileX: 12,  tileY: 14 },
    { type: 'printer',      tileX: 30,  tileY: 13 },
    { type: 'buggy_code',   tileX: 58,  tileY: 6  },
    { type: 'ticket',       tileX: 70,  tileY: 14 },
    { type: 'printer',      tileX: 95,  tileY: 9  },
    { type: 'buggy_code',   tileX: 110, tileY: 9  },
    { type: 'clumsy_user',  tileX: 135, tileY: 12 },
    { type: 'phishing_mail',tileX: 155, tileY: 10 },
    { type: 'buggy_code',   tileX: 170, tileY: 10 },
    { type: 'printer',      tileX: 185, tileY: 12 },
    { type: 'ticket',       tileX: 200, tileY: 14 },
    { type: 'clumsy_user',  tileX: 210, tileY: 14 }
  ],
  docPositions: buildDocs(),
  vpn: { entranceCol: 45, entranceRow: 14, exitCol: 55, exitRow: 14 },
  checkpointCol: 110,
  checkpointRow: 14,
  goalCol: 212,
  goalRow: 14,
  secretRooms: [],
  backgroundTheme: 'serverroom',
  hasBoss: false
};
