import type { RouteObject } from "react-router-dom";
import { AboutPage } from "@/pages/about";
import { ArticlePage } from "@/pages/article";
import { BlogPage } from "@/pages/blog";
import { CasePage } from "@/pages/case";
import { CasesPage } from "@/pages/cases";
import { ContactsPage } from "@/pages/contacts";
import { HomePage } from "@/pages/home";
import { NotFoundPage } from "@/pages/notFound";
import { PrivacyPage } from "@/pages/privacy";
import { ServicePage } from "@/pages/service";
import { ServicesPage } from "@/pages/services";
import { SuccessPage } from "@/pages/success";

export const publicRoutes: RouteObject[] = [
    { path: "/", element: <HomePage /> },
    { path: "/services", element: <ServicesPage /> },
    { path: "/services/:slug", element: <ServicePage /> },
    { path: "/cases", element: <CasesPage /> },
    { path: "/cases/knowledge-agent-demo", element: <CasePage /> },
    { path: "/about", element: <AboutPage /> },
    { path: "/blog", element: <BlogPage /> },
    { path: "/blog/how-to-start-ai-pilot", element: <ArticlePage /> },
    { path: "/contacts", element: <ContactsPage /> },
    { path: "/privacy", element: <PrivacyPage /> },
    { path: "/success", element: <SuccessPage /> },
    { path: "/404", element: <NotFoundPage /> },
];
