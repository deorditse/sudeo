export type ClassValue = string | undefined | null | false;

export const classNames = (...values: ClassValue[]) => values.filter(Boolean).join(" ");
