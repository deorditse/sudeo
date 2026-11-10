import type { ElementType, ReactNode } from "react";
import { classNames } from "@shared/lib/classNames";
import type { PolymorphicProps } from "@shared/lib/polymorphic";
import styles from "./Flex.module.scss";

export type FlexGap = "4" | "8" | "12" | "16" | "24" | "32" | "48" | "64";
export type FlexAlign = "start" | "center" | "end" | "stretch";
export type FlexJustify = "start" | "center" | "end" | "between";

type FlexOwnProps = {
    children?: ReactNode;
    direction?: "row" | "column";
    align?: FlexAlign;
    justify?: FlexJustify;
    gap?: FlexGap;
    wrap?: boolean;
    max?: boolean;
};

export type FlexProps<T extends ElementType = "div"> = PolymorphicProps<T, FlexOwnProps>;

export const Flex = <T extends ElementType = "div">({
    as,
    children,
    direction = "row",
    align = "stretch",
    justify = "start",
    gap,
    wrap = false,
    max = false,
    className,
    ref,
    ...props
}: FlexProps<T>) => {
    const Component = as ?? "div";
    return (
        <Component
            className={classNames(
                styles.flex,
                styles[direction],
                styles[`align-${align}`],
                styles[`justify-${justify}`],
                gap && styles[`gap-${gap}`],
                wrap && styles.wrap,
                max && styles.max,
                className,
            )}
            ref={ref}
            {...props}
        >
            {children}
        </Component>
    );
};
