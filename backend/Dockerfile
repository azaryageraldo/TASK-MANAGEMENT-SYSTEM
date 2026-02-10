FROM php:8.4-cli

RUN apt-get update -y && apt-get install -y \
    libmcrypt-dev \
    openssl \
    unzip \
    git \
    curl \
    libonig-dev \
    libxml2-dev \
    zip \
    && docker-php-ext-install pdo pdo_mysql mbstring xml

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /app
COPY . .

RUN composer install --no-interaction

CMD php artisan serve --host=0.0.0.0 --port=8000
