FROM php:8.3-fpm

# Instalar dependencias del sistema y PHP
RUN apt-get update && apt-get install -y \
    git unzip curl libpng-dev libonig-dev libxml2-dev libzip-dev libgmp-dev libicu-dev nginx \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip gmp intl \
    && rm -rf /var/lib/apt/lists/*



# Eliminar la configuración por defecto de Nginx
RUN rm -f /etc/nginx/sites-enabled/default \
    && rm -f /etc/nginx/conf.d/default.conf

# Instalar Composer
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

# Copiar configuración personalizada de Nginx (pisará la default)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Configuración de PHP-FPM para que escuche en localhost:9000
RUN sed -i 's/listen = .*/listen = 9000/' /usr/local/etc/php-fpm.d/www.conf

WORKDIR /var/www

# Copiar y preparar dependencias de Laravel
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Copiar todo el código del proyecto
COPY . .

# Permisos para Laravel
RUN chown -R www-data:www-data storage bootstrap/cache

# Exponer puerto HTTP
EXPOSE 80

# Instalar Node.js (LTS) y npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && node -v \
    && npm -v

# Instalar dependencias de frontend y compilar assets
WORKDIR /var/www
COPY package*.json ./
RUN npm install
COPY . .
RUN npm rebuild rollup --force
RUN npm run build

# Copiar script de inicio
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Permisos de Laravel
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Usar entrypoint como proceso principal
ENTRYPOINT ["/entrypoint.sh"]