import { motion } from 'framer-motion';
import { Wind, WinType, GameSettings } from '../../types';

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

  const baseConfigs = [
    { base: 50, fan: 20, label: '50/20' },
    { base: 100, fan: 20, label: '100/20' },
    { base: 100, fan: 50, label: '100/50' },
    { base: 200, fan: 50, label: '200/50' },
    { base: 300, fan: 100, label: '300/100' },
  ];

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
            onClick={() => onSettingsChange({ winType: 'selfDraw' })}
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
            onClick={() => onSettingsChange({ winType: 'discard' })}
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

      {/* 底台設定 */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">底/台</h3>
        <div className="grid grid-cols-3 gap-2">
          {baseConfigs.map((config) => (
            <motion.button
              key={config.label}
              onClick={() => onSettingsChange({ baseAmount: config.base, fanAmount: config.fan })}
              className={`
                py-3 rounded-xl font-bold text-white text-sm
                shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[2px]
                ${settings.baseAmount === config.base && settings.fanAmount === config.fan
                  ? 'bg-gradient-to-br from-teal-500 to-teal-600'
                  : 'bg-gradient-to-br from-gray-300 to-gray-400'}
              `}
              whileTap={{ y: 2 }}
            >
              {config.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
