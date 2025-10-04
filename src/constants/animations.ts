// Framer Motion 動畫配置

// 按鈕點擊動畫
export const buttonTap = {
  scale: 0.95,
  transition: { duration: 0.1 },
};

// 牌加入動畫
export const tileEntry = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
  transition: { type: 'spring', stiffness: 500, damping: 30 },
};

// 牌移除動畫
export const tileExit = {
  initial: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0, transition: { duration: 0.2 } },
};

// 結果面板滑入動畫
export const resultPanelSlide = {
  initial: { y: '100%', opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200,
    }
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: { duration: 0.3 }
  },
};

// 淡入動畫
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// 淡入 + 上移動畫
export const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: { y: -10, opacity: 0, transition: { duration: 0.2 } },
};

// 列表項目依序出現
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerItem = {
  initial: { x: -10, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.2 }
  },
};
