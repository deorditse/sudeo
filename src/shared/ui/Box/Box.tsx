import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

export type BoxProps<T extends ElementType = "div"> = {
    as?: T;
    children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

export const Box = <T extends ElementType = "div">({ as, children, ...props }: BoxProps<T>) => {
    const Component = as ?? "div";
    return <Component {...props}>{children}</Component>;
};
