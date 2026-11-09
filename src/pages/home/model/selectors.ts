import { clientTasks, demoCase, homeFaq, services, workStages } from "@shared/content/siteContent";
import type { HomePageModel } from "./types";

export const selectHomePageModel = (): HomePageModel => ({
    tasks: clientTasks,
    services,
    demo: demoCase,
    stages: workStages,
    faq: homeFaq,
    competencies: ["Исследование и стратегия", "Проектирование интерфейсов", "Разработка и интеграции", "Запуск и аналитика"],
});
