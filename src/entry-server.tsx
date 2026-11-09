import { prerenderToNodeStream } from "react-dom/static";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "@/app/App";
import { StoreProvider } from "@/app/providers/StoreProvider";
import { createReduxStore } from "@/app/store";
import { getRouteDefinition, routeManifest } from "@/shared/config/routes";

export { routeManifest };

const createApplication = (url: string) => (
    <StaticRouter location={url}>
        <StoreProvider store={createReduxStore()}>
            <App />
        </StoreProvider>
    </StaticRouter>
);

const renderApplication = async (url: string) => {
    let renderError: unknown;
    const { prelude } = await prerenderToNodeStream(
        createApplication(url),
        {
            onError(error) {
                renderError = error;
            },
        },
    );

    for await (const chunk of prelude) void chunk;
    if (renderError) throw renderError;
    return renderToString(createApplication(url));
};

export const render = async (url: string) => {
    const route = getRouteDefinition(url);
    const html = await renderApplication(url);
    return { html, route };
};