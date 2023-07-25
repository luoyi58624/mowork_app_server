FROM keymetrics/pm2:latest-alpine
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN npm install --production
EXPOSE 10008
CMD [ "pm2-runtime", "start", "pm2.json" ]