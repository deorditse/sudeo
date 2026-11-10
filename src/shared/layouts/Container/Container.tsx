import type { ElementType, ReactNode } from "react";
import { classNames } from "@shared/lib/classNames";
import type { PolymorphicProps } from "@shared/lib/polymorphic";
import styles from "./Container.module.scss";

export type ContainerWidth = "default" | "narrow" | "wide" | "full";

type ContainerOwnProps = {
    children: ReactNode;
    width?: ContainerWidth;
};

export type ContainerProps<T extends ElementType = "div"> = PolymorphicProps<T, ContainerOwnProps>;

export const Container = <T extends ElementType = "div">({
    as,
    children,
    width = "default",
    className,
    ref,
    ...props
}: ContainerProps<T>) => {
    const Component = as ?? "div";
    return (
        <Component className={classNames(styles.container, styles[width], className)} ref={ref} {...props}>
            {children}
        </Component>
    );
};
