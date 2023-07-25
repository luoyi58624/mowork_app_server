FROM node:16.18.1
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN npm install pm2 -g
RUN npm install --production
EXPOSE 10008
CMD npm run prod