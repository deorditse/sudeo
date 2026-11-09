import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import { classNames } from "@shared/lib/classNames";
import styles from "./Container.module.scss";

export type ContainerWidth = "default" | "narrow" | "wide" | "full";

export type ContainerProps<T extends ElementType = "div"> = {
    as?: T;
    children: ReactNode;
    width?: ContainerWidth;
} & Omit<ComponentPropsWithRef<T>, "as" | "children">;

export const Container = <T extends ElementType = "div">({
    as,
    children,
    width = "default",
    className,
    ...props
}: ContainerProps<T>) => {
    const Component = as ?? "div";
    return (
        <Component className={classNames(styles.container, styles[width], className)} {...props}>
            {children}
        </Component>
    );
};
