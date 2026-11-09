import { services } from "@shared/content/siteContent";
import type { ServicesPageModel } from "./types";
export const selectServicesPageModel = (): ServicesPageModel => ({ services });
