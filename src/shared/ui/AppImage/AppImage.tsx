import { useState, type ImgHTMLAttributes, type ReactNode } from "react";
import { classNames } from "@shared/lib/classNames";
import styles from "./AppImage.module.scss";

export interface AppImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    fallback?: ReactNode;
    errorFallback?: ReactNode;
    wrapperClassName?: string;
}

export const AppImage = ({ className, fallback, errorFallback, wrapperClassName, alt, onLoad, onError, ...props }: AppImageProps) => {
    const [state, setState] = useState<"loading" | "ready" | "error">(fallback ? "loading" : "ready");

    return (
        <span className={classNames(styles.wrapper, wrapperClassName)}>
            {state === "loading" && fallback}
            {state === "error" && errorFallback}
            <img
                {...props}
                alt={alt ?? ""}
                className={classNames(styles.image, state !== "ready" && styles.pending, className)}
                onLoad={(event) => { setState("ready"); onLoad?.(event); }}
                onError={(event) => { setState("error"); onError?.(event); }}
            />
        </span>
    );
};
