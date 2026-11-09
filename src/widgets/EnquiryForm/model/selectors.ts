import { initialEnquiryFormState } from "./slice";
import type { EnquiryFormSchema } from "./types";

interface StateWithEnquiryForm {
    enquiryForm?: EnquiryFormSchema;
}

export const selectEnquiryForm = (state: StateWithEnquiryForm) => state.enquiryForm ?? initialEnquiryFormState;
