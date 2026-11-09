import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "@shared/lib/classNames";
import { AppPadding } from "../AppPadding";
import styles from "./Section.module.scss";

export type SectionTone = "light" | "dark" | "feature" | "form" | "accent";
export interface SectionProps extends HTMLAttributes<HTMLElement> { children: ReactNode; tone?: SectionTone; compact?: boolean; }

export const Section = ({ children, tone = "light", compact = false, className, ...props }: SectionProps) => (
    <AppPadding
        as="section"
        py={compact ? "88" : "120"}
        mobilePy={compact ? "64" : "78"}
        className={classNames(styles.section, styles[tone], className)}
        {...props}
    >
        {children}
    </AppPadding>
);
