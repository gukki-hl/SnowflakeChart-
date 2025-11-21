import { Box, HStack, Text, Slider, NumberInput } from "@chakra-ui/react";
import { useCallback, useState, memo } from "react";

const Sliders = ({ labelName, score, onScoreChange }) => {
  //悬浮状态
  const [isHovered, setIsHovered] = useState(false);
  //分数变化回调
  const handleSliderChange = useCallback(
    (newValue) => {
      onScoreChange(newValue);
    },
    [onScoreChange] //依赖项
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <Box
      p="2"
      rounded="md"
      bg="#334155"
      border="1px solid"
      borderColor="#475569"
    >
      <HStack justify="space-between" mb="2">
        <Text color="gray.300" fontSize="12px" fontWeight="bold">
          {labelName}
        </Text>
        <NumberInput.Root
          colorPalette="purple"
          bg="gray.900"
          rounded="sm"
          defaultValue="7"
          size="sm"
          w="80px"
          h="25px"
          min={0}
          max={7}
          value={score} //受控
          cursor="pointer"
          transition="all 0.3s ease"
          border="1px solid transparent"
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          _hover={{ borderColor: "purple.500" }}
          onValueChange={(e) => handleSliderChange(e.value)}
        >
          <NumberInput.Control
            opacity={isHovered ? 1 : 0}
            visibility={isHovered ? "visible" : "hidden"}
            transition="all 0.9s ease"
            borderLeft="1px solid #475569"
            h="100%"
            css={{
              "& > button": {
                borderColor: "#475569 !important",
                h: "50%",
                _hover: { bg: "rgba(168, 85, 247, 0.1)" },
                _active: { bg: "rgba(168, 85, 247, 0.2)" },
              },
            }}
          />
          <NumberInput.Input border="none" h="100%" />
        </NumberInput.Root>
      </HStack>
      <Slider.Root
        w="430px"
        min={0}
        max={7}
        step={1}
        value={[score]} //受控
        colorPalette="purple"
        onValueChange={(e) => handleSliderChange(e.value)}
      >
        <Slider.Control>
          <Slider.Track bg="gray.500" h="6px">
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb index={0} boxSize="4" />
        </Slider.Control>
      </Slider.Root>
    </Box>
  );
};

//使用memo优化，避免父组件重复渲染时不必要的重复渲染
export default memo(Sliders, (prevProps, nextProps) => {
  return (
    prevProps.labelName === nextProps.labelName &&
    prevProps.score === nextProps.score &&
    prevProps.onScoreChange === nextProps.onScoreChange
  );
});
