import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { classNames } from "@shared/lib/classNames";
import styles from "./MainContent.module.scss";

export type MainContentWidth = "default" | "narrow" | "wide" | "full";

export type MainContentProps<T extends ElementType = "div"> = {
    as?: T;
    children: ReactNode;
    width?: MainContentWidth;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

export const MainContent = <T extends ElementType = "div">({ as, children, width = "default", className, ...props }: MainContentProps<T>) => {
    const Component = as ?? "div";
    return <Component className={classNames(styles.content, styles[width], className)} {...props}>{children}</Component>;
};
