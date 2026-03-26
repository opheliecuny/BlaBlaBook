#!/bin/bash
set -e

# ─── 0. Vérification du répertoire courant ─────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ─── 1. Vérification que Docker est lancé ──────────
if ! docker info > /dev/null 2>&1; then
  echo "🐳  Docker n'est pas lancé. Tentative de démarrage..."

  # WSL2 (Windows) — détection via /proc/version
  if grep -qiE "microsoft|wsl" /proc/version 2>/dev/null; then
    DOCKER_DESKTOP="/mnt/c/Program Files/Docker/Docker/Docker Desktop.exe"
    if [ -f "$DOCKER_DESKTOP" ]; then
      echo "🪟  WSL2 détecté — démarrage de Docker Desktop..."
      "$DOCKER_DESKTOP" &
    else
      echo "❌  Docker Desktop introuvable dans Program Files."
      echo "    Veuillez le démarrer manuellement depuis Windows."
      exit 1
    fi

  # Linux natif (systemd)
  elif command -v systemctl > /dev/null 2>&1; then
    sudo systemctl start docker

  # macOS (Docker Desktop)
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    open -a Docker

  else
    echo "❌  Système non reconnu. Veuillez démarrer Docker manuellement."
    exit 1
  fi

  # Attente commune (tous OS)
  echo "⏳  Attente du démarrage de Docker..."
  MAX_DOCKER_WAIT=60
  ELAPSED=0
  until docker info > /dev/null 2>&1; do
    sleep 2
    ELAPSED=$((ELAPSED + 2))
    if [ $ELAPSED -ge $MAX_DOCKER_WAIT ]; then
      echo "❌  Timeout : Docker n'a pas démarré en ${MAX_DOCKER_WAIT}s."
      exit 1
    fi
  done
  echo "✅  Docker est prêt."
fi

# ─── 2. Arrêt et suppression des conteneurs ────────
if [ "$(docker compose ps -q)" ]; then
  echo "🛑  Arrêt des conteneurs en cours..."
  docker compose down
fi

# ─── 3. Suppression du volume pg-data local ────────
if [ -d "./pg-data" ]; then
  echo "🗑️   Suppression du répertoire pg-data..."
  rm -rf ./pg-data 2>/dev/null || sudo rm -rf ./pg-data
fi

# ─── 4. Démarrage des conteneurs ───────────────────
echo "🚀  Démarrage des conteneurs..."
docker compose up -d

# ─── 5. Attente que l'API soit prête ───────────────
echo "⏳  Attente que l'API soit prête..."
MAX_WAIT=60
ELAPSED=0
until curl -s --max-time 2 http://localhost:${PORT:-3001} > /dev/null 2>&1; do
  sleep 2
  ELAPSED=$((ELAPSED + 2))
  if [ $ELAPSED -ge $MAX_WAIT ]; then
    echo "❌  Timeout : l'API n'a pas démarré en ${MAX_WAIT}s."
    docker compose logs api
    exit 1
  fi
done

# ─── 6. Reset BDD + Seeding dans le container api ──
echo "🌱  Reset de la BDD et seeding..."
docker compose exec api npm run db:reset

echo "✅  Tout est prêt !"
echo "   → API       : http://localhost:${PORT:-3001}"
echo "   → Frontend  : http://localhost:${FRONTEND_PORT:-3000}"
echo "   → Adminer   : http://localhost:8000"
