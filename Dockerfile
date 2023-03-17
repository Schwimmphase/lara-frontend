# Build using npm
FROM node:alpine as build
COPY . ./
RUN npm install
RUN npm run build

# Run nginx
FROM nginx as run
COPY --from=build dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf