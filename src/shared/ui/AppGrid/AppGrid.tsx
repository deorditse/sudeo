import type { ComponentPropsWithRef, CSSProperties, ElementType, ReactNode } from "react";
import { classNames } from "@shared/lib/classNames";
import type { AppSpacing } from "../AppPadding";
import styles from "./AppGrid.module.scss";

const gridGapValues: Record<AppSpacing, string> = {
    "0": "0px", "4": "4px", "8": "8px", "12": "12px", "16": "16px", "18": "18px", "20": "20px", "24": "24px", "28": "28px", "30": "30px", "32": "32px", "36": "36px", "40": "40px", "42": "42px", "45": "45px", "48": "48px", "55": "55px", "56": "56px", "60": "60px", "64": "64px", "68": "68px", "70": "70px", "72": "72px", "75": "75px", "78": "78px", "88": "88px", "90": "90px", "96": "96px", "100": "100px", "105": "105px", "120": "120px", "140": "140px", "145": "145px", "180": "180px", "190": "190px",
};

export type AppGridColumns = 1 | 2 | 3 | 4 | 5;
export type AppGridTemplate = "equal" | "hero" | "serviceHero" | "contentAside";

type GridOwnProps = {
    columns?: AppGridColumns;
    tabletColumns?: AppGridColumns;
    desktopColumns?: AppGridColumns;
    gap?: AppSpacing;
    rowGap?: AppSpacing;
    columnGap?: AppSpacing;
    template?: AppGridTemplate;
    align?: "start" | "center" | "end" | "stretch";
};

export type AppGridProps<T extends ElementType = "div"> = GridOwnProps & {
    as?: T;
    children?: ReactNode;
} & Omit<ComponentPropsWithRef<T>, keyof GridOwnProps | "as" | "children">;

export const AppGrid = <T extends ElementType = "div">({
    as,
    children,
    className,
    style,
    columns = 1,
    tabletColumns,
    desktopColumns,
    gap = "0",
    rowGap,
    columnGap,
    template = "equal",
    align = "stretch",
    ...props
}: AppGridProps<T>) => {
    const Component = as ?? "div";
    const gridStyle = {
        "--app-grid-columns": columns,
        "--app-grid-tablet-columns": tabletColumns ?? columns,
        "--app-grid-desktop-columns": desktopColumns ?? tabletColumns ?? columns,
        "--app-grid-gap": gridGapValues[gap],
        "--app-grid-row-gap": gridGapValues[rowGap ?? gap],
        "--app-grid-column-gap": gridGapValues[columnGap ?? gap],
        ...style,
    } as CSSProperties;

    return (
        <Component
            className={classNames(styles.grid, styles[template], styles[`align-${align}`], className)}
            style={gridStyle}
            {...props}
        >
            {children}
        </Component>
    );
};
