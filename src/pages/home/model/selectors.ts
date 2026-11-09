import { clientTasks, demoCase, homeFaq, services, workStages } from "@shared/content/siteContent";
import type { HomePageModel } from "./types";

export const selectHomePageModel = (): HomePageModel => ({
    tasks: clientTasks,
    services,
    demo: demoCase,
    stages: workStages,
    faq: homeFaq,
    competencies: ["Исследование и стратегия", "Проектирование интерфейсов", "Разработка и интеграции", "Запуск и аналитика"],
    heroIdentities: ["S", "AI", "WEB", "APP", "GROW"],
    heroServices: [
        { label: "AI AGENTS", path: "/services/ai-agents" },
        { label: "WEB DEVELOPMENT", path: "/services/web-development" },
        { label: "MOBILE APPS", path: "/services/mobile-apps" },
        { label: "DIGITAL MARKETING", path: "/services/digital-marketing" },
    ],
});
