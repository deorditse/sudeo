import type { ElementType, ReactNode } from "react";
import { MainContent } from "@shared/layouts/MainContent";
import type { PolymorphicProps } from "@shared/lib/polymorphic";
import { AppText, Eyebrow, VStack } from "@shared/ui";
import { classNames } from "@shared/lib/classNames";
import styles from "./PageHero.module.scss";

type PageHeroOwnProps = {
    eyebrow: ReactNode;
    title: ReactNode;
    text?: ReactNode;
    children?: ReactNode;
    titleAs?: "h1" | "h2";
};

export type PageHeroProps<T extends ElementType = "section"> = PolymorphicProps<T, PageHeroOwnProps>;

export const PageHero = <T extends ElementType = "section">({
    as,
    eyebrow,
    title,
    text,
    children,
    titleAs = "h1",
    className,
    ref,
    ...props
}: PageHeroProps<T>) => {
    const Component = as ?? "section";

    return (
        <Component className={classNames(styles.hero, className)} ref={ref} {...props}>
            <MainContent>
                <VStack className={styles.content} gap="24" align="start">
                    <Eyebrow tone="inverse">{eyebrow}</Eyebrow>
                    <AppText className={styles.title} as={titleAs} size="hero" weight="medium">
                        {title}
                    </AppText>
                    {text && <AppText className={styles.intro} size="l">{text}</AppText>}
                    {children}
                </VStack>
            </MainContent>
        </Component>
    );
};
