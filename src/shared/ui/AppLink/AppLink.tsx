import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { classNames } from "@shared/lib/classNames";
import styles from "./AppLink.module.scss";

interface AppLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
    to: string;
    children: ReactNode;
    variant?: "default" | "muted" | "accent";
}

export const AppLink = ({ to, children, className, variant = "default", ...props }: AppLinkProps) => {
    const classes = classNames(styles.link, styles[variant], className);
    if (/^https?:\/\//.test(to)) return <a {...props} className={classes} href={to}>{children}</a>;
    return <Link {...props} className={classes} to={to}>{children}</Link>;
};
