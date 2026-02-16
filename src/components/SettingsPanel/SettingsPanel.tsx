import { motion } from 'framer-motion';
import { Wind, GameSettings } from '../../types';

interface SettingsPanelProps {
  settings: GameSettings;
  onSettingsChange: (settings: Partial<GameSettings>) => void;
}

const SettingsPanel = ({ settings, onSettingsChange }: SettingsPanelProps) => {
  const winds: { value: Wind; label: string; color: string }[] = [
    { value: 'east', label: '東', color: 'from-blue-500 to-blue-600' },
    { value: 'south', label: '南', color: 'from-green-500 to-green-600' },
    { value: 'west', label: '西', color: 'from-yellow-500 to-yellow-600' },
    { value: 'north', label: '北', color: 'from-gray-500 to-gray-600' },
  ];

  // 防呆邏輯：切換胡牌方式時自動調整相關設定
  const handleWinTypeChange = (winType: 'selfDraw' | 'discard') => {
    if (winType === 'selfDraw') {
      // 自摸時自動清除河底撈魚、搶槓
      onSettingsChange({
        winType,
        isLastTileDiscard: false,
        isRobbingKong: false,
      });
    } else {
      // 胡別人時自動清除海底撈月、槓上開花
      onSettingsChange({
        winType,
        isLastTileDraw: false,
        isKongWin: false,
      });
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 space-y-4">
      {/* 圈風選擇 */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">圈風</h3>
        <div className="grid grid-cols-4 gap-2">
          {winds.map((wind) => (
            <motion.button
              key={wind.value}
              onClick={() => onSettingsChange({ roundWind: wind.value })}
              className={`
                relative py-3 rounded-xl font-bold text-white text-lg
                shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[2px]
                ${settings.roundWind === wind.value ? `bg-gradient-to-br ${wind.color}` : 'bg-gradient-to-br from-gray-300 to-gray-400'}
              `}
              whileTap={{ y: 2 }}
            >
              {wind.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 門風選擇 */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">門風（座位）</h3>
        <div className="grid grid-cols-4 gap-2">
          {winds.map((wind) => (
            <motion.button
              key={wind.value}
              onClick={() => onSettingsChange({ seatWind: wind.value })}
              className={`
                relative py-3 rounded-xl font-bold text-white text-lg
                shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[2px]
                ${settings.seatWind === wind.value ? `bg-gradient-to-br ${wind.color}` : 'bg-gradient-to-br from-gray-300 to-gray-400'}
              `}
              whileTap={{ y: 2 }}
            >
              {wind.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 莊家與連莊 */}
      <div className="flex gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-gray-700 mb-2">莊家</h3>
          <motion.button
            onClick={() => onSettingsChange({ isDealer: !settings.isDealer, dealerStreak: 0 })}
            className={`
              w-full py-3 rounded-xl font-bold text-white text-lg
              shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[2px]
              ${settings.isDealer ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-gray-300 to-gray-400'}
            `}
            whileTap={{ y: 2 }}
          >
            {settings.isDealer ? '是' : '否'}
          </motion.button>
        </div>

        {settings.isDealer && (
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-sm font-bold text-gray-700 mb-2">連莊</h3>
            <div className="flex gap-1">
              <motion.button
                onClick={() => onSettingsChange({ dealerStreak: Math.max(0, settings.dealerStreak - 1) })}
                className="flex-1 py-3 rounded-xl font-bold text-white text-lg bg-gradient-to-br from-gray-400 to-gray-500 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
                whileTap={{ y: 2 }}
              >
                -
              </motion.button>
              <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-xl font-bold text-xl">
                {settings.dealerStreak}
              </div>
              <motion.button
                onClick={() => onSettingsChange({ dealerStreak: settings.dealerStreak + 1 })}
                className="flex-1 py-3 rounded-xl font-bold text-white text-lg bg-gradient-to-br from-gray-400 to-gray-500 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
                whileTap={{ y: 2 }}
              >
                +
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* 胡牌方式 */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">胡牌方式</h3>
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            onClick={() => handleWinTypeChange('selfDraw')}
            className={`
              py-3 rounded-xl font-bold text-white text-lg
              shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[2px]
              ${settings.winType === 'selfDraw' ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-gray-300 to-gray-400'}
            `}
            whileTap={{ y: 2 }}
          >
            自摸
          </motion.button>
          <motion.button
            onClick={() => handleWinTypeChange('discard')}
            className={`
              py-3 rounded-xl font-bold text-white text-lg
              shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[2px]
              ${settings.winType === 'discard' ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-gray-300 to-gray-400'}
            `}
            whileTap={{ y: 2 }}
          >
            胡別人
          </motion.button>
        </div>
      </div>

      {/* 特殊胡牌 */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">特殊胡牌</h3>
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            onClick={() => onSettingsChange({ isKongWin: !settings.isKongWin })}
            className={`
              py-3 rounded-xl font-bold text-white text-lg
              shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[2px]
              ${settings.isKongWin ? 'bg-gradient-to-br from-teal-500 to-teal-600' : 'bg-gradient-to-br from-gray-300 to-gray-400'}
            `}
            whileTap={{ y: 2 }}
          >
            槓上開花
          </motion.button>
          <motion.button
            onClick={() => onSettingsChange({ isRobbingKong: !settings.isRobbingKong })}
            className={`
              py-3 rounded-xl font-bold text-white text-lg
              shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[2px]
              ${settings.isRobbingKong ? 'bg-gradient-to-br from-pink-500 to-pink-600' : 'bg-gradient-to-br from-gray-300 to-gray-400'}
            `}
            whileTap={{ y: 2 }}
          >
            搶槓
          </motion.button>
        </div>
      </div>

      {/* 底台設定 - 輸入欄位 */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">底/台</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* 底金額輸入 */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">底（元）</label>
            <input
              type="number"
              value={settings.baseAmount}
              onChange={(e) => onSettingsChange({ baseAmount: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-3 rounded-xl border-2 border-gray-300 focus:border-teal-500 focus:outline-none text-lg font-bold text-center"
              placeholder="50"
              min="0"
            />
          </div>
          {/* 台金額輸入 */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">每台（元）</label>
            <input
              type="number"
              value={settings.fanAmount}
              onChange={(e) => onSettingsChange({ fanAmount: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-3 rounded-xl border-2 border-gray-300 focus:border-teal-500 focus:outline-none text-lg font-bold text-center"
              placeholder="20"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* 聽牌方式 */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">聽牌方式</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: 'none', label: '無' },
            { value: 'single', label: '單騎' },
            { value: 'middle', label: '中洞' },
            { value: 'edge', label: '邊張' },
          ].map((type) => (
            <motion.button
              key={type.value}
              onClick={() => onSettingsChange({ waitingType: type.value as any })}
              className={`
                py-3 rounded-xl font-bold text-white text-base
                shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[2px]
                ${settings.waitingType === type.value ? 'bg-gradient-to-br from-indigo-500 to-indigo-600' : 'bg-gradient-to-br from-gray-300 to-gray-400'}
              `}
              whileTap={{ y: 2 }}
            >
              {type.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 特殊胡法 */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">特殊胡法</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: 'none', label: '無' },
            { value: 'heaven', label: '天胡' },
            { value: 'earth', label: '地胡' },
            { value: 'human', label: '人胡' },
          ].map((type) => (
            <motion.button
              key={type.value}
              onClick={() => onSettingsChange({ specialWin: type.value as any })}
              className={`
                py-3 rounded-xl font-bold text-white text-base
                shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[2px]
                ${settings.specialWin === type.value ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-gray-300 to-gray-400'}
              `}
              whileTap={{ y: 2 }}
            >
              {type.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 海底/河底 */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">最後一張</h3>
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            onClick={() => onSettingsChange({ isLastTileDraw: !settings.isLastTileDraw, isLastTileDiscard: false })}
            className={`
              py-3 rounded-xl font-bold text-white text-base
              shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[2px]
              ${settings.isLastTileDraw ? 'bg-gradient-to-br from-cyan-500 to-cyan-600' : 'bg-gradient-to-br from-gray-300 to-gray-400'}
            `}
            whileTap={{ y: 2 }}
          >
            海底撈月
          </motion.button>
          <motion.button
            onClick={() => onSettingsChange({ isLastTileDiscard: !settings.isLastTileDiscard, isLastTileDraw: false })}
            className={`
              py-3 rounded-xl font-bold text-white text-base
              shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[2px]
              ${settings.isLastTileDiscard ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-gray-300 to-gray-400'}
            `}
            whileTap={{ y: 2 }}
          >
            河底撈魚
          </motion.button>
        </div>
      </div>

      {/* 花牌數量 */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">花牌數量</h3>
        <div className="flex gap-1 items-center">
          <motion.button
            onClick={() => onSettingsChange({ flowerCount: Math.max(0, settings.flowerCount - 1) })}
            className="flex-1 py-3 rounded-xl font-bold text-white text-lg bg-gradient-to-br from-gray-400 to-gray-500 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
            whileTap={{ y: 2 }}
          >
            -
          </motion.button>
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-rose-100 to-rose-200 rounded-xl font-bold text-2xl py-3 border-2 border-rose-300">
            {settings.flowerCount}
          </div>
          <motion.button
            onClick={() => onSettingsChange({ flowerCount: Math.min(8, settings.flowerCount + 1) })}
            className="flex-1 py-3 rounded-xl font-bold text-white text-lg bg-gradient-to-br from-gray-400 to-gray-500 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
            whileTap={{ y: 2 }}
          >
            +
          </motion.button>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">每朵花 1 台</p>
      </div>
    </div>
  );
};

export default SettingsPanel;
