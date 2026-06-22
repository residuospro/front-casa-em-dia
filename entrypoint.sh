#!/bin/sh
sed "s|__BACKEND_URL__|${API_URL}|g" /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
nginx -g 'daemon off;'
