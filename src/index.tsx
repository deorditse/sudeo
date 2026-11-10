import { StrictMode } from "react";
import { createRoot, hydrateRoot, type Root } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/app/App";
import { APP_READY_EVENT } from "@/app/bootstrap";
import { StoreProvider } from "@/app/providers/StoreProvider";
import { AppLoader } from "@shared/ui";

const container = document.getElementById("root");

if (!container) {
    throw new Error("Root container was not found");
}

const bootstrapLoaderHost = document.createElement("div");
bootstrapLoaderHost.id = "app-bootstrap-loader";
document.body.append(bootstrapLoaderHost);

const bootstrapLoaderRoot: Root = createRoot(bootstrapLoaderHost);
bootstrapLoaderRoot.render(<AppLoader variant="viewport" />);

let bootstrapLoaderDismissed = false;
let bootstrapLoaderExitTimer: number | undefined;

const removeBootstrapLoader = () => {
    if (bootstrapLoaderDismissed) return;
    bootstrapLoaderDismissed = true;
    window.removeEventListener(APP_READY_EVENT, onApplicationReady);
    if (bootstrapLoaderSafetyTimer) window.clearTimeout(bootstrapLoaderSafetyTimer);

    bootstrapLoaderRoot.render(<AppLoader variant="viewport" exiting />);
    const exitDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180;
    bootstrapLoaderExitTimer = window.setTimeout(() => {
        bootstrapLoaderRoot.unmount();
        bootstrapLoaderHost.remove();
    }, exitDuration);
};

function onApplicationReady() {
    const frame = window.requestAnimationFrame(removeBootstrapLoader);
    window.setTimeout(() => {
        window.cancelAnimationFrame(frame);
        removeBootstrapLoader();
    }, 100);
}

window.addEventListener(APP_READY_EVENT, onApplicationReady, { once: true });
const bootstrapLoaderSafetyTimer = window.setTimeout(removeBootstrapLoader, 8000);
window.addEventListener("pagehide", () => {
    if (bootstrapLoaderExitTimer) window.clearTimeout(bootstrapLoaderExitTimer);
    if (bootstrapLoaderSafetyTimer) window.clearTimeout(bootstrapLoaderSafetyTimer);
}, { once: true });

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
