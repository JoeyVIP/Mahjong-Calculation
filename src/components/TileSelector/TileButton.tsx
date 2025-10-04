import { motion } from 'framer-motion';
import { Tile } from '../../types';
import { buttonTap, staggerItem } from '../../constants/animations';
import { getTileSvgPath } from '../../utils/tileImages';

interface TileButtonProps {
  tile: Tile;
  count: number;
  isMaxed: boolean;
  onSelect: () => void;
}

const TileButton = ({ tile, count, isMaxed, onSelect }: TileButtonProps) => {
  const svgPath = getTileSvgPath(tile.type, tile.value);
  const hasImage = !!svgPath;

  return (
    <motion.button
      onClick={onSelect}
      disabled={isMaxed}
      className={`relative w-full h-full rounded-md font-bold text-base transition-all ${
        isMaxed
          ? 'bg-gray-300 text-gray-400 cursor-not-allowed shadow-inner'
          : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 hover:from-gray-50 hover:via-white hover:to-gray-50 shadow-[0_4px_0_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.05)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.15),0_2px_4px_0_rgba(0,0,0,0.1)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.1)] active:translate-y-[2px]'
      } border-t-2 border-l border-r border-white/60 overflow-hidden`}
      variants={staggerItem}
      whileTap={!isMaxed ? { y: 2 } : undefined}
      whileHover={!isMaxed ? { y: -2 } : undefined}
    >
      <div className="absolute inset-0 flex items-center justify-center p-1">
        {hasImage ? (
          <img
            src={svgPath}
            alt={tile.display}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className={getTileColor(tile.type)}>{tile.display}</span>
        )}
      </div>

      {count > 0 && (
        <motion.div
          className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border border-yellow-300"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          {count}
        </motion.div>
      )}

      {isMaxed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-md">
          <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </motion.button>
  );
};

const getTileColor = (type: string): string => {
  switch (type) {
    case 'wan':
      return 'text-blue-700 drop-shadow-sm';
    case 'tiao':
      return 'text-green-700 drop-shadow-sm';
    case 'tong':
      return 'text-red-600 drop-shadow-sm';
    case 'wind':
      return 'text-indigo-700 drop-shadow-sm';
    case 'dragon':
      return 'text-red-700 drop-shadow-sm';
    case 'flower':
      return 'text-pink-600 drop-shadow-sm';
    default:
      return 'text-gray-800';
  }
};

export default TileButton;
