import { services } from "@shared/content/siteContent";
import type { ServicePageModel } from "./types";
export const selectServiceBySlug = (slug?: string): ServicePageModel | undefined => services.find((service) => service.slug === slug);
