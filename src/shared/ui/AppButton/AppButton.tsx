import { forwardRef, type ButtonHTMLAttributes, type ReactNode, type Ref } from "react";
import { Link } from "react-router-dom";
import { classNames } from "@shared/lib/classNames";
import styles from "./AppButton.module.scss";

export type AppButtonVariant = "primary" | "secondary" | "ghost" | "text";
export type AppButtonSize = "s" | "m" | "l";

interface CommonProps {
    className?: string;
    children: ReactNode;
    variant?: AppButtonVariant;
    size?: AppButtonSize;
    fullWidth?: boolean;
    loading?: boolean;
    addonLeft?: ReactNode;
    addonRight?: ReactNode;
    ariaLabel?: string;
}

interface LinkProps extends CommonProps {
    to: string;
    disabled?: boolean;
    onClick?: never;
    type?: never;
}

interface ButtonProps extends CommonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    to?: never;
}

export type AppButtonProps = LinkProps | ButtonProps;

export const AppButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, AppButtonProps>((props, ref) => {
    const {
        className,
        children,
        variant = "primary",
        size = "m",
        fullWidth = false,
        loading = false,
        addonLeft,
        addonRight,
        ariaLabel,
    } = props;
    const classes = classNames(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className);
    const content = <>{addonLeft}<span>{loading ? "Загрузка…" : children}</span>{addonRight}</>;

    if ("to" in props && props.to) {
        return <Link ref={ref as Ref<HTMLAnchorElement>} className={classNames(classes, props.disabled && styles.disabled)} to={props.to} aria-label={ariaLabel} aria-disabled={props.disabled || undefined} tabIndex={props.disabled ? -1 : undefined}>{content}</Link>;
    }

    const { to: _to, ariaLabel: _ariaLabel, addonLeft: _left, addonRight: _right, fullWidth: _full, loading: _loading, variant: _variant, size: _size, ...buttonProps } = props;
    return <button ref={ref as Ref<HTMLButtonElement>} {...buttonProps} className={classes} aria-label={ariaLabel} disabled={buttonProps.disabled || loading}>{content}</button>;
});

AppButton.displayName = "AppButton";
