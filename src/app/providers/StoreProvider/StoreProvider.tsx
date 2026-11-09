import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store as defaultStore, type ReduxStoreWithManager } from "@/app/store";

interface StoreProviderProps {
    children: ReactNode;
    store?: ReduxStoreWithManager;
}

export const StoreProvider = ({ children, store = defaultStore }: StoreProviderProps) => (
    <Provider store={store}>{children}</Provider>
);
