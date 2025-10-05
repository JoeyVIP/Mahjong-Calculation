import { calculateFan } from './calculator';
import { Tile, GameSettings } from '../types';

/**
 * 測試用牌生成器
 */
const createTile = (type: string, value: number | string, id: string, display: string): Tile => ({
  type: type as any,
  value,
  id,
  display
});

/**
 * 預設遊戲設定
 */
const defaultSettings: GameSettings = {
  roundWind: 'east',
  seatWind: 'east',
  isDealer: false,
  dealerStreak: 0,
  winType: 'selfDraw',
  isMenQing: false,
  baseAmount: 50,
  fanAmount: 20
};

/**
 * 測試案例
 */
const testCases = [
  {
    name: '【基本】自摸 + 門清 + 無花',
    handTiles: [
      // 123萬, 456條, 789筒, 東東東, 11萬
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 2, 'wan-2', '二萬'),
      createTile('wan', 3, 'wan-3', '三萬'),
      createTile('tiao', 4, 'tiao-4', '四條'),
      createTile('tiao', 5, 'tiao-5', '五條'),
      createTile('tiao', 6, 'tiao-6', '六條'),
      createTile('tong', 7, 'tong-7', '七筒'),
      createTile('tong', 8, 'tong-8', '八筒'),
      createTile('tong', 9, 'tong-9', '九筒'),
      createTile('wind', 'east', 'wind-east', '東'),
      createTile('wind', 'east', 'wind-east', '東'),
      createTile('wind', 'east', 'wind-east', '東'),
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 1, 'wan-1', '一萬'), // 17張
    ],
    exposedTiles: [],
    settings: {
      ...defaultSettings,
      roundWind: 'south',
      seatWind: 'east',
      isDealer: false,
      winType: 'selfDraw'
    },
    expectedFans: ['自摸', '門清', '無花', '門風 東'],
    expectedTotalFan: 4
  },

  {
    name: '【花牌】正花 + 四季 + 四君子',
    handTiles: [
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 2, 'wan-2', '二萬'),
      createTile('wan', 2, 'wan-2', '二萬'),
      createTile('wan', 3, 'wan-3', '三萬'),
      createTile('wan', 3, 'wan-3', '三萬'),
      createTile('wan', 4, 'wan-4', '四萬'),
      createTile('wan', 4, 'wan-4', '四萬'),
      createTile('wan', 5, 'wan-5', '五萬'),
      createTile('wan', 5, 'wan-5', '五萬'),
      createTile('wan', 6, 'wan-6', '六萬'),
      createTile('wan', 6, 'wan-6', '六萬'),
      createTile('wan', 7, 'wan-7', '七萬'),
      createTile('wan', 7, 'wan-7', '七萬'),
      // 八張花牌在門前
      createTile('flower', 'spring', 'flower-spring', '春'),
      createTile('flower', 'summer', 'flower-summer', '夏'),
      createTile('flower', 'autumn', 'flower-autumn', '秋'),
      createTile('flower', 'winter', 'flower-winter', '冬'),
      createTile('flower', 'plum', 'flower-plum', '梅'),
      createTile('flower', 'orchid', 'flower-orchid', '蘭'),
      createTile('flower', 'chrysanthemum', 'flower-chrysanthemum', '菊'),
      createTile('flower', 'bamboo', 'flower-bamboo', '竹'),
    ],
    exposedTiles: [],
    settings: {
      ...defaultSettings,
      seatWind: 'east',
      winType: 'selfDraw'
    },
    expectedFans: ['自摸', '門清', '正花', '四季（四花）', '四君子（四花）', '八花', '七對子', '清一色'],
    expectedTotalFan: 27 // 1+1+1+2+2+8+4+8 = 27
  },

  {
    name: '【風牌】圈風刻 + 門風刻',
    handTiles: [
      createTile('wind', 'east', 'wind-east', '東'),
      createTile('wind', 'east', 'wind-east', '東'),
      createTile('wind', 'east', 'wind-east', '東'),
      createTile('wind', 'south', 'wind-south', '南'),
      createTile('wind', 'south', 'wind-south', '南'),
      createTile('wind', 'south', 'wind-south', '南'),
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 2, 'wan-2', '二萬'),
      createTile('wan', 3, 'wan-3', '三萬'),
      createTile('wan', 4, 'wan-4', '四萬'),
      createTile('wan', 5, 'wan-5', '五萬'),
      createTile('wan', 6, 'wan-6', '六萬'),
      createTile('wan', 7, 'wan-7', '七萬'),
      createTile('wan', 8, 'wan-8', '八萬'),
      createTile('wan', 9, 'wan-9', '九萬'),
      createTile('wan', 9, 'wan-9', '九萬'),
      createTile('wan', 9, 'wan-9', '九萬'),
    ],
    exposedTiles: [],
    settings: {
      ...defaultSettings,
      roundWind: 'east',
      seatWind: 'south',
      winType: 'selfDraw'
    },
    expectedFans: ['自摸', '門清', '無花', '圈風 東', '門風 南', '混一色'],
    expectedTotalFan: 9 // 1+1+1+1+1+4 = 9 (有風牌+萬，所以是混一色)
  },

  {
    name: '【風牌】雙風刻（圈風=門風）',
    handTiles: [
      createTile('wind', 'east', 'wind-east', '東'),
      createTile('wind', 'east', 'wind-east', '東'),
      createTile('wind', 'east', 'wind-east', '東'),
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 2, 'wan-2', '二萬'),
      createTile('wan', 3, 'wan-3', '三萬'),
      createTile('wan', 4, 'wan-4', '四萬'),
      createTile('wan', 5, 'wan-5', '五萬'),
      createTile('wan', 6, 'wan-6', '六萬'),
      createTile('wan', 7, 'wan-7', '七萬'),
      createTile('wan', 8, 'wan-8', '八萬'),
      createTile('wan', 9, 'wan-9', '九萬'),
      createTile('tong', 1, 'tong-1', '一筒'),
      createTile('tong', 1, 'tong-1', '一筒'),
      createTile('tong', 2, 'tong-2', '二筒'),
      createTile('tong', 2, 'tong-2', '二筒'),
      createTile('tong', 3, 'tong-3', '三筒'),
    ],
    exposedTiles: [],
    settings: {
      ...defaultSettings,
      roundWind: 'east',
      seatWind: 'east',
      winType: 'selfDraw'
    },
    expectedFans: ['自摸', '門清', '無花', '雙風 東'],
    expectedTotalFan: 4
  },

  {
    name: '【三元】大三元（中發白都是刻子）',
    handTiles: [
      createTile('dragon', 'red', 'dragon-red', '紅中'),
      createTile('dragon', 'red', 'dragon-red', '紅中'),
      createTile('dragon', 'red', 'dragon-red', '紅中'),
      createTile('dragon', 'green', 'dragon-green', '青發'),
      createTile('dragon', 'green', 'dragon-green', '青發'),
      createTile('dragon', 'green', 'dragon-green', '青發'),
      createTile('dragon', 'white', 'dragon-white', '白板'),
      createTile('dragon', 'white', 'dragon-white', '白板'),
      createTile('dragon', 'white', 'dragon-white', '白板'),
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 2, 'wan-2', '二萬'),
      createTile('wan', 3, 'wan-3', '三萬'),
      createTile('wan', 4, 'wan-4', '四萬'),
      createTile('wan', 4, 'wan-4', '四萬'),
      createTile('wan', 5, 'wan-5', '五萬'),
      createTile('wan', 5, 'wan-5', '五萬'),
      createTile('wan', 6, 'wan-6', '六萬'),
    ],
    exposedTiles: [],
    settings: {
      ...defaultSettings,
      winType: 'selfDraw'
    },
    expectedFans: ['自摸', '門清', '無花', '紅中', '青發', '白板', '大三元', '混一色'],
    expectedTotalFan: 18 // 1+1+1+1+1+1+8+4 = 18 (有三元牌+萬，所以是混一色)
  },

  {
    name: '【牌型】七對子',
    handTiles: [
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 2, 'wan-2', '二萬'),
      createTile('wan', 2, 'wan-2', '二萬'),
      createTile('wan', 3, 'wan-3', '三萬'),
      createTile('wan', 3, 'wan-3', '三萬'),
      createTile('wan', 4, 'wan-4', '四萬'),
      createTile('wan', 4, 'wan-4', '四萬'),
      createTile('wan', 5, 'wan-5', '五萬'),
      createTile('wan', 5, 'wan-5', '五萬'),
      createTile('wan', 6, 'wan-6', '六萬'),
      createTile('wan', 6, 'wan-6', '六萬'),
      createTile('wan', 7, 'wan-7', '七萬'),
      createTile('wan', 7, 'wan-7', '七萬'),
    ],
    exposedTiles: [],
    settings: {
      ...defaultSettings,
      winType: 'selfDraw'
    },
    expectedFans: ['自摸', '門清', '無花', '七對子', '清一色'],
    expectedTotalFan: 15 // 1+1+1+4+8 = 15 (全萬，所以有清一色)
  },

  {
    name: '【牌型】對對胡',
    handTiles: [
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 2, 'wan-2', '二萬'),
      createTile('wan', 2, 'wan-2', '二萬'),
      createTile('wan', 2, 'wan-2', '二萬'),
      createTile('wan', 3, 'wan-3', '三萬'),
      createTile('wan', 3, 'wan-3', '三萬'),
      createTile('wan', 3, 'wan-3', '三萬'),
      createTile('wan', 4, 'wan-4', '四萬'),
      createTile('wan', 4, 'wan-4', '四萬'),
      createTile('wan', 4, 'wan-4', '四萬'),
      createTile('wan', 5, 'wan-5', '五萬'),
      createTile('wan', 5, 'wan-5', '五萬'),
      createTile('wan', 5, 'wan-5', '五萬'),
      createTile('wan', 6, 'wan-6', '六萬'),
      createTile('wan', 6, 'wan-6', '六萬'),
    ],
    exposedTiles: [],
    settings: {
      ...defaultSettings,
      winType: 'selfDraw'
    },
    expectedFans: ['自摸', '門清', '無花', '對對胡', '清一色'],
    expectedTotalFan: 13 // 1+1+1+2+8 = 13 (全萬，所以有清一色)
  },

  {
    name: '【牌型】清一色',
    handTiles: [
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 2, 'wan-2', '二萬'),
      createTile('wan', 3, 'wan-3', '三萬'),
      createTile('wan', 4, 'wan-4', '四萬'),
      createTile('wan', 5, 'wan-5', '五萬'),
      createTile('wan', 6, 'wan-6', '六萬'),
      createTile('wan', 7, 'wan-7', '七萬'),
      createTile('wan', 7, 'wan-7', '七萬'),
      createTile('wan', 7, 'wan-7', '七萬'),
      createTile('wan', 8, 'wan-8', '八萬'),
      createTile('wan', 8, 'wan-8', '八萬'),
      createTile('wan', 8, 'wan-8', '八萬'),
      createTile('wan', 9, 'wan-9', '九萬'),
      createTile('wan', 9, 'wan-9', '九萬'),
      createTile('wan', 9, 'wan-9', '九萬'),
    ],
    exposedTiles: [],
    settings: {
      ...defaultSettings,
      winType: 'selfDraw'
    },
    expectedFans: ['自摸', '門清', '無花', '清一色'],
    expectedTotalFan: 11 // 1+1+1+8
  },

  {
    name: '【牌型】混一色',
    handTiles: [
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 2, 'wan-2', '二萬'),
      createTile('wan', 3, 'wan-3', '三萬'),
      createTile('wan', 4, 'wan-4', '四萬'),
      createTile('wind', 'east', 'wind-east', '東'),
      createTile('wind', 'east', 'wind-east', '東'),
      createTile('wind', 'east', 'wind-east', '東'),
      createTile('dragon', 'red', 'dragon-red', '紅中'),
      createTile('dragon', 'red', 'dragon-red', '紅中'),
      createTile('dragon', 'red', 'dragon-red', '紅中'),
      createTile('wan', 5, 'wan-5', '五萬'),
      createTile('wan', 5, 'wan-5', '五萬'),
      createTile('wan', 6, 'wan-6', '六萬'),
      createTile('wan', 6, 'wan-6', '六萬'),
      createTile('wan', 7, 'wan-7', '七萬'),
    ],
    exposedTiles: [],
    settings: {
      ...defaultSettings,
      roundWind: 'east',
      seatWind: 'east',
      winType: 'selfDraw'
    },
    expectedFans: ['自摸', '門清', '無花', '雙風 東', '紅中', '混一色'],
    expectedTotalFan: 9 // 1+1+1+1+1+4 = 9 (萬+字牌，所以是混一色)
  },

  {
    name: '【莊家】莊家 + 連莊2',
    handTiles: [
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 2, 'wan-2', '二萬'),
      createTile('wan', 3, 'wan-3', '三萬'),
      createTile('wan', 4, 'wan-4', '四萬'),
      createTile('wan', 5, 'wan-5', '五萬'),
      createTile('wan', 6, 'wan-6', '六萬'),
      createTile('wan', 7, 'wan-7', '七萬'),
      createTile('wan', 8, 'wan-8', '八萬'),
      createTile('wan', 9, 'wan-9', '九萬'),
      createTile('tong', 1, 'tong-1', '一筒'),
      createTile('tong', 1, 'tong-1', '一筒'),
      createTile('tong', 1, 'tong-1', '一筒'),
      createTile('tong', 2, 'tong-2', '二筒'),
      createTile('tong', 2, 'tong-2', '二筒'),
      createTile('tong', 3, 'tong-3', '三筒'),
      createTile('tong', 3, 'tong-3', '三筒'),
      createTile('tong', 4, 'tong-4', '四筒'),
    ],
    exposedTiles: [],
    settings: {
      ...defaultSettings,
      isDealer: true,
      dealerStreak: 2,
      winType: 'selfDraw'
    },
    expectedFans: ['自摸', '門清', '無花', '莊家', '連莊 2'],
    expectedTotalFan: 6 // 1+1+1+1+2
  },

  {
    name: '【胡別人】放槍',
    handTiles: [
      createTile('wan', 1, 'wan-1', '一萬'),
      createTile('wan', 2, 'wan-2', '二萬'),
      createTile('wan', 3, 'wan-3', '三萬'),
      createTile('wan', 4, 'wan-4', '四萬'),
      createTile('wan', 5, 'wan-5', '五萬'),
      createTile('wan', 6, 'wan-6', '六萬'),
      createTile('wan', 7, 'wan-7', '七萬'),
      createTile('wan', 8, 'wan-8', '八萬'),
      createTile('wan', 9, 'wan-9', '九萬'),
      createTile('tong', 1, 'tong-1', '一筒'),
      createTile('tong', 1, 'tong-1', '一筒'),
      createTile('tong', 1, 'tong-1', '一筒'),
      createTile('tong', 2, 'tong-2', '二筒'),
      createTile('tong', 2, 'tong-2', '二筒'),
      createTile('tong', 3, 'tong-3', '三筒'),
      createTile('tong', 3, 'tong-3', '三筒'),
      createTile('tong', 4, 'tong-4', '四筒'),
    ],
    exposedTiles: [],
    settings: {
      ...defaultSettings,
      winType: 'discard'
    },
    expectedFans: ['無花'], // 胡別人不算門清
    expectedTotalFan: 1
  }
];

/**
 * 執行測試
 */
export const runTests = () => {
  console.log('========================================');
  console.log('🀄 台灣麻將計台引擎 - 驗算器測試');
  console.log('========================================\n');

  let passCount = 0;
  let failCount = 0;

  testCases.forEach((testCase, index) => {
    console.log(`\n測試 ${index + 1}/${testCases.length}: ${testCase.name}`);
    console.log('─'.repeat(60));

    try {
      const result = calculateFan(
        testCase.handTiles,
        testCase.exposedTiles,
        testCase.settings
      );

      console.log('📊 計算結果：');
      console.log(`   總台數：${result.totalFan} 台`);
      console.log(`   台型明細：`);

      result.fanTypes.forEach(fan => {
        console.log(`   - ${fan.name} (${fan.fan}台)：${fan.reason}`);
      });

      console.log(`\n💰 金額計算：`);
      console.log(`   ${result.formula}`);

      // 驗證台型
      const actualFanNames = result.fanTypes.map(f => f.name);
      const missingFans = testCase.expectedFans.filter(
        name => !actualFanNames.includes(name)
      );
      const extraFans = actualFanNames.filter(
        name => !testCase.expectedFans.includes(name)
      );

      // 驗證總台數
      const totalFanMatch = result.totalFan === testCase.expectedTotalFan;

      if (missingFans.length === 0 && extraFans.length === 0 && totalFanMatch) {
        console.log('\n✅ 測試通過');
        passCount++;
      } else {
        console.log('\n❌ 測試失敗');
        if (missingFans.length > 0) {
          console.log(`   缺少台型：${missingFans.join(', ')}`);
        }
        if (extraFans.length > 0) {
          console.log(`   多餘台型：${extraFans.join(', ')}`);
        }
        if (!totalFanMatch) {
          console.log(
            `   總台數錯誤：預期 ${testCase.expectedTotalFan} 台，實際 ${result.totalFan} 台`
          );
        }
        failCount++;
      }
    } catch (error) {
      console.log('\n❌ 測試失敗（執行錯誤）');
      console.log(`   錯誤訊息：${error}`);
      failCount++;
    }
  });

  console.log('\n========================================');
  console.log('📈 測試總結');
  console.log('========================================');
  console.log(`✅ 通過：${passCount}/${testCases.length}`);
  console.log(`❌ 失敗：${failCount}/${testCases.length}`);
  console.log(
    `📊 通過率：${((passCount / testCases.length) * 100).toFixed(1)}%`
  );
  console.log('========================================\n');
};

// 導出供瀏覽器使用
export default runTests;
