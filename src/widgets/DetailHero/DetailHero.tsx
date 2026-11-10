import type { CSSProperties, ElementType, ReactNode } from "react";
import { MainContent } from "@shared/layouts/MainContent";
import { classNames } from "@shared/lib/classNames";
import type { PolymorphicProps } from "@shared/lib/polymorphic";
import { AppGrid, AppText, Eyebrow, VStack } from "@shared/ui";
import styles from "./DetailHero.module.scss";

type DetailHeroOwnProps = {
    accent?: string;
    before?: ReactNode;
    eyebrow?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    visual?: ReactNode;
    after?: ReactNode;
    titleAs?: "h1" | "h2";
};

export type DetailHeroProps<T extends ElementType = "section"> = PolymorphicProps<T, DetailHeroOwnProps>;

export const DetailHero = <T extends ElementType = "section">({
    as,
    accent = "#b9ff66",
    before,
    eyebrow,
    title,
    description,
    actions,
    visual,
    after,
    titleAs = "h1",
    className,
    ref,
    style,
    ...props
}: DetailHeroProps<T>) => {
    const Component = as ?? "section";
    const heroStyle = { "--detail-hero-accent": accent, ...style } as CSSProperties;

    return (
        <Component className={classNames(styles.hero, className)} ref={ref} style={heroStyle} {...props}>
            <MainContent>
                {before}
                <AppGrid
                    className={styles.grid}
                    columns={1}
                    tabletColumns={visual ? 2 : 1}
                    desktopColumns={visual ? 2 : 1}
                    template={visual ? "serviceHero" : "equal"}
                    gap="78"
                    align="center"
                >
                    <VStack className={styles.content} gap="24" align="start">
                        {eyebrow && <Eyebrow tone="inverse">{eyebrow}</Eyebrow>}
                        <AppText className={styles.title} as={titleAs} size="hero" weight="medium">
                            {title}
                        </AppText>
                        {description && <AppText className={styles.description} size="l">{description}</AppText>}
                        {actions && <div className={styles.actions}>{actions}</div>}
                    </VStack>
                    {visual && <div className={styles.visual}>{visual}</div>}
                </AppGrid>
                {after}
            </MainContent>
        </Component>
    );
};
