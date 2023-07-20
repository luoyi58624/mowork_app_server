FROM node
COPY . .
RUN yarn
EXPOSE 80
