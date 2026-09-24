# ============================================
# Nekowise Server — Multi-stage Dockerfile
# ============================================
# Targets:
#   dev        → Development with nodemon hot-reload
#   production → Lean production image (default)
# ============================================

# ── Base ──────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

# ── Development ───────────────────────────────
# Used by: docker compose -f docker-compose.yml -f docker-compose.dev.yml up
FROM base AS dev
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["npx", "nodemon", "src/server.js"]

# ── Production dependencies ──────────────────
FROM base AS deps
RUN npm ci --omit=dev

# ── Production ────────────────────────────────
FROM node:20-alpine AS production

# dumb-init: lightweight init system for proper SIGTERM/SIGINT handling
RUN apk add --no-cache dumb-init

ENV NODE_ENV=production
WORKDIR /app

# Copy only production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Security: run as non-root user
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["dumb-init", "node", "src/server.js"]
