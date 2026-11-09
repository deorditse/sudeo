import type { ComponentPropsWithRef, CSSProperties, ElementType, ReactNode } from "react";
import { classNames } from "@shared/lib/classNames";
import styles from "./AppPadding.module.scss";

const spacingValues = {
    "0": "0px",
    "4": "4px",
    "8": "8px",
    "12": "12px",
    "16": "16px",
    "18": "18px",
    "20": "20px",
    "24": "24px",
    "28": "28px",
    "30": "30px",
    "32": "32px",
    "36": "36px",
    "40": "40px",
    "42": "42px",
    "45": "45px",
    "48": "48px",
    "55": "55px",
    "60": "60px",
    "64": "64px",
    "68": "68px",
    "70": "70px",
    "72": "72px",
    "75": "75px",
    "78": "78px",
    "88": "88px",
    "90": "90px",
    "96": "96px",
    "100": "100px",
    "105": "105px",
    "120": "120px",
    "140": "140px",
    "145": "145px",
    "180": "180px",
    "190": "190px",
} as const;

export type AppSpacing = keyof typeof spacingValues;

type PaddingProps = {
    p?: AppSpacing;
    px?: AppSpacing;
    py?: AppSpacing;
    pt?: AppSpacing;
    pr?: AppSpacing;
    pb?: AppSpacing;
    pl?: AppSpacing;
    mobileP?: AppSpacing;
    mobilePx?: AppSpacing;
    mobilePy?: AppSpacing;
    mobilePt?: AppSpacing;
    mobilePr?: AppSpacing;
    mobilePb?: AppSpacing;
    mobilePl?: AppSpacing;
};

export type AppPaddingProps<T extends ElementType = "div"> = PaddingProps & {
    as?: T;
    children?: ReactNode;
} & Omit<ComponentPropsWithRef<T>, keyof PaddingProps | "as" | "children">;

const toValue = (value?: AppSpacing) => value === undefined ? undefined : spacingValues[value];

export const AppPadding = <T extends ElementType = "div">({
    as,
    children,
    className,
    style,
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    mobileP,
    mobilePx,
    mobilePy,
    mobilePt,
    mobilePr,
    mobilePb,
    mobilePl,
    ...props
}: AppPaddingProps<T>) => {
    const Component = as ?? "div";
    const spacingStyle = {
        "--app-p": toValue(p),
        "--app-px": toValue(px),
        "--app-py": toValue(py),
        "--app-pt": toValue(pt),
        "--app-pr": toValue(pr),
        "--app-pb": toValue(pb),
        "--app-pl": toValue(pl),
        "--app-mobile-p": toValue(mobileP),
        "--app-mobile-px": toValue(mobilePx),
        "--app-mobile-py": toValue(mobilePy),
        "--app-mobile-pt": toValue(mobilePt),
        "--app-mobile-pr": toValue(mobilePr),
        "--app-mobile-pb": toValue(mobilePb),
        "--app-mobile-pl": toValue(mobilePl),
        ...style,
    } as CSSProperties;

    return (
        <Component className={classNames(styles.root, className)} style={spacingStyle} {...props}>
            {children}
        </Component>
    );
};
