export type AnalyticsEventName =
    | "service_view"
    | "contact_click"
    | "form_start"
    | "form_success"
    | "form_error";

export const emitSafeEvent = (name: AnalyticsEventName, details: Record<string, string> = {}) => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("sudeo:analytics", { detail: { name, ...details } }));
};
