// Canvas 配置常量 - 在多个组件间共享
export const CANVAS_CONFIG = {
  CENTER_X: 165, // Canvas 中心点 X 坐标
  CENTER_Y: 165, // Canvas 中心点 Y 坐标
  OUTER_RADIUS: 120, // 雪花图外圈半径
  INNER_RADIUS: 17, // 雪花图内圈半径（用于判断点击区域）
  CANVAS_WIDTH: 330, // Canvas 宽度
  CANVAS_HEIGHT: 330, // Canvas 高度
};

// 绘制配置常量
export const DRAW_CONFIG = {
  CIRCLE_COUNT: 7, // 同心圆数量
  CIRCLE_RADIUS_MULTIPLIER: 17, // 同心圆半径倍数
  START_RADIUS: 34, // 参考线起始半径
  LABEL_OFFSET: 20, // 标签距离外圈的偏移
  LINE_WIDTH: 5, // 参考线宽度
  MAX_SCORE: 7, // 单个维度最大分数
  SCALE_FACTOR: 1.05, // TOC 模式放大倍数
  SECTOR_MID_RADIUS_FACTOR: 0.5, // 扇形中点半径因子
};

// 颜色配置常量
export const COLOR_CONFIG = {
  CIRCLE_EVEN: "#424B58", // 偶数圆颜色
  CIRCLE_ODD: "#2D3642", // 奇数圆颜色
  REFERENCE_LINE: "#424B58", // 参考线颜色
  LABEL_COLOR: "white", // 标签颜色
  HOVER_HIGHLIGHT: "rgba(255, 255, 255, 0.1)", // 悬浮高亮颜色
  TOC_MASK: "rgba(0, 0, 0, 0.5)", // TOC 蒙版颜色
  TOC_MASK_CLEAR: "rgba(0, 0, 0, 1)", // TOC 蒙版清除颜色
};

// 样式配置常量
export const STYLE_CONFIG = {
  LABEL_FONT: "12px Arial", // 标签字体
  SNOWFLAKE_OPACITY: 0.7, // 雪花图透明度
  BEZIER_TENSION: 0.3, // 贝塞尔曲线张力
  STROKE_WIDTH: 1, // 雪花图描边宽度
};

// 颜色渐变配置
export const COLOR_GRADIENT = {
  HUE_START: 0, // 起始色相（红色）
  HUE_END: 100, // 结束色相（黄绿色）
  SATURATION: 100, // 饱和度
  LIGHTNESS: 55, // 亮度
};

// 默认值常量
export const DEFAULT_VALUES = {
  OFFSET: { mainAxis: -165, crossAxis: 0 }, // 默认 Tooltip offset
  HOVERED_SECTION: -1, // 默认悬浮状态
  TOTAL_CHECKS: 6, // 默认检查项数量
};

// 性能配置
export const PERFORMANCE_CONFIG = {
  THROTTLE_DELAY: 16, // 节流延迟时间（ms），约 60fps
};

// 工具函数：浅比较两个数组是否相等
export const shallowArrayEqual = (arr1, arr2) => {
  if (arr1 === arr2) return true;
  if (!arr1 || !arr2) return false;
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
};
