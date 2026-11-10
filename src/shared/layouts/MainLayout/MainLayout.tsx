import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { getNavigationItem, isNavigationPathActive, navigationGroups, normalizePathname } from "@shared/config/routes";
import { MainContent } from "@shared/layouts/MainContent";
import { AppButton, AppLink, AppText, Arrow, Logo } from "@shared/ui";
import styles from "./MainLayout.module.scss";

const primaryNavigation = [
    { path: "/services", label: "Услуги" },
    { path: "/cases", label: "Проекты" },
    { path: "/about", label: "О компании" },
    { path: "/blog", label: "Блог" },
];

const NavigationCatalog = ({ onNavigate }: { onNavigate?: () => void }) => {
    const location = useLocation();
    const currentPath = normalizePathname(location.pathname);
    return (
        <div className={styles.catalogGrid}>
            {navigationGroups.map((group) => (
                <div className={styles.catalogGroup} key={group.label}>
                    <AppText className={styles.catalogLabel} size="xs" weight="bold" uppercase>{group.label}</AppText>
                    <div className={styles.catalogLinks}>
                        {group.items.map((item) => {
                            const current = currentPath === item.path;
                            return <AppLink className={current ? styles.currentCatalogLink : undefined} key={item.path} to={item.path} aria-current={current ? "page" : undefined} onClick={onNavigate}>{item.label}{current && <span aria-hidden="true">●</span>}</AppLink>;
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [catalogOpen, setCatalogOpen] = useState(false);
    const location = useLocation();
    const catalogRef = useRef<HTMLDivElement>(null);
    const catalogButtonRef = useRef<HTMLButtonElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const currentItem = getNavigationItem(location.pathname);

    useEffect(() => {
        setMobileOpen(false);
        setCatalogOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!catalogOpen && !mobileOpen) return undefined;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            if (catalogOpen) {
                setCatalogOpen(false);
                catalogButtonRef.current?.focus();
            }
            if (mobileOpen) {
                setMobileOpen(false);
                menuButtonRef.current?.focus();
            }
        };
        const onPointerDown = (event: PointerEvent) => {
            if (catalogRef.current && !catalogRef.current.contains(event.target as Node)) setCatalogOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("pointerdown", onPointerDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("pointerdown", onPointerDown);
        };
    }, [catalogOpen, mobileOpen]);

    return (
        <header className={styles.header}>
            <MainContent className={styles.headerInner}>
                <Logo />
                <nav className={styles.desktopNav} aria-label="Основная навигация">
                    {primaryNavigation.map((item) => {
                        const active = isNavigationPathActive(location.pathname, item.path);
                        const exact = normalizePathname(location.pathname) === item.path;
                        return <AppLink className={active ? styles.activeNavLink : undefined} key={item.path} to={item.path} aria-current={exact ? "page" : undefined}>{item.label}</AppLink>;
                    })}
                </nav>
                <div className={styles.catalog} ref={catalogRef}>
                    <button ref={catalogButtonRef} className={styles.catalogButton} type="button" aria-expanded={catalogOpen} aria-controls="site-route-catalog" onClick={() => setCatalogOpen((value) => !value)}>
                        <span className={styles.currentRouteLabel}>Сейчас: <strong>{currentItem?.label ?? "Страница"}</strong></span>
                        <span className={styles.chevron} aria-hidden="true">⌄</span>
                    </button>
                    <div id="site-route-catalog" className={`${styles.catalogPanel} ${catalogOpen ? styles.catalogPanelOpen : ""}`} aria-hidden={!catalogOpen}>
                        <NavigationCatalog onNavigate={() => setCatalogOpen(false)} />
                    </div>
                </div>
                <AppLink className={styles.headerAction} to="/contacts">Обсудить проект <Arrow /></AppLink>
                <button ref={menuButtonRef} className={styles.menuButton} type="button" aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setMobileOpen((value) => !value)}>
                    <span /><span />
                </button>
            </MainContent>
            <nav id="mobile-navigation" className={`${styles.mobileNav} ${mobileOpen ? styles.mobileNavOpen : ""}`} aria-label="Мобильная навигация">
                <AppText className={styles.mobileCurrent} size="s">Открыта: <strong>{currentItem?.label ?? "Страница"}</strong></AppText>
                <NavigationCatalog onNavigate={() => setMobileOpen(false)} />
            </nav>
        </header>
    );
};

const Footer = () => {
    const location = useLocation();
    const currentPath = normalizePathname(location.pathname);
    return (
        <footer className={styles.footer}>
            <MainContent className={styles.footerLead}>
                <AppText className={styles.eyebrow} size="xs" weight="bold">Есть задача?</AppText>
                <AppText className={styles.footerTitle} as="h2" size="2xl" weight="medium">Давайте разберём её<br />без готовых шаблонов.</AppText>
                <AppButton to="/contacts" addonRight={<Arrow />}>Обсудить проект</AppButton>
            </MainContent>
            <MainContent className={styles.footerSitemap}>
                {navigationGroups.map((group) => (
                    <div key={group.label}>
                        <AppText className={styles.footerGroupTitle} size="xs" weight="bold" uppercase>{group.label}</AppText>
                        <div className={styles.footerGroupLinks}>{group.items.map((item) => <AppLink key={item.path} to={item.path} aria-current={currentPath === item.path ? "page" : undefined}>{item.label}</AppLink>)}</div>
                    </div>
                ))}
            </MainContent>
            <MainContent className={styles.footerBottom}>
                <Logo />
                <AppText className={styles.copyright}>© 2026 Sudeo. Рабочая версия сайта.</AppText>
            </MainContent>
        </footer>
    );
};

export const MainLayout = ({ children }: { children: ReactNode }) => (
    <div className={styles.app}>
        <a className={styles.skipLink} href="#main-content">Перейти к содержанию</a>
        <Header />
        {children}
        <Footer />
    </div>
);
