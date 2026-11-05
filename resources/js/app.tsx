import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './hooks/use-appearance';

declare global {
    const route: typeof routeFn;
    interface Window {
        dataLayer?: Array<Record<string, unknown> | unknown[]>;
        gtag?: (...args: unknown[]) => void;
    }
}

const appName = import.meta.env.VITE_APP_NAME || 'Quem Me Deve';

// Dispara pageview no dataLayer e no GA4 nas trocas de rota do Inertia SPA
router.on('navigate', (event) => {
    if (typeof window !== 'undefined') {
        if (typeof window.gtag === 'function') {
            window.gtag('config', 'G-V5ZKK1846Q', {
                page_path: event.detail.page.url,
                page_title: document.title,
                page_location: window.location.href,
            });
        }
        if (Array.isArray(window.dataLayer)) {
            window.dataLayer.push({
                event: 'page_view',
                page_path: event.detail.page.url,
                page_title: document.title,
                page_location: window.location.href,
            });
        }
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
