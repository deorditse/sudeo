import { Flex, type FlexProps } from "../Flex/Flex";

export type VStackProps = Omit<FlexProps, "direction">;

export const VStack = ({ align = "start", ...props }: VStackProps) => (
    <Flex direction="column" align={align} {...props} />
);
