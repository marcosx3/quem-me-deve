#!/bin/sh
set -e

# Essas variáveis vêm setadas como env var real do container (docker-compose.yml, pra a app de
# dev funcionar). Isso "vaza" pro processo do PHP via $_SERVER, e nem o force="true" do
# phpunit.xml sobrescreve $_SERVER (só getenv()/$_ENV) — então sem esse unset os testes rodam com
# APP_ENV=local (não "testing", então o bypass de CSRF do VerifyCsrfToken nunca ativa) e/ou contra
# o Postgres de desenvolvimento de verdade em vez do sqlite em memória (RefreshDatabase chega a
# apagar os dados reais — já aconteceu uma vez).
unset APP_ENV APP_DEBUG APP_URL LOG_CHANNEL \
    DB_CONNECTION DB_HOST DB_PORT DB_DATABASE DB_USERNAME DB_PASSWORD \
    SESSION_DRIVER CACHE_STORE QUEUE_CONNECTION

exec php artisan test "$@"
