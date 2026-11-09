import type { ReactNode } from "react";
import type { Reducer } from "@reduxjs/toolkit";

export type DynamicReducersList = Record<string, Reducer>;

export interface DynamicModuleLoaderProps {
    children: ReactNode;
    reducers: DynamicReducersList;
    removeAfterUnmount?: boolean;
}
