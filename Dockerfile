# Use official Node.js image as base
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json yarn.lock* package-lock.json* ./
COPY prisma ./prisma/  
RUN npm ci
# Run prisma generate, skip if schema.prisma is missing
RUN if [ -f prisma/schema.prisma ]; then npx prisma generate; else echo "No schema.prisma found, skipping prisma generate"; fi

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]