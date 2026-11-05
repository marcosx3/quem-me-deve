<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- Google tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-V5ZKK1846Q"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-V5ZKK1846Q');
        </script>

        <!-- Google Tag Manager -->
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-KLJ4R5Q8"></script>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <script>
            (function () {
                const appearance = localStorage.getItem('appearance') || 'light';
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (appearance === 'dark' || (appearance === 'system' && prefersDark)) {
                    document.documentElement.classList.add('dark');
                }
            })();
        </script>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KLJ4R5Q8"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->

        @inertia
    </body>
</html>
