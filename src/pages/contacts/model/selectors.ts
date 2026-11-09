import type { ContactsPageModel } from "./types";
export const selectContactsPageModel = (): ContactsPageModel => ({
    responseTime: "Ответим в течение одного рабочего дня.",
    privacyNotice: "Контактные данные используются только для ответа на запрос.",
});
