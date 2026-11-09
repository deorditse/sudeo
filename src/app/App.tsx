import { Suspense } from "react";
import { useLocation } from "react-router-dom";
import { AppRouter } from "@/app/routes";
import { MetaManager } from "@/app/providers/MetaManager";
import { MainLayout } from "@/shared/layouts/MainLayout";
import { AppLoader } from "@shared/ui";
import "./styles/index.scss";

const App = () => {
    const location = useLocation();

    return (
        <>
            <MetaManager />
            <MainLayout>
                <Suspense key={location.pathname} fallback={<AppLoader />}>
                    <AppRouter />
                </Suspense>
            </MainLayout>
        </>
    );
};

export default App;