import { AppText } from "@shared/ui/AppText";
import { VStack } from "@shared/ui/Stack";
import styles from "./BulletPanel.module.scss";

export type BulletPanelHeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";

export type BulletPanelProps = {
    title: string;
    items: string[];
    headingLevel?: BulletPanelHeadingLevel;
};

export const BulletPanel = ({
    title,
    items,
    headingLevel = "h3",
}: BulletPanelProps) => (
    <VStack className={styles.bulletPanel} gap="24" align="stretch">
        <AppText as={headingLevel} size="l" weight="semibold">
            {title}
        </AppText>
        <ul>
            {items.map((item) => (
                <li key={item}>
                    <span aria-hidden="true">↗</span>
                    {item}
                </li>
            ))}
        </ul>
    </VStack>
);
