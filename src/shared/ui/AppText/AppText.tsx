import type { ElementType, ReactNode } from "react";
import { classNames } from "@shared/lib/classNames";
import type { PolymorphicProps } from "@shared/lib/polymorphic";
import styles from "./AppText.module.scss";

export type AppTextSize = "xs" | "s" | "m" | "l" | "xl" | "2xl" | "hero";
export type AppTextTone = "primary" | "muted" | "accent" | "inverse" | "error";
export type AppTextWeight = "regular" | "medium" | "semibold" | "bold";

type AppTextOwnProps = {
    children: ReactNode;
    size?: AppTextSize;
    tone?: AppTextTone;
    weight?: AppTextWeight;
    align?: "left" | "center" | "right";
    uppercase?: boolean;
};

export type AppTextProps<T extends ElementType = "p"> = PolymorphicProps<T, AppTextOwnProps>;

export const AppText = <T extends ElementType = "p">({
    as,
    children,
    size = "m",
    tone = "primary",
    weight = "regular",
    align = "left",
    uppercase = false,
    className,
    ref,
    ...props
}: AppTextProps<T>) => {
    const Component = as ?? "p";
    return (
        <Component
            className={classNames(
                styles.text,
                styles[`size-${size}`],
                styles[`tone-${tone}`],
                styles[`weight-${weight}`],
                styles[`align-${align}`],
                uppercase && styles.uppercase,
                className,
            )}
            ref={ref}
            {...props}
        >
            {children}
        </Component>
    );
};
