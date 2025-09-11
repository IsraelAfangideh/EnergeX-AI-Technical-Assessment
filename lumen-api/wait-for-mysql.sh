#!/bin/sh
set -eu

# first arg = host, rest = command to run after DB is ready
HOST="${1:-mysql}"
shift || true
PORT="${DB_PORT:-3306}"
USER="${DB_USERNAME:-root}"
PASS="${DB_PASSWORD:-}"
DB="${DB_DATABASE:-}"

echo "Waiting for MySQL at ${HOST}:${PORT} (user=${USER}) ..."

try_php_pdo() {
  php -r "try {
    \$opts = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION];
    \$dsn = 'mysql:host=${HOST};port=${PORT}';
    if ('${DB}' !== '') { \$dsn .= ';dbname=${DB}'; }
    new PDO(\$dsn, '${USER}', '${PASS}', \$opts);
    exit(0);
  } catch (PDOException \$e) {
    fwrite(STDERR, \$e->getMessage().\"\\n\");
    exit(1);
  }"
  return $?
}

until try_php_pdo; do
  echo "Waiting for MySQL at ${HOST}:${PORT}..."
  sleep 2
done

echo "MySQL appears up at ${HOST}:${PORT} — starting: $*"
exec "$@"
