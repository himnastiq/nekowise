# ============================================
# Nekowise Client — Multi-stage Dockerfile
# ============================================
# Targets:
#   dev        → Vite dev server with HMR
#   production → Nginx serving static SPA (default)
# ============================================

# ── Dependencies ──────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# ── Development ───────────────────────────────
# Used by: docker compose -f docker-compose.yml -f docker-compose.dev.yml up
FROM deps AS dev
COPY . .
EXPOSE 5173
CMD ["npx", "vite", "--host", "0.0.0.0"]

# ── Build ─────────────────────────────────────
FROM deps AS build
COPY . .

# Build-time env vars — baked into the JS bundle
ARG VITE_API_URL=/api
ARG VITE_WS_URL=
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL

RUN npm run build

# ── Production (Nginx) ───────────────────────
FROM nginx:1.27-alpine AS production

# Copy the built SPA files
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config for SPA routing + API reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
