import { AppLink, Box, HStack } from "@shared/ui";
import * as cls from "./HeroMarquee.module.scss";

interface HeroMarqueeItem {
    label: string;
    path: string;
}

interface HeroMarqueeProps {
    items: readonly HeroMarqueeItem[];
}

export const HeroMarquee = ({ items }: HeroMarqueeProps) => (
    <Box as="nav" className={cls.marquee} aria-label="Направления услуг">
        <HStack className={cls.track}>
            <HStack className={cls.group} align="center">
                {items.map((item) => (
                    <HStack className={cls.item} align="center" key={item.path}>
                        <AppLink className={cls.link} to={item.path}>
                            {item.label}
                        </AppLink>
                        <i aria-hidden="true" />
                    </HStack>
                ))}
            </HStack>
            <HStack className={cls.group} align="center" aria-hidden="true">
                {items.map((item) => (
                    <HStack className={cls.item} align="center" key={item.path}>
                        <AppLink className={cls.link} tabIndex={-1} to={item.path}>
                            {item.label}
                        </AppLink>
                        <i />
                    </HStack>
                ))}
            </HStack>
        </HStack>
    </Box>
);
