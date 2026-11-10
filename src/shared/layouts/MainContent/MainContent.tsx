import type { ElementType, ReactNode } from "react";
import { Container, type ContainerProps, type ContainerWidth } from "@shared/layouts/Container";
import type { PolymorphicProps } from "@shared/lib/polymorphic";

export type MainContentWidth = ContainerWidth;

type MainContentOwnProps = {
    children: ReactNode;
    width?: MainContentWidth;
};

export type MainContentProps<T extends ElementType = "div"> = PolymorphicProps<T, MainContentOwnProps>;

export const MainContent = <T extends ElementType = "div">({ as, children, width = "default", className, ref, ...props }: MainContentProps<T>) => {
    const containerProps = { as, children, width, className, ref, ...props } as unknown as ContainerProps<T>;
    return <Container<T> {...containerProps} />;
};
