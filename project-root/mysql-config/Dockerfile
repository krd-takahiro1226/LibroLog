FROM mysql:8

ENV TZ "Asia/Tokyo"

RUN microdnf update -y \
    && microdnf install -y glibc-locale-source \
    && localedef -i ja_JP -c -f UTF-8 -A /usr/share/locale/locale.alias ja_JP.UTF-8

ENV LANG ja_JP.UTF-8
ENV LC_ALL ja_JP.UTF-8

COPY conf.d /etc/mysql/conf.d
COPY init.d /docker-entrypoint-initdb.d

CMD ["mysqld"]
