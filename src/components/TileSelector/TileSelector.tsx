import { motion, AnimatePresence } from 'framer-motion';
import { Tile } from '../../types';
import { ALL_TILES } from '../../constants/tiles';
import { staggerContainer } from '../../constants/animations';
import TileButton from './TileButton';

interface TileSelectorProps {
  onTileSelect: (tile: Tile) => void;
  getTileCount: (tileId: string) => number;
}

const TileSelector = ({ onTileSelect, getTileCount }: TileSelectorProps) => {
  // 創建空占位符
  const createPlaceholder = (id: string) => ({
    type: 'placeholder' as any,
    value: '',
    id: `placeholder-${id}`,
    display: '',
  });

  // 組合所有牌，按照 6x8 固定順序排列（直式佈局）
  // 總共 48 格，42 張牌 + 6 個空位
  const allTiles = [
    // 第1欄: 1-8萬 (8張)
    ALL_TILES.wan[0], ALL_TILES.wan[1], ALL_TILES.wan[2], ALL_TILES.wan[3],
    ALL_TILES.wan[4], ALL_TILES.wan[5], ALL_TILES.wan[6], ALL_TILES.wan[7],
    // 第2欄: 9萬 + 1-7條 (8張)
    ALL_TILES.wan[8],
    ALL_TILES.tiao[0], ALL_TILES.tiao[1], ALL_TILES.tiao[2], ALL_TILES.tiao[3],
    ALL_TILES.tiao[4], ALL_TILES.tiao[5], ALL_TILES.tiao[6],
    // 第3欄: 8-9條 + 1-6筒 (8張)
    ALL_TILES.tiao[7], ALL_TILES.tiao[8],
    ALL_TILES.tong[0], ALL_TILES.tong[1], ALL_TILES.tong[2], ALL_TILES.tong[3],
    ALL_TILES.tong[4], ALL_TILES.tong[5],
    // 第4欄: 7-9筒 + 東南西北中 (8張)
    ALL_TILES.tong[6], ALL_TILES.tong[7], ALL_TILES.tong[8],
    ALL_TILES.wind[0], ALL_TILES.wind[1], ALL_TILES.wind[2], ALL_TILES.wind[3],
    ALL_TILES.dragon[0],
    // 第5欄: 發白 + 春夏秋冬梅蘭 (8張)
    ALL_TILES.dragon[1], ALL_TILES.dragon[2],
    ALL_TILES.flower[0], ALL_TILES.flower[1], ALL_TILES.flower[2], ALL_TILES.flower[3],
    ALL_TILES.flower[4], ALL_TILES.flower[5],
    // 第6欄: 菊竹 + 6空位 (8張)
    ALL_TILES.flower[6], ALL_TILES.flower[7],
    createPlaceholder('1'), createPlaceholder('2'), createPlaceholder('3'),
    createPlaceholder('4'), createPlaceholder('5'), createPlaceholder('6'),
  ];

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white rounded-t-3xl shadow-2xl overflow-hidden min-h-0">
      {/* 牌面網格 - 固定 6 欄 x 8 列（直式佈局）*/}
      <div className="flex-1 p-2 min-h-0 overflow-y-auto scrollbar-hide">
        <motion.div
          className="grid gap-1.5 w-full h-full"
          style={{
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateRows: 'repeat(8, 1fr)',
          }}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence mode="wait">
            {allTiles.map((tile) => {
              // 跳過占位符
              if (tile.type === 'placeholder') {
                return <div key={tile.id} />;
              }

              const count = getTileCount(tile.id);
              const isMaxed = count >= 4 && tile.type !== 'flower';

              return (
                <TileButton
                  key={tile.id}
                  tile={tile}
                  count={count}
                  isMaxed={isMaxed}
                  onSelect={() => onTileSelect(tile)}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default TileSelector;
