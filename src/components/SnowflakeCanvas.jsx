import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
  memo,
} from "react";

// 计算三次贝塞尔曲线的两个控制点
const calculateControlPoints = (
  x1,
  y1,
  x2,
  y2,
  angle1,
  angle2,
  tension = 0.3
) => {
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const controlPointDistance = distance * tension;

  const cp1Angle = angle1 + Math.PI / 2;
  const cp1X = x1 + controlPointDistance * Math.cos(cp1Angle);
  const cp1Y = y1 + controlPointDistance * Math.sin(cp1Angle);

  const cp2Angle = angle2 - Math.PI / 2;
  const cp2X = x2 + controlPointDistance * Math.cos(cp2Angle);
  const cp2Y = y2 + controlPointDistance * Math.sin(cp2Angle);

  return { cp1X, cp1Y, cp2X, cp2Y };
};

// 根据总分计算颜色
const calculateColor = (totalScore, numDimensions) => {
  const maxScore = numDimensions * 7;
  const normalized = Math.max(0, Math.min(totalScore / maxScore, 1));

  const hueStart = 0;
  const hueEnd = 100;
  const hue = hueStart + (hueEnd - hueStart) * normalized;

  const saturation = 100;
  const lightness = 55;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// 绘制贝塞尔曲线雪花图
const drawBezierSnowflake = (context, points, angles, snowflakeColor) => {
  if (points.length === 0) return;

  context.beginPath();
  context.moveTo(points[0].x, points[0].y);

  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    const currentAngle = angles[i];
    const nextAngle = angles[(i + 1) % points.length];

    const { cp1X, cp1Y, cp2X, cp2Y } = calculateControlPoints(
      current.x,
      current.y,
      next.x,
      next.y,
      currentAngle,
      nextAngle,
      0.3
    );

    context.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, next.x, next.y);
  }

  context.closePath();
  context.fillStyle = snowflakeColor
    .replace("hsl", "hsla")
    .replace(")", ", 0.7)");
  context.fill();
  context.strokeStyle = snowflakeColor;
  context.lineWidth = 1;
  context.stroke();
};

// 雪花图canvas配置
const CANVAS_CONFIG = {
  centerX: 165, //canvas中心点
  centerY: 165, //canvas中心点
  outerRadius: 120, //雪花图外圈半径
  canvasWidth: 330, //canvas宽度
  canvasHeight: 330, //canvas高度
};

// 使用 forwardRef 让父组件可以通过 ref 访问到 SnowflakeCanvas 内部的 canvas 元素，方便实现如坐标映射、悬浮事件处理等交互。
const SnowflakeCanvas = forwardRef(
  (
    {
      dimensions,
      scores,
      mode,
      highlightSection,
      hoveredSection, // 由外部交互层控制
    },
    ref //父组件传递的 ref
  ) => {
    // 创建 ref 用于存储 canvas 元素
    const canvasRef = useRef(null);
    // 创建 ref 用于存储基础层 canvas 元素
    const baseLayerRef = useRef(null);

    // 把内部 canvas DOM 暴露给父组件（交互层）
    // useImperativeHandle 是 React 提供的一个钩子函数，用于在组件内部暴露一些方法或属性给父组件。
    // 在这里，它将 canvasRef.current 暴露给父组件，使得父组件可以直接访问到内部的 canvas 元素。
    useImperativeHandle(ref, () => canvasRef.current);

    // 绘制交互层（高频更新）
    const renderInteractionLayer = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas || !baseLayerRef.current) return;

      // 🔧 TOC 模式下不需要交互层
      if (mode === "TOC") return;

      const ctx = canvas.getContext("2d");
      const { centerX, centerY, outerRadius } = CANVAS_CONFIG;
      const numDimensions = dimensions.length;

      // 清空画布并绘制基础层
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseLayerRef.current, 0, 0);

      // 只绘制悬浮高亮（COMPANY 模式）
      if (mode === "COMPANY" && hoveredSection !== -1) {
        const anglePerDimension = (Math.PI * 2) / numDimensions;
        const halfAngle = anglePerDimension / 2;
        const centerAngle = hoveredSection * anglePerDimension - Math.PI / 2;
        const startAngle = centerAngle - halfAngle;
        const endAngle = centerAngle + halfAngle;

        // 绘制悬浮扇形的白色半透明填充
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + outerRadius * Math.cos(startAngle),
          centerY + outerRadius * Math.sin(startAngle)
        );
        ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
        ctx.lineTo(centerX, centerY);
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fill();
        ctx.restore();
      }
    }, [dimensions.length, mode, hoveredSection]);

    // useEffect 1: 绘制基础层（低频更新）
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      //主画布层
      const ctx = canvas.getContext("2d");
      const { centerX, centerY, outerRadius } = CANVAS_CONFIG;
      const numDimensions = dimensions.length;

      // 创建离屏 Canvas 缓存基础层
      if (!baseLayerRef.current) {
        baseLayerRef.current = document.createElement("canvas");
        baseLayerRef.current.width = canvas.width;
        baseLayerRef.current.height = canvas.height;
      }
      const baseCtx = baseLayerRef.current.getContext("2d"); //获取基础层canvas上下文
      baseCtx.clearRect(0, 0, canvas.width, canvas.height); //清除基础层

      // 1. 画7个同心圆
      for (let i = 7; i >= 1; i--) {
        baseCtx.beginPath();
        baseCtx.arc(centerX, centerY, i * 17, 0, Math.PI * 2);
        baseCtx.fillStyle = i % 2 === 0 ? "#424B58" : "#2D3642";
        if (i === 1) baseCtx.fillStyle = "#424B58";
        baseCtx.fill();
      }

      // 2. 画参考线（从圆心到最外圈）
      for (let i = 0; i < numDimensions; i++) {
        const angle = (i * (Math.PI * 2)) / numDimensions - Math.PI / 2;
        const startRadius = 34;
        const startX = centerX + startRadius * Math.cos(angle);
        const startY = centerY + startRadius * Math.sin(angle);
        const endX = centerX + outerRadius * Math.cos(angle);
        const endY = centerY + outerRadius * Math.sin(angle);

        baseCtx.beginPath();
        baseCtx.moveTo(startX, startY);
        baseCtx.lineTo(endX, endY);
        baseCtx.strokeStyle = "#424B58";
        baseCtx.lineWidth = 5;
        baseCtx.stroke();
      }

      // 3. 计算所有数据点和角度
      const points = [];
      const angles = [];
      let totalScore = 0;

      for (let i = 0; i < numDimensions; i++) {
        const angle = (i * (Math.PI * 2)) / numDimensions - Math.PI / 2;
        const radius = (scores[i] / 7) * outerRadius;
        totalScore += scores[i];
        angles.push(angle);
        points.push({
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        });
      }

      // 4. 计算动态颜色
      const snowflakeColor = calculateColor(totalScore, numDimensions);

      // 5. 用三次贝塞尔曲线绘制雪花图
      drawBezierSnowflake(baseCtx, points, angles, snowflakeColor);

      // 6. 画旋转的标签
      for (let i = 0; i < numDimensions; i++) {
        const angle = angles[i];
        const labelX = centerX + (outerRadius + 20) * Math.cos(angle);
        const labelY = centerY + (outerRadius + 20) * Math.sin(angle);

        baseCtx.save();
        baseCtx.translate(labelX, labelY);
        let textAngle = angle + Math.PI / 2;
        if (i === 2 || i === 3) {
          textAngle += Math.PI;
        }
        baseCtx.rotate(textAngle);
        baseCtx.fillStyle = "white";
        baseCtx.font = "12px Arial";
        baseCtx.textAlign = "center";
        baseCtx.textBaseline = "middle";
        baseCtx.fillText(dimensions[i], 0, 0);
        baseCtx.restore();
      }

      // 7. TOC 模式：绘制高亮扇形
      if (mode === "TOC" && highlightSection !== "NONE") {
        const highlightIndex = dimensions.indexOf(highlightSection);
        if (highlightIndex === -1) return;

        // 清空画布并绘制基础层
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 绘制基础层
        ctx.drawImage(baseLayerRef.current, 0, 0);

        const scaleFactor = 1.05; //放大 1.05 倍
        const anglePerDimension = (Math.PI * 2) / numDimensions;
        const halfAngle = anglePerDimension / 2;
        const centerAngle = highlightIndex * anglePerDimension - Math.PI / 2;
        const startAngle = centerAngle - halfAngle;
        const endAngle = centerAngle + halfAngle;
        const expandedRadius = outerRadius * scaleFactor;

        // 绘制整个圆形的黑色半透明蒙版
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fill();
        ctx.restore();

        // 在高亮扇形区域擦除蒙版
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + outerRadius * Math.cos(startAngle),
          centerY + outerRadius * Math.sin(startAngle)
        );
        ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
        ctx.lineTo(centerX, centerY);
        ctx.closePath();
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fill();
        ctx.restore();

        // 创建离屏 Canvas 用于缩放效果
        const offscreenCanvas = document.createElement("canvas");
        offscreenCanvas.width = canvas.width;
        offscreenCanvas.height = canvas.height;
        const offCtx = offscreenCanvas.getContext("2d");

        // 计算扇形中心点用于缩放变换
        const midAngle = (startAngle + endAngle) / 2;
        const sectionCenterX = centerX + outerRadius * 0.5 * Math.cos(midAngle);
        const sectionCenterY = centerY + outerRadius * 0.5 * Math.sin(midAngle);

        // 创建扇形裁剪路径
        offCtx.save();
        offCtx.beginPath();
        offCtx.moveTo(centerX, centerY);
        offCtx.lineTo(
          centerX + expandedRadius * Math.cos(startAngle),
          centerY + expandedRadius * Math.sin(startAngle)
        );
        offCtx.arc(centerX, centerY, expandedRadius, startAngle, endAngle);
        offCtx.lineTo(centerX, centerY);
        offCtx.closePath();
        offCtx.clip();

        // 应用缩放变换
        offCtx.save();
        offCtx.translate(sectionCenterX, sectionCenterY);
        offCtx.scale(scaleFactor, scaleFactor);
        offCtx.translate(-sectionCenterX, -sectionCenterY);

        // 绘制同心圆（会被缩放和裁剪）
        for (let i = 7; i >= 1; i--) {
          offCtx.beginPath();
          offCtx.arc(centerX, centerY, i * 17, 0, Math.PI * 2);
          offCtx.fillStyle = i % 2 === 0 ? "#424B58" : "#2D3642";
          if (i === 1) offCtx.fillStyle = "#424B58";
          offCtx.fill();
        }

        // 绘制参考线（会被缩放和裁剪）
        for (let i = 0; i < numDimensions; i++) {
          const angle = (i * (Math.PI * 2)) / numDimensions - Math.PI / 2;
          const startRadius = 34;
          const startX = centerX + startRadius * Math.cos(angle);
          const startY = centerY + startRadius * Math.sin(angle);
          const endX = centerX + outerRadius * Math.cos(angle);
          const endY = centerY + outerRadius * Math.sin(angle);

          offCtx.beginPath();
          offCtx.moveTo(startX, startY);
          offCtx.lineTo(endX, endY);
          offCtx.strokeStyle = "#424B58";
          offCtx.lineWidth = 5;
          offCtx.stroke();
        }

        // 绘制贝塞尔曲线（会被缩放和裁剪）
        drawBezierSnowflake(offCtx, points, angles, snowflakeColor);

        offCtx.restore();
        offCtx.restore();

        // 将离屏 Canvas 绘制到主 Canvas
        ctx.drawImage(offscreenCanvas, 0, 0);
      }

      // 初始渲染交互层
      renderInteractionLayer();

      // 清理函数：组件卸载时清空 Canvas
      return () => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(
            0,
            0,
            CANVAS_CONFIG.canvasWidth,
            CANVAS_CONFIG.canvasHeight
          );
        }
      };
    }, [dimensions, scores, mode, highlightSection, renderInteractionLayer]);

    useEffect(() => {
      renderInteractionLayer();
    }, [renderInteractionLayer]);

    return (
      <canvas
        ref={canvasRef}
        width={330}
        height={330}
        style={{ display: "block" }}
      />
    );
  }
);

SnowflakeCanvas.displayName = "SnowflakeCanvas";

// 优化：使用 memo 记忆化组件，避免不必要的重渲染
export default memo(
  SnowflakeCanvas,
  (prevProps, nextProps) =>
    prevProps.dimensions === nextProps.dimensions &&
    JSON.stringify(prevProps.scores) === JSON.stringify(nextProps.scores) &&
    prevProps.mode === nextProps.mode &&
    prevProps.highlightSection === nextProps.highlightSection &&
    prevProps.hoveredSection === nextProps.hoveredSection
);
