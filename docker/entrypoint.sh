#!/bin/sh
set -e

if [ ! -f .env ]; then
    cp .env.example .env
fi

if [ -z "$APP_KEY" ] && ! grep -q "^APP_KEY=base64:" .env 2>/dev/null; then
    php artisan key:generate --force
fi

echo "Aguardando o banco de dados..."
until php -r "new PDO('pgsql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_DATABASE', '$DB_USERNAME', '$DB_PASSWORD');" 2>/dev/null; do
    sleep 2
done

php artisan migrate --force
php artisan db:seed --force
exec "$@"
