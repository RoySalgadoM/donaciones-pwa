import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

if (!self.define) {
    let registry = {};

    let nextDefineUri;

    const singleRequire = (uri, parentUri) => {
        uri = new URL(uri + ".js", parentUri).href;
        return registry[uri] || (

            new Promise(resolve => {
                if ("document" in self) {
                    const script = document.createElement("script");
                    script.src = uri;
                    script.onload = resolve;
                    document.head.appendChild(script);
                } else {
                    nextDefineUri = uri;
                    importScripts(uri);
                    resolve();
                }
            })

                .then(() => {
                    let promise = registry[uri];
                    if (!promise) {
                        throw new Error(`Module ${uri} didn’t register its module`);
                    }
                    return promise;
                })
        );
    };

    self.define = (depsNames, factory) => {
        const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
        if (registry[uri]) {
            // Module is already loading or loaded.
            return;
        }
        let exports = {};
        const require = depUri => singleRequire(depUri, uri);
        const specialDeps = {
            module: { uri },
            exports,
            require
        };
        registry[uri] = Promise.all(depsNames.map(
            depName => specialDeps[depName] || require(depName)
        )).then(deps => {
            factory(...deps);
            return exports;
        });
    };
}
define(['./workbox-020f9b45'], (function (workbox) {
    'use strict';

    self.skipWaiting();
    workbox.clientsClaim();

    /**
     * The precacheAndRoute() method efficiently caches and responds to
     * requests for URLs in the manifest.
     * See https://goo.gl/S9QRab
     */
    workbox.precacheAndRoute([{
        "url": "index.html",
        "revision": "0.s9bcgj9q0ro"
    }], {});
    workbox.cleanupOutdatedCaches();
    workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html"), {
        allowlist: [/^\/$/]
    }));
    workbox.registerRoute(({
        url
    }) => {
        return url.pathname.startsWith("/api");
    }, new workbox.NetworkFirst({
        "cacheName": "api-cache",
        plugins: [new workbox.ExpirationPlugin({
            maxEntries: 10,
            maxAgeSeconds: 31536000
        }), new workbox.CacheableResponsePlugin({
            statuses: [0, 200]
        })]
    }), 'GET');
    workbox.registerRoute(({
        url
    }) => {
        return url.pathname.startsWith("/");
    }, new workbox.NetworkFirst({
        "cacheName": "static-cache",
        plugins: [new workbox.ExpirationPlugin({
            maxEntries: 10,
            maxAgeSeconds: 31536000
        }), new workbox.CacheableResponsePlugin({
            statuses: [0, 200]
        })]
    }), 'GET');

}));


//# sourceMappingURL=sw.js.map
