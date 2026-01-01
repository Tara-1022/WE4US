# Cert Renewal (When https -> http)
1. sudo docker compose down nginx
2. sudo certbot renew
3. sudo docker compose up nginx
