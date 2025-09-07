# ベースイメージをDebianベースのものに変更
FROM public.ecr.aws/docker/library/node:22-slim AS dependencies-env
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    procps \
    && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm
COPY . /app

# 開発用依存関係のインストール
FROM dependencies-env AS development-dependencies-env
COPY ./package.json pnpm-lock.yaml /app/
WORKDIR /app
RUN pnpm install --frozen-lockfile

# 本番用依存関係のインストール
FROM dependencies-env AS production-dependencies-env
COPY ./package.json pnpm-lock.yaml /app/
WORKDIR /app
RUN pnpm install --prod --frozen-lockfile

# ビルドステージ
FROM dependencies-env AS build-env
COPY ./package.json pnpm-lock.yaml /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN pnpm build

# 最終ステージ
FROM dependencies-env
COPY ./package.json pnpm-lock.yaml /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]
