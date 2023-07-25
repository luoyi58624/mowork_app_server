FROM node
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN yarn
EXPOSE 80
CMD ["pm2-docker","start","pm2.json"]
