import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { classNames } from "@shared/lib/classNames";
import styles from "./Flex.module.scss";

export type FlexGap = "4" | "8" | "12" | "16" | "24" | "32" | "48" | "64";
export type FlexAlign = "start" | "center" | "end" | "stretch";
export type FlexJustify = "start" | "center" | "end" | "between";

export interface FlexProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    as?: ElementType;
    children?: ReactNode;
    direction?: "row" | "column";
    align?: FlexAlign;
    justify?: FlexJustify;
    gap?: FlexGap;
    wrap?: boolean;
    max?: boolean;
}

export const Flex = ({
    as,
    children,
    direction = "row",
    align = "stretch",
    justify = "start",
    gap,
    wrap = false,
    max = false,
    className,
    ...props
}: FlexProps) => {
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
            {...props}
        >
            {children}
        </Component>
    );
};
