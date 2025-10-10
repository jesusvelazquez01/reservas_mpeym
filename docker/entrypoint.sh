#!/bin/sh
set -e

# Esperar un poco a que la DB esté lista (opcional)
# sleep 5

echo "🔧 Ejecutando migraciones y seeders de Laravel..."
php artisan migrate --force || true
php artisan db:seed --force || true
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "🚀 Iniciando PHP-FPM y Nginx..."
service nginx start
php-fpm
