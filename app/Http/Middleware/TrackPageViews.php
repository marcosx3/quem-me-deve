<?php

namespace App\Http\Middleware;

use App\Models\SiteAccessLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class TrackPageViews
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Apenas requisições GET bem-sucedidas
        if ($request->isMethod('GET') && $this->shouldTrack($request)) {
            try {
                $rawIp = $request->ip() ?? '127.0.0.1';
                $salt = config('app.key') ?: 'quem-me-deve-salt';
                $ipHash = hash('sha256', $rawIp.$salt);

                SiteAccessLog::create([
                    'user_id' => $request->user()?->id,
                    'path' => '/'.ltrim($request->path(), '/'),
                    'method' => $request->method(),
                    'ip_hash' => $ipHash,
                    'user_agent' => substr((string) $request->userAgent(), 0, 500),
                    'referer' => substr((string) $request->headers->get('referer'), 0, 500),
                    'created_at' => now(),
                ]);
            } catch (Throwable) {
                // Silencioso para garantir que o rastreamento nunca afete a resposta
            }
        }

        return $response;
    }

    private function shouldTrack(Request $request): bool
    {
        $ignoredPatterns = [
            'build/*',
            'images/*',
            'favicon.ico',
            'robots.txt',
            'api/*',
            'webhook/*',
            'webhooks/*',
            'parcelas/*/pix',
            'up',
        ];

        foreach ($ignoredPatterns as $pattern) {
            if ($request->is($pattern)) {
                return false;
            }
        }

        return true;
    }
}
