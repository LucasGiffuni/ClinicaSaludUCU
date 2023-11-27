FROM nginx:latest
EXPOSE 80

ADD ./Frontend /usr/share/nginx/html/
