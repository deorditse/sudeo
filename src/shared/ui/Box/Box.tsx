import type { ElementType, ReactNode } from "react";
import type { PolymorphicProps } from "@shared/lib/polymorphic";

type BoxOwnProps = {
    children?: ReactNode;
};

export type BoxProps<T extends ElementType = "div"> = PolymorphicProps<T, BoxOwnProps>;

export const Box = <T extends ElementType = "div">({ as, children, ref, ...props }: BoxProps<T>) => {
    const Component = as ?? "div";
    return <Component ref={ref} {...props}>{children}</Component>;
};
