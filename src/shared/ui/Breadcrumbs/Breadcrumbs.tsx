import { AppLink } from "@shared/ui/AppLink";
import { HStack } from "@shared/ui/Stack";
import styles from "./Breadcrumbs.module.scss";

export type BreadcrumbItem = [label: string, href?: string];

export type BreadcrumbsProps = {
    items: BreadcrumbItem[];
};

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
    <nav aria-label="Хлебные крошки">
        <HStack className={styles.breadcrumbs} as="ol" gap="12">
            <li>
                <AppLink to="/">Главная</AppLink>
            </li>
            {items.map(([label, href]) => (
                <li className={styles.breadcrumbItem} key={label}>
                    {href ? (
                        <AppLink to={href}>{label}</AppLink>
                    ) : (
                        <span aria-current="page">{label}</span>
                    )}
                </li>
            ))}
        </HStack>
    </nav>
);
