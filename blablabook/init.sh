#!/bin/bash
set -e

# ─── 1. Arrêt et suppression des conteneurs ────────
if [ "$(docker compose ps -q)" ]; then
  echo "🛑  Arrêt des conteneurs en cours..."
  docker compose down
fi

# ─── 2. Suppression du volume pg-data local (si présent) ───
if [ -d "./pg-data" ]; then
  echo "🗑️   Suppression du répertoire pg-data..."
  sudo rm -rf ./pg-data
fi

# ─── 3. Démarrage des conteneurs ───────────────────
echo "🚀  Démarrage des conteneurs..."
docker compose up -d

# ─── 4. Attente que l'API soit prête ───────────────
echo "⏳  Attente que l'API soit prête..."
until [ "$(docker compose ps -q api | xargs docker inspect -f '{{.State.Running}}')" = "true" ]; do
  sleep 1
done

# ─── 5. Reset BDD + Seeding dans le container api ──
echo "🌱  Reset de la BDD et seeding..."
docker compose exec api npm run db:reset

echo "✅  Tout est prêt !"
echo "   → API       : http://localhost:${PORT:-3001}"
echo "   → Frontend  : http://localhost:${FRONTEND_PORT:-3000}"
echo "   → Adminer   : http://localhost:8000"