import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getRouteDefinition, siteUrl } from "@/shared/config/routes";

export const MetaManager = () => {
    const location = useLocation();

    useEffect(() => {
        const route = getRouteDefinition(location.pathname);
        document.title = route.title;
        const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
        if (description) description.content = route.description;
        const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (canonical) canonical.href = `${siteUrl}${route.path === "/404" ? location.pathname : route.path}`;
        const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
        if (robots) robots.content = route.indexable ? "index,follow" : "noindex,nofollow";
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [location.pathname]);

    return null;
};
