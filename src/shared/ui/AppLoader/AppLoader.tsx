import styles from "./AppLoader.module.scss";

export interface AppLoaderProps {
    label?: string;
    variant?: "content" | "viewport";
    exiting?: boolean;
    announce?: boolean;
}

export const AppLoader = ({ label = "Загружаем страницу", variant = "content", exiting = false, announce = true }: AppLoaderProps) => (
    <div
        className={`${styles.loader} ${variant === "viewport" ? styles.viewport : ""} ${exiting ? styles.exiting : ""}`}
        role={announce ? "status" : undefined}
        aria-label={announce ? label : undefined}
        aria-live={announce ? "polite" : undefined}
        aria-atomic={announce ? "true" : undefined}
    >
        <div className={styles.stage} aria-hidden="true">
            <span className={styles.orbit} />
            <span className={styles.orbitInner} />
            <span className={styles.brand}>
                <span className={styles.logoMark}>
                    <i />
                    <i />
                    <i />
                </span>
                <span className={styles.wordmark}>SUDEO</span>
            </span>
            <span className={styles.progress}>
                <i />
            </span>
        </div>
        {announce && <span className={styles.visuallyHidden}>{label}</span>}
    </div>
);
