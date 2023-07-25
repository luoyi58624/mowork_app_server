FROM node
RUN mkdir -p /node_server
WORKDIR /node_server
COPY . /node_server
EXPOSE 80
CMD ["node", "index.js"]
