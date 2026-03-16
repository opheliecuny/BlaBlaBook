# Utilisation de docker compose

## Version 1.0 : db et adminer

### Lancement de la BDD

Lorsque vous avez récupéré le dépôt mis à jour :

- s'assurer d'avoir un .env dans blablabook/ en suivant le modèle
  
```bash
docker compose up -d
cd backend
npm i
npm run db:migrate:deploy
```

### Connexion de l'API à la BDD du container

- s'assurer d'avoir un .env dans backend/ (attention à faire coincider les infos de l'url postgres avec celles fournies précédemment dans le .env de blablabook/)

### Checker si tout est ok

Il suffira de se connecter via son navigateur à localhost:8000 et se connecter à adminer. Si tout va bien vous devriez voir les tables affichées !
