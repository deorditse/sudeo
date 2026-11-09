import { article } from "@shared/content/siteContent";
import type { BlogPageModel } from "./types";
export const selectBlogPageModel = (): BlogPageModel => ({ articles: [article] });
