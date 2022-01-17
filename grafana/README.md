# Docker Compose directory for Bitburner

Based off oatmealine's https://github.com/oatmealine/bitburner-grafana data proxy to get around ns.wget's get-only lifestyle.

Simply run:
```
docker-compose up -d
```

Note that you will have to start bb-api a second time after the FIRST run as it doesn't gracefully wait for postgres to be ready on provision time.

```
docker-compose up bb-api
```