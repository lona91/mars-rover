FROM node:alpine

WORKDIR /opt/rover

COPY . .

RUN npm install
RUN npm build

EXPOSE 3000
EXPOSE 8000

ENTRYPOINT [ "npm", "start" ]