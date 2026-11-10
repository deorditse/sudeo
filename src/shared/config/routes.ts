export interface RouteDefinition {
    path: string;
    clientEntry: string;
    title: string;
    description: string;
    indexable: boolean;
    sitemap?: boolean;
}

export const siteUrl = "https://sudeo.ru";

export const routeManifest: RouteDefinition[] = [
    {
        path: "/",
        clientEntry: "src/pages/home/ui/HomePage/HomePage.tsx",
        title: "Sudeo — цифровые продукты и автоматизация для бизнеса",
        description: "Разрабатываем ИИ-агентов, сайты, мобильные приложения и digital-маркетинг для компаний и предпринимателей.",
        indexable: true,
        sitemap: true,
    },
    {
        path: "/services",
        clientEntry: "src/pages/services/ui/ServicesPage/ServicesPage.tsx",
        title: "Услуги — Sudeo",
        description: "Четыре направления: ИИ-агенты, веб-разработка, мобильные приложения и digital-маркетинг.",
        indexable: true,
        sitemap: true,
    },
    {
        path: "/services/ai-agents",
        clientEntry: "src/pages/service/ui/ServicePage/ServicePage.tsx",
        title: "ИИ-агенты и автоматизация — Sudeo",
        description: "Агенты для баз знаний, обработки обращений, документов, поиска информации и действий через API.",
        indexable: true,
        sitemap: true,
    },
    {
        path: "/services/web-development",
        clientEntry: "src/pages/service/ui/ServicePage/ServicePage.tsx",
        title: "Разработка сайтов — Sudeo",
        description: "Посадочные страницы, корпоративные сайты, каталоги, интернет-магазины и веб-сервисы.",
        indexable: true,
        sitemap: true,
    },
    {
        path: "/services/mobile-apps",
        clientEntry: "src/pages/service/ui/ServicePage/ServicePage.tsx",
        title: "Разработка мобильных приложений — Sudeo",
        description: "Приложения для iOS и Android, клиентские кабинеты и корпоративные мобильные продукты.",
        indexable: true,
        sitemap: true,
    },
    {
        path: "/services/digital-marketing",
        clientEntry: "src/pages/service/ui/ServicePage/ServicePage.tsx",
        title: "Digital-маркетинг — Sudeo",
        description: "Исследование аудитории, стратегия, SEO, реклама, контент, посадочные страницы и аналитика.",
        indexable: true,
        sitemap: true,
    },
    {
        path: "/cases",
        clientEntry: "src/pages/cases/ui/CasesPage/CasesPage.tsx",
        title: "Демонстрации и кейсы — Sudeo",
        description: "Демонстрационные проекты и будущие подтверждённые кейсы команды Sudeo.",
        indexable: true,
        sitemap: true,
    },
    {
        path: "/cases/knowledge-agent-demo",
        clientEntry: "src/pages/case/ui/CasePage/CasePage.tsx",
        title: "Демонстрация агента по базе знаний — Sudeo",
        description: "Учебный сценарий ИИ-агента с источниками, цитированием, передачей человеку и журналированием.",
        indexable: true,
        sitemap: true,
    },
    {
        path: "/about",
        clientEntry: "src/pages/about/ui/AboutPage/AboutPage.tsx",
        title: "О компании — Sudeo",
        description: "Компетенции, роли и прозрачный процесс работы над цифровыми продуктами.",
        indexable: true,
        sitemap: true,
    },
    {
        path: "/blog",
        clientEntry: "src/pages/blog/ui/BlogPage/BlogPage.tsx",
        title: "Блог — Sudeo",
        description: "Практические материалы об автоматизации, разработке цифровых продуктов и продвижении.",
        indexable: true,
        sitemap: true,
    },
    {
        path: "/blog/how-to-start-ai-pilot",
        clientEntry: "src/pages/article/ui/ArticlePage/ArticlePage.tsx",
        title: "Как начать пилот ИИ-агента — Sudeo",
        description: "Как выбрать сценарий, проверить данные и определить критерии успешного пилота ИИ-агента.",
        indexable: true,
        sitemap: true,
    },
    {
        path: "/contacts",
        clientEntry: "src/pages/contacts/ui/ContactsPage/ContactsPage.tsx",
        title: "Контакты — Sudeo",
        description: "Обсудите задачу и выберите подходящее направление цифрового проекта.",
        indexable: true,
        sitemap: true,
    },
    {
        path: "/privacy",
        clientEntry: "src/pages/privacy/ui/PrivacyPage/PrivacyPage.tsx",
        title: "Обработка данных — Sudeo",
        description: "Статус правовых документов и правила обработки данных формы обращения.",
        indexable: true,
        sitemap: true,
    },
    {
        path: "/success",
        clientEntry: "src/pages/success/ui/SuccessPage/SuccessPage.tsx",
        title: "Обращение принято — Sudeo",
        description: "Подтверждение надёжно принятого обращения.",
        indexable: false,
    },
    {
        path: "/404",
        clientEntry: "src/pages/notFound/ui/NotFoundPage/NotFoundPage.tsx",
        title: "Страница не найдена — Sudeo",
        description: "Запрошенная страница не найдена.",
        indexable: false,
    },
];

export interface NavigationItem {
    path: string;
    label: string;
}

export interface NavigationGroup {
    label: string;
    items: NavigationItem[];
}

export const navigationGroups: NavigationGroup[] = [
    {
        label: "Основное",
        items: [
            { path: "/", label: "Главная" },
            { path: "/about", label: "О компании" },
            { path: "/contacts", label: "Контакты" },
        ],
    },
    {
        label: "Услуги",
        items: [
            { path: "/services", label: "Все услуги" },
            { path: "/services/ai-agents", label: "ИИ-агенты" },
            { path: "/services/web-development", label: "Веб-разработка" },
            { path: "/services/mobile-apps", label: "Мобильные приложения" },
            { path: "/services/digital-marketing", label: "Digital-маркетинг" },
        ],
    },
    {
        label: "Проекты и знания",
        items: [
            { path: "/cases", label: "Проекты" },
            { path: "/cases/knowledge-agent-demo", label: "Демо ИИ-агента" },
            { path: "/blog", label: "Блог" },
            { path: "/blog/how-to-start-ai-pilot", label: "Как начать ИИ-пилот" },
        ],
    },
    {
        label: "Документы",
        items: [
            { path: "/privacy", label: "Обработка данных" },
        ],
    },
];

export const visitorNavigationItems = navigationGroups.flatMap((group) => group.items);

export const normalizePathname = (pathname: string) =>
    pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

export const getNavigationItem = (pathname: string) =>
    visitorNavigationItems.find((item) => item.path === normalizePathname(pathname));

export const isNavigationPathActive = (pathname: string, path: string) => {
    const current = normalizePathname(pathname);
    return path === "/" ? current === path : current === path || current.startsWith(`${path}/`);
};

export const getRouteDefinition = (pathname: string): RouteDefinition =>
    routeManifest.find((route) => route.path === normalizePathname(pathname)) ??
    routeManifest.find((route) => route.path === "/404")!;
