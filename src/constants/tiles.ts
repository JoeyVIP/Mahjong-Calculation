import { Tile } from '../types';

// 產生萬子牌
export const generateWanTiles = (): Tile[] => {
  const tiles: Tile[] = [];
  for (let i = 1; i <= 9; i++) {
    tiles.push({
      type: 'wan',
      value: i,
      id: `wan-${i}`,
      display: `${i}萬`,
    });
  }
  return tiles;
};

// 產生條子牌
export const generateTiaoTiles = (): Tile[] => {
  const tiles: Tile[] = [];
  for (let i = 1; i <= 9; i++) {
    tiles.push({
      type: 'tiao',
      value: i,
      id: `tiao-${i}`,
      display: `${i}條`,
    });
  }
  return tiles;
};

// 產生筒子牌
export const generateTongTiles = (): Tile[] => {
  const tiles: Tile[] = [];
  for (let i = 1; i <= 9; i++) {
    tiles.push({
      type: 'tong',
      value: i,
      id: `tong-${i}`,
      display: `${i}筒`,
    });
  }
  return tiles;
};

// 風牌
export const WIND_TILES: Tile[] = [
  { type: 'wind', value: 'east', id: 'wind-east', display: '東' },
  { type: 'wind', value: 'south', id: 'wind-south', display: '南' },
  { type: 'wind', value: 'west', id: 'wind-west', display: '西' },
  { type: 'wind', value: 'north', id: 'wind-north', display: '北' },
];

// 三元牌
export const DRAGON_TILES: Tile[] = [
  { type: 'dragon', value: 'red', id: 'dragon-red', display: '中' },
  { type: 'dragon', value: 'green', id: 'dragon-green', display: '發' },
  { type: 'dragon', value: 'white', id: 'dragon-white', display: '白' },
];

// 花牌
export const FLOWER_TILES: Tile[] = [
  { type: 'flower', value: 'spring', id: 'flower-spring', display: '春' },
  { type: 'flower', value: 'summer', id: 'flower-summer', display: '夏' },
  { type: 'flower', value: 'autumn', id: 'flower-autumn', display: '秋' },
  { type: 'flower', value: 'winter', id: 'flower-winter', display: '冬' },
  { type: 'flower', value: 'plum', id: 'flower-plum', display: '梅' },
  { type: 'flower', value: 'orchid', id: 'flower-orchid', display: '蘭' },
  { type: 'flower', value: 'chrysanthemum', id: 'flower-chrysanthemum', display: '菊' },
  { type: 'flower', value: 'bamboo', id: 'flower-bamboo', display: '竹' },
];

// 所有牌
export const ALL_TILES = {
  wan: generateWanTiles(),
  tiao: generateTiaoTiles(),
  tong: generateTongTiles(),
  wind: WIND_TILES,
  dragon: DRAGON_TILES,
  flower: FLOWER_TILES,
};

// 分類名稱
export const TILE_CATEGORY_NAMES = {
  wan: '萬',
  tiao: '條',
  tong: '筒',
  wind: '風',
  dragon: '箭',
  flower: '花',
};

// 風位顯示名稱
export const WIND_NAMES = {
  east: '東',
  south: '南',
  west: '西',
  north: '北',
};

// 正花對應表 (座位 -> 對應的花)
export const SEAT_FLOWERS = {
  east: ['spring', 'plum'],
  south: ['summer', 'orchid'],
  west: ['autumn', 'chrysanthemum'],
  north: ['winter', 'bamboo'],
};
