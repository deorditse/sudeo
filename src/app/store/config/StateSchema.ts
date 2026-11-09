import type { EnhancedStore, Reducer, ReducersMapObject, UnknownAction } from "@reduxjs/toolkit";
import type { EnquiryFormSchema } from "@/widgets/EnquiryForm/model/types";

export interface AppState {
    initialized: boolean;
}

export interface StateSchema {
    app: AppState;
    enquiryForm?: EnquiryFormSchema;
}

export type StateSchemaKey = keyof StateSchema;
export type MountedReducers = Partial<Record<StateSchemaKey, boolean>>;

export interface ReducerManager {
    getReducerMap: () => ReducersMapObject<StateSchema>;
    getMountedReducers: () => MountedReducers;
    reduce: (state: StateSchema | undefined, action: UnknownAction) => StateSchema;
    add: (key: StateSchemaKey, reducer: Reducer) => void;
    remove: (key: StateSchemaKey) => void;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
    reducerManager: ReducerManager;
}
