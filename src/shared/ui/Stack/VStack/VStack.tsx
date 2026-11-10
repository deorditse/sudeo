import type { ElementType } from "react";
import { Flex, type FlexAlign, type FlexProps } from "../Flex/Flex";

export type VStackProps<T extends ElementType = "div"> = Omit<FlexProps<T>, "direction">;

export const VStack = <T extends ElementType = "div">(props: VStackProps<T>) => {
    const align = (props as { align?: FlexAlign }).align ?? "start";
    const flexProps = { ...props, direction: "column", align } as FlexProps<T>;
    return <Flex<T> {...flexProps} />;
};
