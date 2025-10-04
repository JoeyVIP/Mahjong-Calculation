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

  // 組合所有牌，按照 5x9 固定順序排列（直式佈局）
  const allTiles = [
    // 第1欄: 1萬~9萬 (9張)
    ...ALL_TILES.wan,
    // 第2欄: 1條~9條 (9張)
    ...ALL_TILES.tiao,
    // 第3欄: 1筒~9筒 (9張)
    ...ALL_TILES.tong,
    // 第4欄: 東南西北中發白 + 2空位 (9張)
    ...ALL_TILES.wind,          // 4張風
    ...ALL_TILES.dragon,        // 3張箭
    createPlaceholder('1'),
    createPlaceholder('2'),
    // 第5欄: 8張花 + 1空位 (9張)
    ...ALL_TILES.flower,        // 8張花
    createPlaceholder('3'),
  ];

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white rounded-t-3xl shadow-2xl overflow-hidden min-h-0">
      {/* 牌面網格 - 固定 5 欄 x 9 列（直式佈局）*/}
      <div className="flex-1 p-2 min-h-0">
        <motion.div
          className="grid gap-1.5 w-full h-full"
          style={{
            gridTemplateColumns: 'repeat(5, 1fr)',
            gridTemplateRows: 'repeat(9, 1fr)',
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
