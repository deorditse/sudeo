import { AppText } from "@shared/ui/AppText";
import { VStack } from "@shared/ui/Stack";
import styles from "./SectionHeading.module.scss";

export type SectionHeadingProps = {
    eyebrow: string;
    title: string;
    text?: string;
};

export const SectionHeading = ({ eyebrow, title, text }: SectionHeadingProps) => (
    <VStack className={styles.sectionHeading} gap="24">
        <AppText className={styles.eyebrow} size="xs" weight="bold">
            {eyebrow}
        </AppText>
        <AppText className={styles.sectionTitle} as="h2" size="xl" weight="medium">
            {title}
        </AppText>
        {text && (
            <AppText className={styles.sectionIntro} tone="muted" size="l">
                {text}
            </AppText>
        )}
    </VStack>
);
