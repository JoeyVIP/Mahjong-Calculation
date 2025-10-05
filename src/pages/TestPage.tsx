import { useState } from 'react';
import { runTests } from '../utils/calculator.test';

const TestPage = () => {
  const [output, setOutput] = useState<string>('點擊按鈕開始測試...');

  const handleRunTests = () => {
    // 攔截 console.log
    const logs: string[] = [];
    const originalLog = console.log;

    console.log = (...args: any[]) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };

    try {
      runTests();
      setOutput(logs.join('\n'));
    } catch (error: any) {
      setOutput('執行錯誤：\n' + error.stack);
    } finally {
      console.log = originalLog;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-mahjong-green-dark">
          🀄 台灣麻將計台引擎 - 驗算器
        </h1>

        <button
          onClick={handleRunTests}
          className="block mx-auto mb-8 px-12 py-4 text-xl font-bold text-white bg-gradient-to-br from-mahjong-green to-mahjong-green-dark rounded-xl shadow-[0_4px_0_0_rgba(0,100,0,0.3)] active:shadow-[0_2px_0_0_rgba(0,100,0,0.3)] active:translate-y-[2px] hover:from-mahjong-green-dark hover:to-mahjong-green"
        >
          ▶️ 執行測試
        </button>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <pre className="font-mono text-sm whitespace-pre-wrap leading-relaxed">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
