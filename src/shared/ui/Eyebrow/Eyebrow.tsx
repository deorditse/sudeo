import type { ElementType, ReactNode } from "react";
import { classNames } from "@shared/lib/classNames";
import type { PolymorphicProps } from "@shared/lib/polymorphic";
import styles from "./Eyebrow.module.scss";

export type EyebrowTone = "default" | "inverse" | "accent";

type EyebrowOwnProps = {
    children: ReactNode;
    tone?: EyebrowTone;
};

export type EyebrowProps<T extends ElementType = "p"> = PolymorphicProps<T, EyebrowOwnProps>;

export const Eyebrow = <T extends ElementType = "p">({
    as,
    children,
    className,
    ref,
    tone = "default",
    ...props
}: EyebrowProps<T>) => {
    const Component = as ?? "p";

    return (
        <Component className={classNames(styles.eyebrow, styles[tone], className)} ref={ref} {...props}>
            {children}
        </Component>
    );
};
