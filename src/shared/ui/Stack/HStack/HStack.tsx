import type { ElementType } from "react";
import { Flex, type FlexProps } from "../Flex/Flex";

export type HStackProps<T extends ElementType = "div"> = Omit<FlexProps<T>, "direction">;

export const HStack = <T extends ElementType = "div">(props: HStackProps<T>) => {
    const flexProps = { ...props, direction: "row" } as FlexProps<T>;
    return <Flex<T> {...flexProps} />;
};
