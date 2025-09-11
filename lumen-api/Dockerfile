FROM php:8.2-fpm

# install build deps plus mysql client and redis extension
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git default-mysql-client \
  && pecl install redis \
  && docker-php-ext-enable redis \
  && docker-php-ext-install pdo pdo_mysql

# copy composer from official image (keep whatever you already had)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

RUN composer install --no-interaction --optimize-autoloader

# copy wait script already present
COPY wait-for-mysql.sh /wait-for-mysql.sh
RUN chmod +x /wait-for-mysql.sh

# start app only after wait script exits (adjust final command to whatever you used)
CMD ["/bin/sh", "-c", "/wait-for-mysql.sh mysql && php artisan migrate:fresh --seed && php -S 0.0.0.0:8000 -t public"]

