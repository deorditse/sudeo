import { Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppRouter } from "@/app/routes";
import { MetaManager } from "@/app/providers/MetaManager";
import { APP_READY_EVENT } from "@/app/bootstrap";
import { MainLayout } from "@/shared/layouts/MainLayout";
import { AppLoader } from "@shared/ui";
import "./styles/index.scss";

const App = () => {
    const location = useLocation();
    const [bootstrapComplete, setBootstrapComplete] = useState(false);

    useEffect(() => {
        window.dispatchEvent(new Event(APP_READY_EVENT));
        const timer = window.setTimeout(() => setBootstrapComplete(true), 200);
        return () => window.clearTimeout(timer);
    }, []);

    return (
        <>
            <MetaManager />
            <MainLayout>
                <Suspense key={location.pathname} fallback={<AppLoader announce={bootstrapComplete} />}>
                    <AppRouter />
                </Suspense>
            </MainLayout>
        </>
    );
};

export default App;