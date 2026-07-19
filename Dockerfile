# --- frontend assets ---
FROM node:22-alpine AS frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY resources resources
COPY vite.config.js tsconfig.json components.json ./
RUN npm run build

# --- php application ---
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-scripts --no-progress --prefer-dist --optimize-autoloader

FROM php:8.4-cli-alpine

RUN apk add --no-cache postgresql-dev \
    && docker-php-ext-install pdo_pgsql bcmath \
    && echo "variables_order = EGPCS" > /usr/local/etc/php/conf.d/variables-order.ini

WORKDIR /var/www/html

COPY . .
COPY --from=vendor /app/vendor ./vendor
COPY --from=frontend /app/public/build ./public/build

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh docker/run-tests.sh \
    && mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache

EXPOSE 8000

ENTRYPOINT ["entrypoint.sh"]
CMD ["sh", "-c", "cd public && exec php -S 0.0.0.0:8000 ../vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php"]
