import { AppText, VStack } from "@shared/ui";
import styles from "./Faq.module.scss";

export interface FaqItem {
    question: string;
    answer: string;
}

export interface FaqProps {
    items: readonly FaqItem[];
    className?: string;
}

export const Faq = ({ items, className }: FaqProps) => (
    <VStack className={[styles.list, className].filter(Boolean).join(" ")} align="stretch">
        {items.map((item) => (
            <details className={styles.item} key={item.question}>
                <summary className={styles.summary}>
                    <span>{item.question}</span>
                    <span className={styles.icon} aria-hidden="true">+</span>
                </summary>
                <AppText className={styles.answer} tone="muted">{item.answer}</AppText>
            </details>
        ))}
    </VStack>
);
