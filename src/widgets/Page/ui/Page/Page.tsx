import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "@shared/lib/classNames";
import styles from "./Page.module.scss";

export interface PageProps extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
    padded?: boolean;
}

export const Page = ({ children, className, padded = false, ...props }: PageProps) => (
    <main id="main-content" className={classNames(styles.page, padded && styles.padded, className)} {...props}>
        {children}
    </main>
);
