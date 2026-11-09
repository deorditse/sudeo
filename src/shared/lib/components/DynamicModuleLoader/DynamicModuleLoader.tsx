import { useEffect, useLayoutEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import type { Reducer } from "@reduxjs/toolkit";
import type { DynamicModuleLoaderProps } from "./types";

interface DynamicReducerManager {
    getMountedReducers: () => Record<string, boolean | undefined>;
    add: (key: string, reducer: Reducer) => void;
    remove: (key: string) => void;
}

interface StoreWithReducerManager {
    reducerManager: DynamicReducerManager;
}

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export const DynamicModuleLoader = ({
    children,
    reducers,
    removeAfterUnmount = true,
}: DynamicModuleLoaderProps) => {
    const store = useStore() as unknown as StoreWithReducerManager;
    const dispatch = useDispatch();

    useIsomorphicLayoutEffect(() => {
        const mountedReducers = store.reducerManager.getMountedReducers();

        Object.entries(reducers).forEach(([name, reducer]) => {
            if (!mountedReducers[name] && reducer) {
                store.reducerManager.add(name, reducer);
                dispatch({ type: `@INIT ${name} reducer` });
            }
        });

        return () => {
            if (!removeAfterUnmount) return;
            Object.keys(reducers).forEach((name) => {
                store.reducerManager.remove(name);
                dispatch({ type: `@DESTROY ${name} reducer` });
            });
        };
    }, [dispatch, reducers, removeAfterUnmount, store]);

    return <>{children}</>;
};
