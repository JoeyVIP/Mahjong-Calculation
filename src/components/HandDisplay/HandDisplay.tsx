import { motion, AnimatePresence } from 'framer-motion';
import { Tile, TilePosition } from '../../types';
import { STANDARD_HAND_SIZE } from '../../constants/rules';
import { tileEntry } from '../../constants/animations';
import { getTileSvgPath } from '../../utils/tileImages';

interface HandDisplayProps {
  handTiles: Tile[];
  exposedTiles: Tile[];
  inputMode: TilePosition;
  onRemoveTile: (index: number, position: TilePosition) => void;
  onToggleInputMode: () => void;
}

const HandDisplay = ({ handTiles, exposedTiles, inputMode, onRemoveTile, onToggleInputMode }: HandDisplayProps) => {
  // 計算不含花牌的牌數
  const handCountWithoutFlower = handTiles.filter(tile => tile.type !== 'flower').length;
  const exposedCountWithoutFlower = exposedTiles.filter(tile => tile.type !== 'flower').length;
  const totalCountWithoutFlower = handCountWithoutFlower + exposedCountWithoutFlower;

  // 計算花牌數量（用於顯示）
  const flowerCount = handTiles.filter(tile => tile.type === 'flower').length +
                      exposedTiles.filter(tile => tile.type === 'flower').length;

  const isOverLimit = totalCountWithoutFlower > STANDARD_HAND_SIZE;

  const renderTiles = (tiles: Tile[], position: TilePosition, emptyMessage: string) => {
    if (tiles.length === 0) {
      return (
        <motion.div
          className="w-full flex items-center justify-center text-gray-400 text-sm py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {emptyMessage}
        </motion.div>
      );
    }

    return tiles.map((tile, index) => {
      const svgPath = getTileSvgPath(tile.type, tile.value);
      const hasImage = !!svgPath;

      return (
        <motion.button
          key={`${position}-${tile.id}-${index}`}
          onClick={() => onRemoveTile(index, position)}
          className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors group shadow-md hover:shadow-lg overflow-hidden"
          style={{ width: '48px', height: '60px' }}
          variants={tileEntry}
          initial="initial"
          animate="animate"
          exit="exit"
          layout
        >
          <div className="absolute inset-0 flex items-center justify-center p-1">
            {hasImage ? (
              <img
                src={svgPath}
                alt={tile.display}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className={`text-lg font-bold ${getTileColor(tile.type)}`}>
                {tile.display}
              </span>
            )}
          </div>
          <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-red-500 to-red-600 text-white w-5 h-5 rounded-full items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:flex shadow-lg">
            ✕
          </div>
        </motion.button>
      );
    });
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 shadow-lg border-b border-gray-200 shrink-0">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* 切換按鈕 */}
            <motion.button
              onClick={onToggleInputMode}
              className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 shadow-[0_2px_0_0_rgba(0,0,0,0.1)] active:shadow-[0_1px_0_0_rgba(0,0,0,0.1)] active:translate-y-[1px] border-t border-white/50"
              whileTap={{ y: 1 }}
            >
              <img
                src={inputMode === 'hand' ? '/icons/hand-tiles.svg' : '/icons/exposed-tiles.svg'}
                alt={inputMode === 'hand' ? '輸入手牌' : '輸入門前'}
                className="w-6 h-6"
              />
            </motion.button>
            <div className="text-sm font-medium text-gray-600">
              {inputMode === 'hand' ? '輸入手牌' : '輸入門前'}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <div className={`text-2xl font-bold ${
                isOverLimit ? 'text-red-500' : totalCountWithoutFlower === STANDARD_HAND_SIZE ? 'text-green-600' : 'text-gray-600'
              }`}>
                {totalCountWithoutFlower}/{STANDARD_HAND_SIZE}
              </div>
              {flowerCount > 0 && (
                <div className="text-xs text-pink-600">
                  +{flowerCount}花
                </div>
              )}
            </div>
            <motion.button
              className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 shadow-[0_2px_0_0_rgba(0,0,0,0.1)] active:shadow-[0_1px_0_0_rgba(0,0,0,0.1)] active:translate-y-[1px] border-t border-white/50"
              whileTap={{ y: 1 }}
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </motion.button>
          </div>
        </div>

        {isOverLimit && (
          <motion.div
            className="mb-2 text-sm text-red-500 font-medium"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ⚠️ 超過 {STANDARD_HAND_SIZE} 張，請移除多餘的牌
          </motion.div>
        )}

        {/* 門前牌 */}
        <div className="mb-2">
          <h3 className="text-xs font-medium text-gray-500 mb-1">門前</h3>
          <div className="flex flex-wrap gap-2 min-h-[70px] justify-center">
            <AnimatePresence>
              {renderTiles(exposedTiles, 'exposed', '點選下方牌面並切換到「輸入門前」模式')}
            </AnimatePresence>
          </div>
        </div>

        {/* 手牌 */}
        <div>
          <h3 className="text-xs font-medium text-gray-500 mb-1">手牌</h3>
          <div className="flex flex-wrap gap-2 min-h-[70px] justify-center">
            <AnimatePresence>
              {renderTiles(handTiles, 'hand', '點選下方牌面並切換到「輸入手牌」模式')}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const getTileColor = (type: string): string => {
  switch (type) {
    case 'wan':
      return 'text-blue-600';
    case 'tiao':
      return 'text-green-600';
    case 'tong':
      return 'text-orange-600';
    case 'wind':
      return 'text-purple-600';
    case 'dragon':
      return 'text-red-600';
    case 'flower':
      return 'text-pink-600';
    default:
      return 'text-gray-800';
  }
};

export default HandDisplay;
