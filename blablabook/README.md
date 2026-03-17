# Utilisation de docker compose

## Version 1.0 : db et adminer

### Lancement de la BDD

Lorsque vous avez récupéré le dépôt mis à jour :

- s'assurer d'avoir un .env dans blablabook/ en suivant le modèle
  
```bash
docker compose up -d

# Important pour pouvoir lancer les scripts de package.json
cd backend

# Optionnel : dans le cas où les packages ne seraient pas déjà installés
npm i

# Synchronise les migrations prisma avec la BDD du container
npm run db:migrate:deploy

# Effectue le seeding dans la BDD
npm run db:seed
```

### Connexion de l'API à la BDD du container

- s'assurer d'avoir un .env dans backend/ (attention à faire coincider les infos de l'url postgres avec celles fournies précédemment dans le .env de blablabook/)

### Checker si tout est ok

Il suffira de se connecter via son navigateur à localhost:8000 et se connecter à adminer. Si tout va bien vous devriez voir les tables affichées !
