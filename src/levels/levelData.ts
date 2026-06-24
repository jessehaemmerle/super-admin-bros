// Tile IDs:
// 0 = empty/transparent
// 1 = ground (solid)
// 2 = brick (breakable appearance, solid)
// 3 = question block
// 4 = used block
// 6 = spike (hazard)
// 7 = vpn tunnel tile
// 8 = checkpoint
// 9 = goal (clock)

export const LEVEL_WIDTH = 200;
export const LEVEL_HEIGHT = 17;

// Question block contents: key = "col,row", value = type
export type QuestionContent = 'coffee' | 'doc' | 'doc5' | 'energy_drink' | 'sudo_flower' | 'backup_tape';

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
  type: 'ticket' | 'printer' | 'phishing_mail' | 'clumsy_user';
  tileX: number;
  tileY: number;
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

// Build the 2D tile array (200 cols × 17 rows)
function buildLevelData(): number[][] {
  const data: number[][] = [];
  for (let r = 0; r < LEVEL_HEIGHT; r++) {
    data.push(new Array(LEVEL_WIDTH).fill(0));
  }

  // Ground rows 15 and 16 (indices 14 and 15 in 0-based, but level rows 0-16)
  // Row 15 = top surface of ground, Row 16 = below
  const groundRows = [14, 15, 16];
  const gaps = [
    [18, 21], [45, 48], [88, 92], [130, 135], [170, 175]
  ];

  for (const row of groundRows) {
    if (row >= LEVEL_HEIGHT) continue;
    for (let col = 0; col < LEVEL_WIDTH; col++) {
      let inGap = false;
      for (const [start, end] of gaps) {
        if (col >= start && col <= end) { inGap = true; break; }
      }
      if (!inGap) {
        data[row][col] = 1;
      }
    }
  }

  // Brick blocks
  // y=13, x=35-37
  for (let col = 35; col <= 37; col++) data[13][col] = 2;
  // y=13, x=70-72
  for (let col = 70; col <= 72; col++) data[13][col] = 2;
  // y=13, x=100-102
  for (let col = 100; col <= 102; col++) data[13][col] = 2;

  // Question blocks
  data[13][8] = 3;   // coffee
  data[12][12] = 3;  // 5 docs
  data[10][25] = 3;  // doc
  data[8][53] = 3;   // coffee
  data[9][96] = 3;   // energy drink
  data[7][129] = 3;  // sudo flower
  data[11][169] = 3; // backup tape

  // VPN tiles
  data[14][40] = 7;
  data[14][49] = 7;

  // Checkpoint
  data[14][105] = 8;

  // Goal
  data[14][193] = 9;

  // Platform tiles (one-way) - drawn as platform type
  // These are actually handled separately as static groups
  // but we mark them in data as tile 5 for visual
  const platforms: PlatformDef[] = [
    { startCol: 23, endCol: 28, row: 11 },
    { startCol: 50, endCol: 56, row: 9 },
    { startCol: 62, endCol: 67, row: 12 },
    { startCol: 94, endCol: 100, row: 10 },
    { startCol: 127, endCol: 133, row: 8 },
    { startCol: 142, endCol: 148, row: 11 },
    { startCol: 167, endCol: 174, row: 12 }
  ];
  for (const plat of platforms) {
    for (let col = plat.startCol; col <= plat.endCol; col++) {
      if (plat.row < LEVEL_HEIGHT && col < LEVEL_WIDTH) {
        data[plat.row][col] = 5;
      }
    }
  }

  return data;
}

export const LEVEL_DATA: number[][] = buildLevelData();

export const QUESTION_BLOCKS: QuestionBlock[] = [
  { col: 8,   row: 13, content: 'coffee' },
  { col: 12,  row: 12, content: 'doc5' },
  { col: 25,  row: 10, content: 'doc' },
  { col: 53,  row: 8,  content: 'coffee' },
  { col: 96,  row: 9,  content: 'energy_drink' },
  { col: 129, row: 7,  content: 'sudo_flower' },
  { col: 169, row: 11, content: 'backup_tape' }
];

export const PLATFORMS: PlatformDef[] = [
  { startCol: 23, endCol: 28, row: 11 },
  { startCol: 50, endCol: 56, row: 9 },
  { startCol: 62, endCol: 67, row: 12 },
  { startCol: 94, endCol: 100, row: 10 },
  { startCol: 127, endCol: 133, row: 8 },
  { startCol: 142, endCol: 148, row: 11 },
  { startCol: 167, endCol: 174, row: 12 }
];

export const ENEMIES: EnemyDef[] = [
  { type: 'ticket',       tileX: 16,  tileY: 14 },
  { type: 'ticket',       tileX: 32,  tileY: 14 },
  { type: 'ticket',       tileX: 55,  tileY: 8  },
  { type: 'ticket',       tileX: 75,  tileY: 14 },
  { type: 'printer',      tileX: 97,  tileY: 9  },
  { type: 'phishing_mail',tileX: 140, tileY: 10 },
  { type: 'ticket',       tileX: 162, tileY: 14 },
  { type: 'ticket',       tileX: 178, tileY: 14 },
  { type: 'clumsy_user',  tileX: 185, tileY: 14 }
];

export const VPN: VpnDef = {
  entranceCol: 40,
  entranceRow: 14,
  exitCol: 49,
  exitRow: 14
};

export const CHECKPOINT_COL = 105;
export const CHECKPOINT_ROW = 14;
export const GOAL_COL = 193;
export const GOAL_ROW = 14;

// Distribute ~40 doc pages throughout the level
function buildDocPositions(): DocDef[] {
  const docs: DocDef[] = [];
  const positions = [
    [5,13],[7,13],[10,13],[14,12],[17,13],[22,11],[24,10],[27,11],
    [30,13],[33,13],[38,13],[42,13],[44,13],[51,8],[54,8],[57,9],
    [60,13],[64,12],[66,11],[69,13],[73,13],[77,13],[80,13],[82,13],
    [85,13],[90,13],[95,9],[98,9],[101,13],[104,13],[107,13],[110,13],
    [115,13],[120,13],[125,13],[128,7],[132,8],[136,13],[140,13],[144,11],
    [148,11],[151,13],[155,13],[158,13],[160,13],[165,13],[168,11],[172,12],
    [176,13],[180,13],[183,13],[188,13],[190,13]
  ];
  for (const [col, row] of positions) {
    docs.push({ col, row });
  }
  return docs;
}

export const DOC_POSITIONS: DocDef[] = buildDocPositions();
