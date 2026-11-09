import { useRoutes } from "react-router-dom";
import { NotFoundPage } from "@/pages/notFound";
import { publicRoutes } from "./config/public";

export const AppRouter = () => useRoutes([...publicRoutes, { path: "*", element: <NotFoundPage /> }]);
