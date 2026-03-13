# Stage 1: Dependencies
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# You'll need to set these during build or in docker-compose
ARG NEXT_PUBLIC_BOT_API_URL
ARG NEXT_PUBLIC_BOT_WS_URL
ENV NEXT_PUBLIC_BOT_API_URL=$NEXT_PUBLIC_BOT_API_URL
ENV NEXT_PUBLIC_BOT_WS_URL=$NEXT_PUBLIC_BOT_WS_URL

RUN npm run build

# Stage 3: Runner
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
