import type { SuccessPageModel } from "./types";
export const selectSuccessPageModel = (): SuccessPageModel => ({ code: "ГОТОВО", title: "Заявка отправлена", description: "Мы получили запрос и вернёмся с ответом в течение одного рабочего дня." });
