import { LevelConfig, DocDef } from './levelData';

const W = 180;
const H = 17;

function buildData(): number[][] {
  const d: number[][] = Array.from({ length: H }, () => new Array(W).fill(0));

  // Ground rows 14-16
  const gaps: [number, number][] = [
    [15, 20], [35, 40], [60, 66], [90, 96], [120, 128], [150, 157]
  ];
  for (const row of [14, 15, 16]) {
    for (let col = 0; col < W; col++) {
      if (!gaps.some(([s, e]) => col >= s && col <= e)) d[row][col] = 1;
    }
  }

  // Rechenzentrum: server racks everywhere
  const rackCols = [8,9, 22,23, 45,46, 68,69, 80,81, 100,101, 113,114, 132,133];
  for (const col of rackCols) {
    for (let row = 7; row <= 13; row++) d[row][col] = 10;
  }

  // Brick platforms
  for (let col = 25; col <= 30; col++) d[11][col] = 2;
  for (let col = 42; col <= 47; col++) d[10][col] = 2;
  for (let col = 70; col <= 75; col++) d[9][col] = 2;
  for (let col = 98; col <= 104; col++) d[10][col] = 2;
  for (let col = 125; col <= 130; col++) d[9][col] = 2;

  // Question blocks
  d[12][5]   = 3;
  d[10][30]  = 3;
  d[9][50]   = 3;
  d[8][85]   = 3;
  d[10][110] = 3;
  d[7][140]  = 3;

  // Boss arena (last 30 cols): open floor
  for (let row of [14, 15, 16]) {
    for (let col = 148; col < W; col++) d[row][col] = 1;
  }
  // Boss arena wall — leave rows 12-13 open so the player can walk in from
  // the checkpoint; a full-height wall would seal the arena shut.
  for (let row = 0; row < H; row++) {
    if (row === 12 || row === 13) continue;
    d[row][148] = 2;
  }
  // Boss arena ceiling
  for (let col = 148; col < W; col++) d[0][col] = 2;
  for (let col = 148; col < W; col++) d[1][col] = 2;

  // Checkpoint before boss arena
  d[14][142] = 8;
  // Goal (hidden behind boss)
  d[14][173] = 9;

  // VPN
  d[14][55] = 7;
  d[14][65] = 7;

  // Spikes — more hazardous
  for (let col = 16; col <= 19; col++) d[14][col] = 6;
  for (let col = 36; col <= 39; col++) d[14][col] = 6;
  for (let col = 61; col <= 65; col++) d[14][col] = 6;
  for (let col = 91; col <= 95; col++) d[14][col] = 6;

  // Platforms
  const plats: [number, number, number][] = [
    [10, 16, 11], [22, 28, 10], [41, 47, 9],
    [68, 74, 8], [83, 90, 10], [98, 106, 9],
    [115, 122, 8], [130, 138, 11]
  ];
  for (const [sc, ec, row] of plats) {
    for (let col = sc; col <= ec; col++) d[row][col] = 5;
  }

  return d;
}

function buildDocs(): DocDef[] {
  const pos = [
    [3,13],[7,12],[12,13],[18,13],[24,11],[28,11],[33,13],[42,10],
    [47,10],[52,13],[58,13],[67,13],[72,9],[76,13],[82,10],[88,10],
    [94,13],[99,10],[103,10],[108,13],[112,13],[118,9],[123,9],[128,13],
    [133,13],[138,12],[143,13],[150,13],[155,13],[160,13],[165,13],[170,13]
  ];
  return pos.map(([col, row]) => ({ col, row }));
}

export const LEVEL_3: LevelConfig = {
  data: buildData(),
  width: W,
  height: H,
  questionBlocks: [
    { col: 5,   row: 12, content: 'coffee' },
    { col: 30,  row: 10, content: 'sudo_flower' },
    { col: 50,  row: 9,  content: 'energy_drink' },
    { col: 85,  row: 8,  content: 'doc5' },
    { col: 110, row: 10, content: 'backup_tape' },
    { col: 140, row: 7,  content: 'sudo_flower' }
  ],
  platforms: [
    { startCol: 10,  endCol: 16,  row: 11 },
    { startCol: 22,  endCol: 28,  row: 10 },
    { startCol: 41,  endCol: 47,  row: 9  },
    { startCol: 68,  endCol: 74,  row: 8  },
    { startCol: 83,  endCol: 90,  row: 10 },
    { startCol: 98,  endCol: 106, row: 9  },
    { startCol: 115, endCol: 122, row: 8  },
    { startCol: 130, endCol: 138, row: 11 }
  ],
  enemies: [
    { type: 'ticket',       tileX: 5,   tileY: 14 },
    { type: 'buggy_code',   tileX: 25,  tileY: 10 },
    { type: 'ticket',       tileX: 33,  tileY: 14 },
    { type: 'printer',      tileX: 45,  tileY: 10 },
    { type: 'phishing_mail',tileX: 58,  tileY: 9  },
    { type: 'clumsy_user',  tileX: 70,  tileY: 9  },
    { type: 'buggy_code',   tileX: 85,  tileY: 9  },
    { type: 'printer',      tileX: 102, tileY: 10 },
    { type: 'phishing_mail',tileX: 115, tileY: 9  },
    { type: 'buggy_code',   tileX: 122, tileY: 9  },
    { type: 'ticket',       tileX: 135, tileY: 12 },
    { type: 'ceo',          tileX: 160, tileY: 14 }
  ],
  docPositions: buildDocs(),
  vpn: { entranceCol: 55, entranceRow: 14, exitCol: 65, exitRow: 14 },
  checkpointCol: 142,
  checkpointRow: 14,
  goalCol: 173,
  goalRow: 14,
  secretRooms: [],
  backgroundTheme: 'datacenter',
  hasBoss: true
};
