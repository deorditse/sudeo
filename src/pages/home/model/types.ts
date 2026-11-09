import type { clientTasks, demoCase, homeFaq, services, workStages } from "@shared/content/siteContent";

export interface HeroServiceItem {
    label: string;
    path: string;
}

export interface HomePageModel {
    tasks: typeof clientTasks;
    services: typeof services;
    demo: typeof demoCase;
    stages: typeof workStages;
    faq: typeof homeFaq;
    competencies: readonly string[];
    heroIdentities: readonly string[];
    heroServices: readonly HeroServiceItem[];
}
