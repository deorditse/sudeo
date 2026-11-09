import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/app/App";
import { StoreProvider } from "@/app/providers/StoreProvider";

const container = document.getElementById("root");

if (!container) {
    throw new Error("Root container was not found");
}

const application = (
    <StrictMode>
        <BrowserRouter>
            <StoreProvider>
                <App />
            </StoreProvider>
        </BrowserRouter>
    </StrictMode>
);

if (container.hasChildNodes()) {
    hydrateRoot(container, application);
} else {
    createRoot(container).render(application);
}
