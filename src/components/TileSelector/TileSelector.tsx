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

  // 組合所有牌，按照固定順序排列
  const allTiles = [
    ...ALL_TILES.wan,           // 列1: 9 張萬
    ...ALL_TILES.tiao,          // 列2: 9 張條
    ...ALL_TILES.tong,          // 列3: 9 張筒
    ...ALL_TILES.wind,          // 列4: 4 張風
    ...ALL_TILES.dragon,        // 列4: 3 張箭
    createPlaceholder('1'),     // 列4: 空位1
    createPlaceholder('2'),     // 列4: 空位2（補滿9格）
    ...ALL_TILES.flower,        // 列5: 8 張花
  ];

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white rounded-t-3xl shadow-2xl overflow-hidden min-h-0">
      {/* 牌面網格 - 固定 9 列 x 5 行 */}
      <div className="flex-1 p-4 min-h-0">
        <motion.div
          className="grid gap-2 w-full h-full"
          style={{
            gridTemplateColumns: 'repeat(9, 1fr)',
            gridTemplateRows: 'repeat(5, 1fr)',
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
