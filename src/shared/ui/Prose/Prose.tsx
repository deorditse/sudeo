import type { ElementType, ReactNode } from "react";
import { classNames } from "@shared/lib/classNames";
import type { PolymorphicProps } from "@shared/lib/polymorphic";
import styles from "./Prose.module.scss";

export type ProseSize = "default" | "lead";
export type ProseTone = "default" | "inverse";

type ProseOwnProps = {
    children: ReactNode;
    size?: ProseSize;
    tone?: ProseTone;
};

export type ProseProps<T extends ElementType = "div"> = PolymorphicProps<T, ProseOwnProps>;

export const Prose = <T extends ElementType = "div">({
    as,
    children,
    className,
    ref,
    size = "default",
    tone = "default",
    ...props
}: ProseProps<T>) => {
    const Component = as ?? "div";

    return (
        <Component
            className={classNames(styles.prose, styles[`size-${size}`], styles[`tone-${tone}`], className)}
            ref={ref}
            {...props}
        >
            {children}
        </Component>
    );
};
