# ---- Base stage (common) ----
FROM node:24-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

# ---- Dependencies stage: production dependencies only ----
FROM base AS deps
RUN npm ci --omit=dev --ignore-scripts

# ---- Builder stage: compiles TypeScript from src/ to dist/ ----
FROM base AS builder
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Production stage ----
FROM node:24-alpine AS production
WORKDIR /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./
COPY --chown=node:node public ./public

USER node
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/server.js"]
