import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import TooltipMessage from "./Tooltipmessage";
import SnowflakeCanvas from "./SnowflakeCanvas";
import { Box } from "@chakra-ui/react";

const SnowflakeTooltip = ({
  dimensions,
  scores,
  descriptions,
  sections,
  mode,
  highlightSection,
}) => {
  const canvasRef = useRef(null);
  const [hoveredSection, setHoveredSection] = useState(-1);

  // 计算当前悬浮维度的检查通过数量
  const getChecksCount = useCallback(
    (sectionIndex) => {
      if (sectionIndex === -1 || !sections[sectionIndex]) return 0;
      return sections[sectionIndex].filter(Boolean).length;
    },
    [sections]
  );

  // 根据维度索引确定 Tooltip 位置（箭头指向）
  const getTooltipPlacement = useCallback((sectionIndex) => {
    switch (sectionIndex) {
      case 0: // value - 顶部：箭头向上指向中心
        return "bottom";
      case 1: // future - 右上：箭头向上指向扇形中点
        return "bottom";
      case 2: // past - 右下：箭头向上指向扇形中点
        return "bottom";
      case 3: // health - 左下：箭头向下指向扇形中点
        return "top";
      case 4: // dividend - 左上：箭头向下指向扇形中点
        return "top";
      default:
        return "bottom";
    }
  }, []);

  // 计算每个维度的 Tooltip offset，使箭头指向正确位置
  const getTooltipOffset = useCallback(
    (sectionIndex) => {
      const centerX = 165; // canvas中心点
      const centerY = 165; // canvas中心点
      const outerRadius = 120; // 雪花图外圈半径
      const canvasWidth = 330; // canvas宽度
      const canvasHeight = 330; // canvas高度
      const numDimensions = dimensions.length; // 维度数量

      // 计算扇形的中心角度（弧度）
      const angle =
        (sectionIndex * (Math.PI * 2)) / numDimensions - Math.PI / 2;

      // 扇形一半位置的半径（从圆心到外圈距离的一半）
      const midRadius = outerRadius / 2; // 60px

      // 扇形中点的绝对坐标（在 canvas 上的位置）
      const sectorMidX = centerX + midRadius * Math.cos(angle);
      const sectorMidY = centerY + midRadius * Math.sin(angle);

      const placement = getTooltipPlacement(sectionIndex);

      // 根据 placement 计算 offset
      // offset = 需要的箭头位置 - 默认箭头位置
      switch (placement) {
        case "bottom":
          // placement="bottom" 表示 Tooltip 在下方，箭头向上
          // 默认箭头位置: (centerX, canvasHeight) = (165, 330)
          if (sectionIndex === 0) {
            // value: 箭头指向 canvas 中心 (165, 165)
            return {
              mainAxis: centerY - canvasHeight, // 165 - 330 = -165
              crossAxis: 0, // 水平居中
            };
          } else {
            // future (1) 和 past (2): 箭头指向各自扇形中点
            return {
              mainAxis: sectorMidY - canvasHeight, // 扇形中点Y - 330
              crossAxis: sectorMidX - centerX, // 扇形中点X - 165
            };
          }
        case "top":
          // placement="top" 表示 Tooltip 在上方，箭头向下
          // 默认箭头位置: (centerX, 0) = (165, 0)
          // health (3) 和 dividend (4): 箭头指向各自扇形中点
          return {
            mainAxis: -sectorMidY, // 0 - 扇形中点Y（向下是正方向，所以取负）
            crossAxis: sectorMidX - centerX, // 扇形中点X - 165
          };
        case "right":
          // 保留旧逻辑（如果需要）
          return {
            mainAxis: sectorMidX - canvasWidth,
            crossAxis: sectorMidY - centerY,
          };
        case "left":
          // 保留旧逻辑（如果需要）
          return {
            mainAxis: -sectorMidX,
            crossAxis: sectorMidY - centerY,
          };
        default:
          return { mainAxis: -165, crossAxis: 0 };
      }
    },
    [dimensions, getTooltipPlacement]
  );

  // 鼠标交互：根据坐标算是哪一个扇形
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mode !== "COMPANY") return;

    const centerX = 165;
    const centerY = 165;
    const outerRadius = 120;
    const numDimensions = dimensions.length;

    // 判断点是否在扇形内
    const isPointInSector = (x, y, sectorIndex) => {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 检查是否在圆形范围内
      if (distance > outerRadius || distance < 17) return false;

      // 计算点相对于圆心的角度
      let angle = Math.atan2(dy, dx);
      // 转换为与雪花图相同的坐标系（从顶部开始，顺时针）
      angle = angle + Math.PI / 2;
      if (angle < 0) angle += Math.PI * 2;

      // 计算扇形的角度范围
      const anglePerDimension = (Math.PI * 2) / numDimensions;
      const sectorStartAngle = sectorIndex * anglePerDimension;
      const sectorEndAngle = (sectorIndex + 1) * anglePerDimension;

      return angle >= sectorStartAngle && angle < sectorEndAngle;
    };

    // 鼠标移动时更新悬浮状态
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      let newHoveredSection = -1;
      for (let i = 0; i < numDimensions; i++) {
        if (isPointInSector(x, y, i)) {
          newHoveredSection = i;
          break;
        }
      }

      // 只在悬浮区域改变时更新状态
      if (newHoveredSection !== hoveredSection) {
        setHoveredSection(newHoveredSection);
        canvas.style.cursor = newHoveredSection !== -1 ? "pointer" : "default";

        // 调试信息：显示当前悬浮的维度及其 Tooltip 配置
        if (newHoveredSection !== -1) {
          console.log("悬浮维度索引:", newHoveredSection);
          console.log("维度名称:", dimensions[newHoveredSection]);
        }
      }
    };

    // 鼠标离开时重置悬浮状态
    const handleMouseLeave = () => {
      setHoveredSection(-1);
      canvas.style.cursor = "default";
    };

    // 当鼠标移动和鼠标离开时
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // 清除事件监听器
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [dimensions, mode, hoveredSection]); // 当鼠标移动和鼠标离开时触发依赖更新

  // 获取当前悬浮维度的数据
  const hoveredData = useMemo(() => {
    if (hoveredSection === -1) return null;

    return {
      score: scores[hoveredSection],
      dimension: dimensions[hoveredSection],
      description: descriptions[hoveredSection],
      checksCount: getChecksCount(hoveredSection),
      totalChecks: sections[hoveredSection]?.length || 6,
      checks: sections[hoveredSection] || [],
      placement: getTooltipPlacement(hoveredSection),
      offset: getTooltipOffset(hoveredSection),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hoveredSection, //悬浮的维度索引
    scores, //维度分数
    dimensions, //维度名称
    descriptions, //维度描述
    sections, //维度细分区域
    getChecksCount, //获取悬浮维度检查通过数量
    // getTooltipPlacement 和 getTooltipOffset 已通过 useCallback 稳定，无需作为依赖
  ]);

  return (
    <TooltipMessage
      score={hoveredData?.score || 0}
      dimension={hoveredData?.dimension || ""}
      description={hoveredData?.description || ""}
      checksCount={hoveredData?.checksCount || 0}
      totalChecks={hoveredData?.totalChecks || 6}
      checks={hoveredData?.checks || []}
      placement={hoveredData?.placement || "bottom"}
      offset={hoveredData?.offset || { mainAxis: -165, crossAxis: 0 }}
      isOpen={mode === "COMPANY" && hoveredSection !== -1}
    >
      <Box display="inline-block">
        <SnowflakeCanvas
          ref={canvasRef} //让父组件可以通过 ref 访问到 SnowflakeCanvas 内部的 canvas 元素，方便实现如坐标映射、悬浮事件处理等交互。
          dimensions={dimensions} //维度名称
          scores={scores} //维度分数
          mode={mode} //模式
          highlightSection={highlightSection} //高亮维度
          hoveredSection={hoveredSection} //悬浮的维度索引
        />
      </Box>
    </TooltipMessage>
  );
};

export default SnowflakeTooltip;
