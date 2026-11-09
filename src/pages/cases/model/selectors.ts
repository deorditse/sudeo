import { demoCase } from "@shared/content/siteContent";
import type { CasesPageModel } from "./types";
export const selectCasesPageModel = (): CasesPageModel => ({ cases: [demoCase] });
