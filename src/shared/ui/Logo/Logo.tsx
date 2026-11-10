import { AppLink } from "@shared/ui/AppLink";
import styles from "./Logo.module.scss";

export const Logo = () => (
    <AppLink className={styles.logo} to="/" aria-label="Sudeo — на главную">
        <span className={styles.logoMark} aria-hidden="true">
            <i />
            <i />
            <i />
        </span>
        <span>SUDEO</span>
    </AppLink>
);
