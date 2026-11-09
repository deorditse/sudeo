import { combineReducers, type Reducer, type ReducersMapObject, type UnknownAction } from "@reduxjs/toolkit";
import type { MountedReducers, ReducerManager, StateSchema, StateSchemaKey } from "./StateSchema";

export const createReducerManager = (initialReducers: ReducersMapObject<StateSchema>): ReducerManager => {
    const reducers = { ...initialReducers };
    const staticReducers = Object.keys(initialReducers) as StateSchemaKey[];
    const mountedReducers: MountedReducers = {};
    let combinedReducer = combineReducers(reducers) as Reducer<StateSchema>;
    let keysToRemove: StateSchemaKey[] = [];

    return {
        getReducerMap: () => reducers,
        getMountedReducers: () => mountedReducers,
        reduce: (state: StateSchema | undefined, action: UnknownAction) => {
            if (!state) return combinedReducer(state, action);

            if (keysToRemove.length > 0) {
                const nextState = { ...state };
                keysToRemove.forEach((key) => delete nextState[key]);
                state = nextState;
                keysToRemove = [];
            }

            return combinedReducer(state, action);
        },
        add: (key, reducer) => {
            if (!key || reducers[key]) return;
            reducers[key] = reducer;
            mountedReducers[key] = true;
            combinedReducer = combineReducers(reducers) as Reducer<StateSchema>;
        },
        remove: (key) => {
            if (!key || !reducers[key] || staticReducers.includes(key)) return;
            delete reducers[key];
            keysToRemove.push(key);
            mountedReducers[key] = false;
            combinedReducer = combineReducers(reducers) as Reducer<StateSchema>;
        },
    };
};
