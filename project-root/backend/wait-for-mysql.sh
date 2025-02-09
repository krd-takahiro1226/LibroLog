#!/bin/bash
set -e

host="$1"
shift

echo "Waiting for MySQL at $host..."

until mysqladmin ping -h "$host" --silent; do
  echo "Waiting for MySQL..."
  sleep 2
done

exec "$@"
