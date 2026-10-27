# Pin to a patched Node 22.x for the Oct 2026 TLS / eMudhra advisory
FROM node:22.23.4-alpine AS build
WORKDIR /app
RUN apk upgrade --no-cache ca-certificates
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22.23.4-alpine
WORKDIR /app
RUN apk upgrade --no-cache ca-certificates
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 4000
CMD ["sh", "-c", "npm run seed && node dist/main.js"]