import { Box, VStack, Text, Button } from "@chakra-ui/react";
import { memo } from "react";
import ScoresRadio from "./ScoresRadio";
import HighlightSection from "./HighlightSection";
import { shallowArrayEqual } from "../constants";
const ControlPanel = ({
  dimensions,
  scores,
  onScoreChange,
  highlightSection,
  onHighlightChange,
  handleReset,
}) => {
  return (
    <>
      {/* 左侧控制面板 */}
      <VStack spacing={6} maxW="500px" align="stretch">
        {/* 标题 */}
        <Box mb={4}>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="white"
            borderLeft="4px solid"
            borderColor="purple.500"
            pl={3}
          >
            实现效果
          </Text>
          <Box mt={4}>
            <ScoresRadio
              dimensions={dimensions}
              scores={scores}
              onScoreChange={onScoreChange}
            />
          </Box>
        </Box>

        {/* 选择高亮区域 */}
        <HighlightSection
          dimensions={dimensions}
          highlightSection={highlightSection}
          onHighlightChange={onHighlightChange}
        />

        {/* 重置 */}
        <Button
          colorPalette={"purple"}
          size="md"
          mt={2}
          borderRadius={10}
          fontWeight={"blod"}
          onClick={handleReset}
        >
          🔄 重置所有设置
        </Button>
      </VStack>
    </>
  );
};

// 优化：使用 memo 记忆化组件，避免不必要的重渲染
export default memo(ControlPanel, (prevProps, nextProps) => {
  return (
    prevProps.dimensions === nextProps.dimensions &&
    shallowArrayEqual(prevProps.scores, nextProps.scores) &&
    prevProps.highlightSection === nextProps.highlightSection &&
    prevProps.onScoreChange === nextProps.onScoreChange &&
    prevProps.onHighlightChange === nextProps.onHighlightChange &&
    prevProps.handleReset === nextProps.handleReset
  );
});
