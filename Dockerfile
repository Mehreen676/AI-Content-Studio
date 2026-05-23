FROM node:20-slim AS base
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# ---- Build Stage ----
FROM base AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY prisma ./prisma/
COPY . .

# Build the DB at build time, then build Next.js
ENV DATABASE_URL="file:///app/db/custom.db"
RUN mkdir -p /app/db && npx prisma generate && npx prisma db push --skip-generate
RUN npm run build

# ---- Runner Stage ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL="file:///data/db/custom.db"
ENV PORT=7860
ENV HOSTNAME="0.0.0.0"

# Copy standalone Next.js output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma files
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Copy the pre-built DB as a template
COPY --from=builder /app/db/custom.db /app/db/template.db

# Copy z-ai-web-dev-sdk module for AI features
COPY --from=builder /app/node_modules/z-ai-web-dev-sdk ./node_modules/z-ai-web-dev-sdk

# Startup script: copy template DB if no DB exists, then start server
RUN echo '#!/bin/sh\n\
mkdir -p /data/db\n\
if [ ! -f /data/db/custom.db ]; then\n\
  echo "Initializing database from template..."\n\
  cp /app/db/template.db /data/db/custom.db\n\
fi\n\
echo "Starting AI Content Studio on port 7860..."\n\
node server.js' > /app/start.sh && chmod +x /app/start.sh

EXPOSE 7860
CMD ["/app/start.sh"]
