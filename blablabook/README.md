# Utilisation de Docker Compose
## Version 2.0 : db, adminer, api, frontend

### Prérequis
- Docker et Docker Compose installés
- Un fichier `.env` à la racine de `blablabook/` en suivant le modèle ci-dessous

### Modèle de .env
```env
# ─── Base de données ───────────────────────────────
POSTGRES_USER=XXXXXX
POSTGRES_PASSWORD=XXXXXX
POSTGRES_DB=XXXXXX
POSTGRES_PORT=XXXX

# ─── API (Express + Prisma) ────────────────────────
PORT=XXXX
ALLOWED_ORIGINS="*"
DATABASE_URL=postgresql://username:password@db:port/dbname?schema=public

# ─── Frontend (Next.js) ────────────────────────────
FRONTEND_PORT=XXXX
```

> ⚠️ Ne pas modifier `@db:5432` dans la `DATABASE_URL` : `db` est le nom du service PostgreSQL dans Docker, et `5432` est son port interne.

---

### Lancement

Tout se fait via le script `init.sh` depuis la racine du projet :

```bash
bash init.sh
```

Ce script va automatiquement :
1. Arrêter et supprimer les conteneurs existants
2. Démarrer tous les services (db, adminer, api, frontend)
3. Attendre que l'API soit prête
4. Lancer le reset de la BDD et le seeding

---

### Services disponibles

| Service  | URL                   | Description                  |
|----------|-----------------------|------------------------------|
| Frontend | http://localhost:3000 | Application Next.js          |
| API      | http://localhost:3001 | API Express                  |
| Adminer  | http://localhost:8000 | Interface d'admin PostgreSQL |

---

### Vérifier que tout fonctionne

Connectez-vous à [Adminer](http://localhost:8000) avec les identifiants de votre `.env`. Si les tables sont visibles et peuplées, tout est bon !

Pour suivre les logs en temps réel :

```bash
docker compose logs -f          # tous les services
docker compose logs -f api      # API uniquement
docker compose logs -f frontend # Frontend uniquement
```

---

### Commandes utiles

```bash
# Arrêter les conteneurs sans supprimer les volumes
docker compose stop

# Arrêter et supprimer les conteneurs
docker compose down

# Relancer proprement (reset BDD + seeding inclus)
bash init.sh
```