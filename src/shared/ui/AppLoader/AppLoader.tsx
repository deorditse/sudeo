import styles from "./AppLoader.module.scss";

export interface AppLoaderProps {
    label?: string;
}

export const AppLoader = ({ label = "Загружаем страницу" }: AppLoaderProps) => (
    <div className={styles.loader} role="status" aria-live="polite" aria-atomic="true">
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
        <span className={styles.visuallyHidden}>{label}</span>
    </div>
);
