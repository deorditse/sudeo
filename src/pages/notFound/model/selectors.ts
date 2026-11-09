import type { NotFoundPageModel } from "./types";
export const selectNotFoundPageModel = (): NotFoundPageModel => ({ code: "404", title: "Страница не найдена", description: "Проверьте адрес или вернитесь на главную страницу." });
