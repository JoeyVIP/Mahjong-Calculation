import { motion } from 'framer-motion';
import { CalculationResult } from '../../types';

interface ResultPanelProps {
  result: CalculationResult;
  onClose: () => void;
  onRestart: () => void;
}

const ResultPanel = ({ result, onClose, onRestart }: ResultPanelProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="max-w-lg w-full max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        {/* 標題列 */}
        <div className="sticky top-0 bg-gradient-to-br from-mahjong-green to-mahjong-green-dark text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">🀄 計算結果</h2>
            <button
              onClick={onClose}
              className="text-white bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 總台數大顯示 */}
          <div className="text-center py-4 bg-white/10 rounded-xl backdrop-blur-sm">
            <div className="text-6xl font-bold mb-2">{result.totalFan}</div>
            <div className="text-xl opacity-90">台</div>
          </div>
        </div>

        {/* 台型明細 */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
            <span className="mr-2">📋</span>
            台型明細
          </h3>

          <div className="space-y-2">
            {result.fanTypes.map((fanType, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border-l-4 border-mahjong-green"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-gray-800">{fanType.name}</span>
                  <span className="text-mahjong-green font-bold text-lg">
                    {fanType.fan} 台
                  </span>
                </div>
                <p className="text-sm text-gray-600">{fanType.reason}</p>
              </motion.div>
            ))}
          </div>

          {/* 金額計算 */}
          <div className="mt-6 p-5 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
            <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
              <span className="mr-2">💰</span>
              金額計算
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>底</span>
                <span className="font-mono">{result.basePayment} 元</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>台數</span>
                <span className="font-mono">{result.totalFan} 台</span>
              </div>
            </div>

            <div className="border-t-2 border-yellow-300 pt-3">
              {result.payment.selfDrawPayment ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-800">每家付</span>
                    <span className="text-2xl font-bold text-red-600">
                      {result.payment.selfDrawPayment.perPlayer} 元
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">總收入</span>
                    <span className="text-3xl font-bold text-green-600">
                      {result.payment.selfDrawPayment.total} 元
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">放槍者付</span>
                  <span className="text-3xl font-bold text-red-600">
                    {result.payment.discardPayment?.loser} 元
                  </span>
                </div>
              )}
            </div>

            {/* 計算公式 */}
            <div className="mt-4 p-3 bg-white/60 rounded-lg">
              <p className="text-xs text-gray-600 whitespace-pre-line font-mono">
                {result.formula}
              </p>
            </div>
          </div>

          {/* 按鈕區 */}
          <div className="flex gap-3 mt-6">
            <motion.button
              onClick={onRestart}
              className="flex-1 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
              whileTap={{ scale: 0.98 }}
            >
              重新開始
            </motion.button>
            <motion.button
              onClick={onClose}
              className="flex-1 py-4 rounded-xl font-bold text-lg text-gray-700 bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 shadow-lg"
              whileTap={{ scale: 0.98 }}
            >
              返回
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultPanel;
