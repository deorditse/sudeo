import { configureStore, createSlice, type ReducersMapObject } from "@reduxjs/toolkit";
import { createReducerManager } from "./createReducerManager";
import type { AppState, ReduxStoreWithManager, StateSchema } from "./StateSchema";

const appSlice = createSlice({
    name: "app",
    initialState: { initialized: true } satisfies AppState,
    reducers: {},
});

export const createReduxStore = (
    initialState?: Partial<StateSchema>,
    asyncReducers?: Partial<ReducersMapObject<StateSchema>>,
) => {
    const rootReducers = {
        app: appSlice.reducer,
        ...asyncReducers,
    } as ReducersMapObject<StateSchema>;
    const reducerManager = createReducerManager(rootReducers);
    const store = configureStore({
        reducer: reducerManager.reduce,
        preloadedState: initialState as StateSchema | undefined,
    }) as ReduxStoreWithManager;

    store.reducerManager = reducerManager;
    return store;
};

export const store = createReduxStore();
export type AppDispatch = typeof store.dispatch;
