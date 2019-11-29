FROM nginx:latest

RUN mkdir /usr/share/nginx/html/gwas
RUN mkdir /usr/share/nginx/html/gwas/deposition

ADD build /usr/share/nginx/html/gwas/deposition

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]
