import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EnquiryFormErrors, EnquiryFormSchema, EnquiryFormStatus, EnquiryFormValues } from "./types";

export const initialEnquiryFormState: EnquiryFormSchema = {
    values: { name: "", contact: "", service: "", task: "" },
    errors: {},
    status: "idle",
    message: "",
    started: false,
};

const enquiryFormSlice = createSlice({
    name: "enquiryForm",
    initialState: initialEnquiryFormState,
    reducers: {
        setField: (state, action: PayloadAction<{ field: keyof EnquiryFormValues; value: string }>) => {
            const { field, value } = action.payload;
            state.values[field] = value;
            delete state.errors[field];
        },
        setErrors: (state, action: PayloadAction<EnquiryFormErrors>) => {
            state.errors = action.payload;
        },
        setStatus: (state, action: PayloadAction<EnquiryFormStatus>) => {
            state.status = action.payload;
        },
        setMessage: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
        },
        markStarted: (state) => {
            state.started = true;
        },
        initializeService: (state, action: PayloadAction<string>) => {
            if (!state.values.service) state.values.service = action.payload;
        },
    },
});

export const { actions: enquiryFormActions, reducer: enquiryFormReducer } = enquiryFormSlice;

export const validateEnquiryForm = (values: EnquiryFormValues): EnquiryFormErrors => {
    const errors: EnquiryFormErrors = {};
    if (values.name.trim().length < 2) errors.name = "Укажите имя — минимум 2 символа.";
    if (values.contact.trim().length < 5) errors.contact = "Укажите один контакт: email, телефон или мессенджер.";
    if (!values.service) errors.service = "Выберите направление.";
    if (values.task.trim().length < 20) errors.task = "Опишите задачу подробнее — минимум 20 символов.";
    return errors;
};
