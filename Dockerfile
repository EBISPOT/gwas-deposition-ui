FROM nginx:latest

ADD build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]
