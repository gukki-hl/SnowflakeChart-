import SnowflakeTooltip from "./SnowflakeTooltip";
import ControlPanel from "./ControlPanel";
import { Box, Container, Flex } from "@chakra-ui/react";
import { useState, useCallback, useMemo } from "react";

// 定义雪花图维度的显示顺序
const dimensionOrder = ["value", "future", "past", "health", "dividend"];

const SnowflakeChart = ({ data }) => {
  // 按照指定顺序提取数据
  // 这段代码的作用是根据 dimensionOrder 指定的顺序，从数据 dataMap 中提取每个维度的相关信息，
  // 并将这些信息（包含维度名、初始分数、描述、和其他细分区段信息）分别存放到 dimensions、initialScores、descriptions 和 sections 这四个数组中，
  // 最终组合成一个对象，用于后续组件渲染。
  const { dimensions, initialScores, descriptions, sections } = useMemo(() => {
    // 将 JSON 数据转换为 Map 以便快速查找
    const dataMap = new Map(
      data?.companies_score.map((item) => [item.name.toLowerCase(), item]) || []
    );

    return dimensionOrder.reduce(
      (acc, key) => {
        const item = dataMap.get(key);
        if (item) {
          acc.dimensions.push(item.name.toUpperCase()); // 存储维度名称（全大写）
          acc.initialScores.push(item.value); // 存储该维度的得分
          acc.descriptions.push(item.description); // 存储维度描述
          acc.sections.push(item.section || []); // 存储该维度下的细分区域（若无则用空数组代替）
        }
        return acc;
      },
      { dimensions: [], initialScores: [], descriptions: [], sections: [] }
    );
  }, [data]);

  //状态管理
  const [updateScore, setUpdateScore] = useState(initialScores);
  const [mode, setMode] = useState("COMPANY"); // 'COMPANY' | 'TOC'
  const [highlightSection, setHighlightSection] = useState("NONE"); // 高亮的维度

  // 分数变化回调函数
  const onScoreChange = useCallback(
    (index, newScore) => {
      setUpdateScore((prevScores) => {
        const newScores = [...prevScores];
        newScores[index] = newScore;
        return newScores;
      });
    },
    [] // ✅ 使用函数式更新，不需要依赖 updateScore
  );

  // 高亮区域变化回调函数
  const onHighlightChange = useCallback(
    (selectedValue) => {
      setHighlightSection(selectedValue);
      // 如果选择了维度(非 NONE),自动切换到 TOC 模式
      setMode(selectedValue !== "NONE" ? "TOC" : "COMPANY");
    },
    [] // ✅ setState 函数是稳定的，不需要依赖
  );

  // 重置所有数据
  const onReset = useCallback(() => {
    setUpdateScore(initialScores);
    setHighlightSection("NONE");
    setMode("COMPANY");
  }, [initialScores]); // 依赖项：initialScores，确保在 initialScores 变化时重新创建回调函数

  return (
    <Container maxW="100vw" bg="#1B2637" minH="100vh" p={8} centerContent>
      <Flex
        gap={24}
        bg="#1F2937"
        border="1px solid #475569"
        w="1100px"
        p={8}
        borderRadius={15}
      >
        {/* 左侧控制面板 */}
        <ControlPanel
          dimensions={dimensions}
          scores={updateScore}
          onScoreChange={onScoreChange}
          highlightSection={highlightSection}
          onHighlightChange={onHighlightChange}
          handleReset={onReset}
        />

        {/* 右侧雪花图 */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="350px"
        >
          <Box
            background="linear-gradient(to top left, #9198A4, #3F4959)"
            w="350px"
            h="350px"
            borderRadius="10px"
            display="flex"
            position="relative"
          >
            <SnowflakeTooltip
              mode={mode}
              highlightSection={highlightSection}
              dimensions={dimensions}
              scores={updateScore}
              descriptions={descriptions}
              sections={sections}
            />
          </Box>
        </Box>
      </Flex>
    </Container>
  );
};

export default SnowflakeChart;
