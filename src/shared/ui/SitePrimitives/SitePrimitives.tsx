import type { CSSProperties, ReactNode } from "react";
import { services } from "@shared/content/siteContent";
import { MainContent } from "@shared/layouts/MainContent";
import { AppLink, AppText, HStack, VStack } from "@shared/ui";
import styles from "./SitePrimitives.module.scss";

export const Arrow = () => <span aria-hidden="true">↗</span>;

export const Logo = () => (
    <AppLink className={styles.logo} to="/" aria-label="Sudeo — на главную">
        <span className={styles.logoMark} aria-hidden="true"><i /><i /><i /></span>
        <span>SUDEO</span>
    </AppLink>
);

export const SectionHeading = ({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) => (
    <VStack className={styles.sectionHeading} gap="24">
        <AppText className={styles.eyebrow} size="xs" weight="bold">{eyebrow}</AppText>
        <AppText className={styles.sectionTitle} as="h2" size="xl" weight="medium">{title}</AppText>
        {text && <AppText className={styles.sectionIntro} tone="muted" size="l">{text}</AppText>}
    </VStack>
);

export const Breadcrumbs = ({ items }: { items: Array<[string, string?]> }) => (
    <HStack className={styles.breadcrumbs} as="nav" gap="12" aria-label="Хлебные крошки">
        <AppLink to="/">Главная</AppLink>
        {items.map(([label, href]) => (
            <span className={styles.breadcrumbItem} key={label}>{href ? <AppLink to={href}>{label}</AppLink> : <span aria-current="page">{label}</span>}</span>
        ))}
    </HStack>
);

export const ServiceCard = ({ service }: { service: (typeof services)[number] }) => (
    <VStack className={styles.serviceCard} as="article" gap="16" align="stretch" style={{ "--card-accent": service.accent } as CSSProperties}>
        <HStack className={styles.cardTop} justify="between"><span>{service.number}</span><span className={styles.cardDot} /></HStack>
        <AppText className={styles.serviceCardTitle} as="h3" size="xl" weight="medium">{service.title}</AppText>
        <AppText className={styles.serviceCardText}>{service.short}</AppText>
        <AppLink className={styles.cardLink} to={`/services/${service.slug}`} aria-label={`Подробнее: ${service.title}`}>Подробнее <Arrow /></AppLink>
    </VStack>
);

export const Faq = ({ items }: { items: Array<{ question: string; answer: string }> }) => (
    <VStack className={styles.faqList} align="stretch">
        {items.map((item) => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}
    </VStack>
);

export const PageHero = ({ eyebrow, title, text, children }: { eyebrow: string; title: string; text: string; children?: ReactNode }) => (
    <section className={styles.pageHero}>
        <MainContent>
            <AppText className={styles.eyebrow} size="xs" weight="bold">{eyebrow}</AppText>
            <AppText className={styles.pageTitle} as="h1" size="hero" weight="medium">{title}</AppText>
            <AppText className={styles.pageIntro} size="l">{text}</AppText>
            {children}
        </MainContent>
    </section>
);

export const BulletPanel = ({ title, items }: { title: string; items: string[] }) => (
    <VStack className={styles.bulletPanel} gap="24" align="stretch">
        <AppText as="h3" size="l" weight="semibold">{title}</AppText>
        <ul>{items.map((item) => <li key={item}><span aria-hidden="true">↗</span>{item}</li>)}</ul>
    </VStack>
);
