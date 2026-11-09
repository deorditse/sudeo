import { Suspense } from "react";
import { AppRouter } from "@/app/routes";
import { MetaManager } from "@/app/providers/MetaManager";
import { MainLayout } from "@/shared/layouts/MainLayout";
import "./styles/index.scss";

const App = () => (
    <>
        <MetaManager />
        <MainLayout>
            <Suspense fallback={null}>
                <AppRouter />
            </Suspense>
        </MainLayout>
    </>
);

export default App;