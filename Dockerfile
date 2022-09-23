FROM node:18-slim as dev
RUN npm install --global typescript
WORKDIR /var/ts

FROM dev as builder
WORKDIR /var/ts
COPY . /var/ts/
RUN npm set-script prepare "" 
RUN npm ci --omit=dev
RUN npm run build

FROM --platform=linux/amd64 node:18-slim
COPY --from=builder /var/ts/node_modules /var/criptup/node_modules
COPY --from=builder /var/ts/build /var/criptup
WORKDIR /var/criptup
#CMD ["node","server.js"]