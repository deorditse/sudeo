import { Flex, type FlexProps } from "../Flex/Flex";

export type HStackProps = Omit<FlexProps, "direction">;

export const HStack = (props: HStackProps) => <Flex direction="row" {...props} />;
