export interface EnquiryFormValues {
    name: string;
    contact: string;
    service: string;
    task: string;
}

export type EnquiryFormErrors = Partial<Record<keyof EnquiryFormValues, string>>;
export type EnquiryFormStatus = "idle" | "pending" | "error";

export interface EnquiryFormSchema {
    values: EnquiryFormValues;
    errors: EnquiryFormErrors;
    status: EnquiryFormStatus;
    message: string;
    started: boolean;
}
