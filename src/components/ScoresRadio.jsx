import { HStack, Text, Box, VStack } from "@chakra-ui/react";
import Sliders from "./Sliders";
const ScoresRadio = ({ dimensions, scores, onScoreChange }) => {
  return (
    <>
      <Box
        bg="#3C4656"
        p={6}
        borderRadius="lg"
        border="2px solid"
        borderColor="purple.500"
      >
        <HStack mb={3}>
          <Text color="white" fontWeight="semibold">
            📊 调整维度分数
          </Text>
        </HStack>

        <VStack spacing={6} align="stretch">
          {dimensions.map((dimension, index) => (
            <Sliders
              key={dimension}
              labelName={dimension}
              score={scores[index]}
              index={index}
              onScoreChange={(newScore) => onScoreChange(index, newScore)}
            />
          ))}
        </VStack>
      </Box>
    </>
  );
};

export default ScoresRadio;
