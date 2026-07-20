// Tile IDs:
// 0 = empty/transparent
// 1 = ground (solid)
// 2 = brick (solid)
// 3 = question block
// 4 = used block
// 5 = platform (one-way, visual only in data)
// 6 = spike (hazard)
// 7 = vpn tunnel tile
// 8 = checkpoint
// 9 = goal (clock)
// 10 = server rack (solid, Level 2)
// 11 = fake wall (renders as brick, no collision)

export type QuestionContent = 'coffee' | 'doc' | 'doc5' | 'energy_drink' | 'sudo_flower' | 'backup_tape' | 'hotfix';

export interface QuestionBlock {
  col: number;
  row: number;
  content: QuestionContent;
}

export interface PlatformDef {
  startCol: number;
  endCol: number;
  row: number;
}

export interface EnemyDef {
  type: 'ticket' | 'printer' | 'phishing_mail' | 'clumsy_user' | 'buggy_code' | 'virus' | 'ceo';
  tileX: number;
  tileY: number;
}

// Elevator-style platform, 3 tiles wide. Oscillates from its start position
// `range` tiles along `axis` and back. col/row address the left tile.
export interface MovingPlatformDef {
  col: number;
  row: number;
  axis: 'x' | 'y';
  range: number;
  speed: number;
}

// Server fan on the floor — its updraft launches players upward.
export interface FanDef {
  col: number;
  row: number;
}

export interface DocDef {
  col: number;
  row: number;
}

export interface VpnDef {
  entranceCol: number;
  entranceRow: number;
  exitCol: number;
  exitRow: number;
}

export interface SecretRoom {
  fakeWallStartCol: number;
  fakeWallEndCol: number;
  fakeWallRow: number;
  fakeWallHeight: number;
  label: string;
}

export interface LevelConfig {
  data: number[][];
  width: number;
  height: number;
  questionBlocks: QuestionBlock[];
  platforms: PlatformDef[];
  movingPlatforms: MovingPlatformDef[];
  fans: FanDef[];
  enemies: EnemyDef[];
  docPositions: DocDef[];
  vpn: VpnDef | null;
  checkpointCol: number;
  checkpointRow: number;
  goalCol: number;
  goalRow: number;
  secretRooms: SecretRoom[];
  backgroundTheme: 'office' | 'serverroom' | 'datacenter' | 'cloud';
  hasBoss: boolean;
}

// ─── LEVEL 1: Büro ─────────────────────────────────────────────────────────

const L1_WIDTH = 200;
const L1_HEIGHT = 17;

// Single source of truth — used both to place the visual tiles in the map
// data and as the one-way collision bodies in the LevelConfig.
const L1_PLATFORMS: PlatformDef[] = [
  { startCol: 23, endCol: 28, row: 11 },
  { startCol: 50, endCol: 56, row: 9 },
  { startCol: 62, endCol: 67, row: 12 },
  { startCol: 94, endCol: 100, row: 10 },
  { startCol: 127, endCol: 133, row: 8 },
  { startCol: 142, endCol: 148, row: 11 },
  { startCol: 167, endCol: 174, row: 12 }
];

// Writes a platform list into the tile grid as tile 5 (visual only).
export function stampPlatforms(data: number[][], platforms: PlatformDef[], width: number): void {
  for (const plat of platforms) {
    for (let col = plat.startCol; col <= plat.endCol; col++) {
      if (col < width) data[plat.row][col] = 5;
    }
  }
}

function buildLevel1Data(): number[][] {
  const data: number[][] = [];
  for (let r = 0; r < L1_HEIGHT; r++) {
    data.push(new Array(L1_WIDTH).fill(0));
  }

  const groundRows = [14, 15, 16];
  const gaps: [number, number][] = [
    [18, 21], [45, 48], [88, 92], [130, 135], [170, 175]
  ];

  for (const row of groundRows) {
    for (let col = 0; col < L1_WIDTH; col++) {
      const inGap = gaps.some(([s, e]) => col >= s && col <= e);
      if (!inGap) data[row][col] = 1;
    }
  }

  // Brick blocks
  for (let col = 35; col <= 37; col++) data[13][col] = 2;
  for (let col = 70; col <= 72; col++) data[13][col] = 2;
  for (let col = 100; col <= 102; col++) data[13][col] = 2;

  // Secret room: fake wall at col 112-115, rows 10-13
  // The room itself (cols 116-124) is empty (0), accessible by walking through
  for (let row = 10; row <= 13; row++) {
    data[row][112] = 11;
    data[row][113] = 11;
  }
  // Secret room walls
  for (let row = 9; row <= 14; row++) {
    data[row][116] = 2;
    data[row][117] = 2;
  }
  // Secret room floor
  for (let col = 112; col <= 116; col++) data[14][col] = 1;

  // Question blocks
  data[13][8] = 3;
  data[12][12] = 3;
  data[10][25] = 3;
  data[8][53] = 3;
  data[9][96] = 3;
  data[7][129] = 3;
  data[11][169] = 3;
  // Secret room question block
  data[13][114] = 3;

  // VPN tiles
  data[14][40] = 7;
  data[14][49] = 7;

  // Checkpoint / Goal
  data[14][105] = 8;
  data[14][193] = 9;

  // Platform tiles (visual)
  stampPlatforms(data, L1_PLATFORMS, L1_WIDTH);

  return data;
}

export const LEVEL_1: LevelConfig = {
  data: buildLevel1Data(),
  width: L1_WIDTH,
  height: L1_HEIGHT,
  questionBlocks: [
    { col: 8,   row: 13, content: 'coffee' },
    { col: 12,  row: 12, content: 'doc5' },
    { col: 25,  row: 10, content: 'doc' },
    { col: 53,  row: 8,  content: 'coffee' },
    { col: 96,  row: 9,  content: 'energy_drink' },
    { col: 114, row: 13, content: 'backup_tape' },
    { col: 129, row: 7,  content: 'sudo_flower' },
    { col: 169, row: 11, content: 'backup_tape' }
  ],
  platforms: L1_PLATFORMS,
  movingPlatforms: [],
  fans: [],
  enemies: [
    { type: 'ticket',       tileX: 16,  tileY: 14 },
    { type: 'ticket',       tileX: 32,  tileY: 14 },
    { type: 'ticket',       tileX: 55,  tileY: 8  },
    { type: 'ticket',       tileX: 75,  tileY: 14 },
    { type: 'printer',      tileX: 97,  tileY: 9  },
    { type: 'phishing_mail',tileX: 140, tileY: 10 },
    { type: 'ticket',       tileX: 162, tileY: 14 },
    { type: 'ticket',       tileX: 178, tileY: 14 },
    { type: 'clumsy_user',  tileX: 185, tileY: 14 }
  ],
  docPositions: buildLevel1Docs(),
  vpn: { entranceCol: 40, entranceRow: 14, exitCol: 49, exitRow: 14 },
  checkpointCol: 105,
  checkpointRow: 14,
  goalCol: 193,
  goalRow: 14,
  secretRooms: [
    {
      fakeWallStartCol: 112,
      fakeWallEndCol: 113,
      fakeWallRow: 10,
      fakeWallHeight: 4,
      label: 'SECRET'
    }
  ],
  backgroundTheme: 'office',
  hasBoss: false
};

function buildLevel1Docs(): DocDef[] {
  const positions = [
    [5,13],[7,13],[10,13],[14,12],[17,13],[22,11],[24,10],[27,11],
    [30,13],[33,13],[38,13],[42,13],[44,13],[51,8],[54,8],[57,9],
    [60,13],[64,12],[66,11],[69,13],[73,13],[77,13],[80,13],[82,13],
    [85,13],[90,13],[95,9],[98,9],[101,13],[104,13],[107,13],[110,13],
    [115,13],[120,13],[125,13],[128,7],[132,8],[136,13],[140,13],[144,11],
    [148,11],[151,13],[155,13],[158,13],[160,13],[165,13],[168,11],[172,12],
    [176,13],[180,13],[183,13],[188,13],[190,13]
  ];
  return positions.map(([col, row]) => ({ col, row }));
}
