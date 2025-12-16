# === builder: 依存関係生成用 ===
FROM public.ecr.aws/docker/library/node:22-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    procps \
    && rm -rf /var/lib/apt/lists/*
# pnpmはcorepackで有効化。ただしNode.js25以降では廃止の可能性もあるため注意
RUN corepack enable && corepack prepare pnpm@10.12.4 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# === prod-deps: 本番用依存関係のみ抽出 ===
FROM public.ecr.aws/docker/library/node:22-slim AS prod-deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.12.4 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# === runner: 最終イメージ===
FROM public.ecr.aws/docker/library/node:22-slim AS runner
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app
COPY --chown=node:node package.json pnpm-lock.yaml /app/
COPY --from=prod-deps --chown=node:node /app/node_modules /app/node_modules
COPY --from=builder  --chown=node:node /app/build        /app/build

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8080/healthcheck').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

USER node
CMD ["npm", "run", "start"]
