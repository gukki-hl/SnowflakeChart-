import { HStack, Text, Box, RadioGroup } from "@chakra-ui/react";
import { memo } from "react";
const HighlightSection = ({
  dimensions,
  highlightSection,
  onHighlightChange,
}) => {
  const option = ["NONE", ...dimensions];
  return (
    <Box
      bg="#3C4656"
      p={6}
      borderRadius="lg"
      border="2px solid"
      borderColor="purple.500"
    >
      <HStack mb={4}>
        <Text color="white" fontWeight="semibold">
          🎯 选择高亮区域
        </Text>
      </HStack>

      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
        {option.map((opt) => (
          <HStack wrap="wrap" key={opt}>
            <Box
              bg="#334155"
              px={2}
              borderRadius="10px"
              minW={140}
              height={8}
              alignItems="center"
              display="flex"
              cursor="pointer"
              border="1px solid #475569"
              _hover={{ border: "1px solid #A855F6" }}
            >
              <RadioGroup.Root
                colorPalette={"purple"}
                defaultValue="NONE"
                size="xs"
                value={highlightSection}
                onValueChange={(e) => onHighlightChange(e.value)}
              >
                <RadioGroup.Item value={opt}>
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator
                    bg={highlightSection === opt ? undefined : "black"}
                    border={highlightSection === opt ? undefined : "none"}
                  />
                  <RadioGroup.ItemText fontWeight={"bold"} fontSize={12}>
                    {opt}
                  </RadioGroup.ItemText>
                </RadioGroup.Item>
              </RadioGroup.Root>
            </Box>
          </HStack>
        ))}
      </Box>
    </Box>
  );
};

// 优化：使用 memo 记忆化组件，避免不必要的重渲染
export default memo(HighlightSection, (prevProps, nextProps) => {
  return (
    prevProps.dimensions === nextProps.dimensions &&
    prevProps.highlightSection === nextProps.highlightSection
  );
});
