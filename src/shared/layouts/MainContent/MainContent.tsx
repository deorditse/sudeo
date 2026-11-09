import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { Container, type ContainerWidth } from "@shared/layouts/Container";

export type MainContentWidth = ContainerWidth;

export interface MainContentProps extends HTMLAttributes<HTMLElement> {
    as?: ElementType;
    children: ReactNode;
    width?: MainContentWidth;
}

export const MainContent = ({ as, children, width = "default", className, ...props }: MainContentProps) => {
    return <Container as={as} width={width} className={className} {...props}>{children}</Container>;
};
