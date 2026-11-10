import type { ElementType } from "react";
import { AppGrid, AppPadding, AppText } from "@shared/ui";
import styles from "./WorkStages.module.scss";

export type WorkStage = readonly [number: string, title: string, description: string];

export interface WorkStagesProps {
    stages: readonly WorkStage[];
    className?: string;
    headingLevel?: "h2" | "h3" | "h4";
}

export const WorkStages = ({ stages, className, headingLevel = "h3" }: WorkStagesProps) => {
    const Heading = headingLevel as ElementType;

    return (
        <ol className={[styles.list, className].filter(Boolean).join(" ")}>
            {stages.map(([number, title, description]) => (
                <AppPadding as="li" className={styles.item} py="20" tabletPy="24" desktopPy="30" key={number}>
                    <AppGrid columns={2} tabletColumns={3} desktopColumns={3} gap="30" align="start">
                        <span className={styles.number} aria-hidden="true">{number}</span>
                        <AppText as={Heading} size="l" weight="medium">{title}</AppText>
                        <AppText className={styles.description} tone="muted">{description}</AppText>
                    </AppGrid>
                </AppPadding>
            ))}
        </ol>
    );
};
