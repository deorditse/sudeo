import type { ElementType, ReactNode } from "react";
import { classNames } from "@shared/lib/classNames";
import type { PolymorphicProps } from "@shared/lib/polymorphic";
import { AppLink, type AppLinkProps } from "../AppLink";
import styles from "./Card.module.scss";

export type CardTone = "light" | "accent" | "dark" | "muted";
export type CardPadding = "compact" | "default" | "spacious";

type CardOwnProps = {
    children: ReactNode;
    padding?: CardPadding;
    tone?: CardTone;
};

export type CardProps<T extends ElementType = "div"> = PolymorphicProps<T, CardOwnProps>;

export const Card = <T extends ElementType = "div">({
    as,
    children,
    className,
    padding = "default",
    ref,
    tone = "light",
    ...props
}: CardProps<T>) => {
    const Component = as ?? "div";

    return (
        <Component
            className={classNames(
                styles.card,
                styles[tone],
                styles[`padding-${padding}`],
                className,
            )}
            ref={ref}
            {...props}
        >
            {children}
        </Component>
    );
};

export interface LinkCardProps extends Omit<AppLinkProps, "variant"> {
    padding?: CardPadding;
    tone?: CardTone;
}

export const LinkCard = ({
    children,
    className,
    padding = "default",
    tone = "light",
    ...props
}: LinkCardProps) => (
    <AppLink
        className={classNames(
            styles.card,
            styles.linkCard,
            styles.interactive,
            styles[tone],
            styles[`padding-${padding}`],
            className,
        )}
        {...props}
    >
        {children}
    </AppLink>
);
