import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "@/app/App";
import { StoreProvider } from "@/app/providers/StoreProvider";
import { createReduxStore } from "@/app/store";
import { getRouteDefinition, routeManifest } from "@/shared/config/routes";

export { routeManifest };

const renderApplication = (url: string) => new Promise<string>((resolve, reject) => {
    let html = "";
    let renderError: unknown;
    const destination = new Writable({
        write(chunk, _encoding, callback) {
            html += chunk.toString();
            callback();
        },
    });

    destination.on("finish", () => {
        if (renderError) reject(renderError);
        else resolve(html);
    });
    destination.on("error", reject);

    const store = createReduxStore();
    const stream = renderToPipeableStream(
        <StaticRouter location={url}>
            <StoreProvider store={store}>
                <App />
            </StoreProvider>
        </StaticRouter>,
        {
            onAllReady() {
                stream.pipe(destination);
            },
            onShellError(error) {
                reject(error);
            },
            onError(error) {
                renderError = error;
            },
        },
    );
});

export const render = async (url: string) => {
    const route = getRouteDefinition(url);
    const html = await renderApplication(url);
    return { html, route };
};