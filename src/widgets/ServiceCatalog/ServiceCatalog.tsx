import type { CSSProperties, ElementType } from "react";
import type { ServiceContent } from "@shared/content/siteContent";
import { AppGrid, AppLink, AppText, Card, HStack, VStack } from "@shared/ui";
import styles from "./ServiceCatalog.module.scss";

export interface ServiceCardProps {
    service: ServiceContent;
    headingLevel?: Extract<ElementType, "h2" | "h3" | "h4">;
}

export const ServiceCard = ({ service, headingLevel = "h3" }: ServiceCardProps) => (
    <li className={styles.item} style={{ "--card-accent": service.accent } as CSSProperties}>
        <Card as="article" className={styles.card} padding="default">
            <VStack className={styles.content} gap="16" align="stretch">
                <HStack className={styles.top} justify="between">
                    <span>{service.number}</span>
                    <span className={styles.dot} aria-hidden="true" />
                </HStack>
                <AppText className={styles.title} as={headingLevel} size="xl" weight="medium">
                    {service.title}
                </AppText>
                <AppText className={styles.description}>{service.short}</AppText>
                <AppLink
                    className={styles.link}
                    to={`/services/${service.slug}`}
                    variant="action"
                    aria-label={`Подробнее: ${service.title}`}
                >
                    <span>Подробнее</span>
                    <span aria-hidden="true">↗</span>
                </AppLink>
            </VStack>
        </Card>
    </li>
);

export interface ServiceCatalogProps {
    services: readonly ServiceContent[];
    className?: string;
    headingLevel?: ServiceCardProps["headingLevel"];
}

export const ServiceCatalog = ({ services, className, headingLevel = "h3" }: ServiceCatalogProps) => (
    <AppGrid
        as="ul"
        className={[styles.catalog, className].filter(Boolean).join(" ")}
        columns={1}
        tabletColumns={2}
        desktopColumns={2}
        gap="18"
    >
        {services.map((service) => (
            <ServiceCard headingLevel={headingLevel} key={service.slug} service={service} />
        ))}
    </AppGrid>
);
