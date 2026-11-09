import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "@shared/lib/classNames";
import styles from "./Section.module.scss";

export type SectionTone = "light" | "dark" | "feature" | "form" | "accent";
export interface SectionProps extends HTMLAttributes<HTMLElement> { children: ReactNode; tone?: SectionTone; compact?: boolean; }

export const Section = ({ children, tone = "light", compact = false, className, ...props }: SectionProps) => (
    <section className={classNames(styles.section, styles[tone], compact && styles.compact, className)} {...props}>{children}</section>
);
