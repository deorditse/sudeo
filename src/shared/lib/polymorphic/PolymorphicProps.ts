import type {
    ComponentPropsWithRef,
    ComponentPropsWithoutRef,
    ElementType,
} from "react";

export type PolymorphicProps<
    T extends ElementType,
    OwnProps extends object,
> = OwnProps & {
    as?: T;
    ref?: ComponentPropsWithRef<NoInfer<T>>["ref"];
} & Omit<ComponentPropsWithoutRef<T>, keyof OwnProps | "as">;
