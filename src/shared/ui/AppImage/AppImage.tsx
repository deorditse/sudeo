import { useState, type CSSProperties, type ImgHTMLAttributes, type ReactNode } from "react";
import { classNames } from "@shared/lib/classNames";
import styles from "./AppImage.module.scss";

type AppImageBaseProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "height" | "width"> & {
    fallback?: ReactNode;
    errorFallback?: ReactNode;
    wrapperClassName?: string;
};

type IntrinsicImageProps = {
    width: number;
    height: number;
    aspectRatio?: never;
};

type RatioImageProps = {
    aspectRatio: CSSProperties["aspectRatio"];
    width?: number | string;
    height?: number | string;
};

export type AppImageProps = AppImageBaseProps & (IntrinsicImageProps | RatioImageProps);

export const AppImage = ({
    className,
    fallback,
    errorFallback,
    wrapperClassName,
    alt,
    onLoad,
    onError,
    aspectRatio,
    width,
    height,
    ...props
}: AppImageProps) => {
    const [state, setState] = useState<"loading" | "ready" | "error">(fallback ? "loading" : "ready");
    const wrapperStyle = aspectRatio === undefined
        ? { aspectRatio: `${width} / ${height}`, width }
        : { aspectRatio, width: width ?? "100%" };

    return (
        <span
            className={classNames(styles.wrapper, styles.ratio, wrapperClassName)}
            style={wrapperStyle}
        >
            {state === "loading" && fallback}
            {state === "error" && errorFallback}
            <img
                {...props}
                alt={alt ?? ""}
                className={classNames(styles.image, state !== "ready" && styles.pending, className)}
                width={width}
                height={height}
                onLoad={(event) => { setState("ready"); onLoad?.(event); }}
                onError={(event) => { setState("error"); onError?.(event); }}
            />
        </span>
    );
};
