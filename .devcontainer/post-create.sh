#!/usr/bin/env bash
set -euo pipefail

lockfile="pnpm-lock.yaml"
manifest="package.json"
stamp_file=".devcontainer/.pnpm-lock.sha256"

for path in node_modules dist .pnpm-store; do
  mkdir -p "$path"
  sudo chown "$(id -u):$(id -g)" "$path"
done

if [[ ! -f "$lockfile" || ! -f "$manifest" ]]; then
  exit 0
fi

current_hash="$(sha256sum "$manifest" "$lockfile" | sha256sum | awk '{ print $1 }')"
saved_hash=""

if [[ -f "$stamp_file" ]]; then
  saved_hash="$(cat "$stamp_file")"
fi

if [[ ! -f node_modules/.modules.yaml || "$current_hash" != "$saved_hash" ]]; then
  pnpm install --frozen-lockfile
  printf '%s\n' "$current_hash" > "$stamp_file"
fi