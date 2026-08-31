FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bullseye

RUN apt-get update \
    && apt-get install -y --no-install-recommends locales \
    && sed -i '/ja_JP.UTF-8/s/^# //g' /etc/locale.gen \
    && locale-gen \
    && update-locale LANG=ja_JP.UTF-8 LC_ALL=ja_JP.UTF-8 \
    && corepack enable \
    && corepack prepare pnpm@10.28.2 --activate \
    && rm -rf /var/lib/apt/lists/*

ENV LANG=ja_JP.UTF-8 \
    LC_ALL=ja_JP.UTF-8 \
    LANGUAGE=ja_JP:ja