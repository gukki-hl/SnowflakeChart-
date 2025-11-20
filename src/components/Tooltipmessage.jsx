import { HStack, Text, Box } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react";

const TooltipContent = ({
  score,
  dimension,
  description,
  checksCount,
  totalChecks,
  checks,
}) => {
  return (
    <Box bg="black" borderRadius="lg" p={6} maxW="md" boxShadow="2xl">
      {/* Header: Score and Title */}
      <HStack align="baseline" gap={3} mb={4}>
        <Text color="white" fontSize="xl" fontWeight="bold">
          {score}
        </Text>
        <Text color="white" fontSize="2xl" fontWeight="semibold">
          | {dimension}
        </Text>
      </HStack>

      {/* Description */}
      <Text color="white" fontSize="base" lineHeight="relaxed" mb={6}>
        {description}
      </Text>

      {/* Analysis Checks Section */}
      <Box>
        <Text color="white" fontSize="base" fontWeight="semibold" mb={3}>
          Analysis Checks{" "}
          <Text as="span" color="gray.400">
            {checksCount}/{totalChecks}
          </Text>
        </Text>

        {/* Check Icons */}
        <HStack gap={2}>
          {checks.map((isPassed, index) => (
            <Box
              key={index}
              w={8}
              h={8}
              borderRadius="full"
              bg={isPassed ? "green.500" : "red.600"}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {isPassed ? (
                // Checkmark icon
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                // X icon
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
            </Box>
          ))}
        </HStack>
      </Box>
    </Box>
  );
};

const TooltipMessage = ({
  children,
  score,
  dimension,
  description,
  checksCount,
  totalChecks,
  checks, //
  placement = "bottom", //默认位置在下方
  isOpen, //是否显示提示框
  offset = { mainAxis: -165, crossAxis: 0 }, //自定义偏移量
}) => {
  return (
    <Tooltip.Root
      open={isOpen}
      positioning={{
        placement: placement,
        gutter: 1,
        //offset 用于微调提示框位置，使其相对于 canvas 中心点定位
        //mainAxis: 沿着 placement 方向的偏移
        //crossAxis: 垂直于 placement 方向的偏移
        offset: offset,
      }}
    >
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content bg="transparent" border="none" boxShadow="none" p={0}>
          <Tooltip.Arrow>
            <Tooltip.ArrowTip
              style={{
                width: "20px",
                height: "20px",
              }}
            />
          </Tooltip.Arrow>
          <TooltipContent
            score={score}
            dimension={dimension}
            description={description}
            checksCount={checksCount}
            totalChecks={totalChecks}
            checks={checks}
          />
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
};

export default TooltipMessage;
