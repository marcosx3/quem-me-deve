#!/bin/sh
set -e

if [ ! -f .env ]; then
    cp .env.example .env
fi

echo "Aguardando o banco de dados..."
until php -r "new PDO('pgsql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_DATABASE', '$DB_USERNAME', '$DB_PASSWORD');" 2>/dev/null; do
    sleep 2
done

php artisan migrate --force
php artisan db:seed --force
exec "$@"
