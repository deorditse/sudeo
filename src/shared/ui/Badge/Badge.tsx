import type { ElementType, ReactNode } from "react";
import { classNames } from "@shared/lib/classNames";
import type { PolymorphicProps } from "@shared/lib/polymorphic";
import styles from "./Badge.module.scss";

export type BadgeTone = "neutral" | "accent" | "inverse";

type BadgeOwnProps = {
    children: ReactNode;
    tone?: BadgeTone;
};

export type BadgeProps<T extends ElementType = "span"> = PolymorphicProps<T, BadgeOwnProps>;

export const Badge = <T extends ElementType = "span">({
    as,
    children,
    className,
    ref,
    tone = "neutral",
    ...props
}: BadgeProps<T>) => {
    const Component = as ?? "span";

    return (
        <Component className={classNames(styles.badge, styles[tone], className)} ref={ref} {...props}>
            {children}
        </Component>
    );
};
