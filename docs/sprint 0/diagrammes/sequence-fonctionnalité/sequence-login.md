# Diagramme de séquence — Connexion utilisateur

**Fonctionnalité :** US-02 — Se connecter
**Acteurs impliqués :** Utilisateur · Frontend (Next.js) · Rate Limiter · Backend (Express) · Base de données (PostgreSQL/Prisma)
**Outils de sécurité :** Zod · bcrypt · JWT · express-rate-limit

---

## Le diagramme

```mermaid
sequenceDiagram
    actor U as Utilisateur
    participant F as Frontend<br/>(Next.js)
    participant RL as Rate Limiter<br/>(express-rate-limit)
    participant B as Backend API<br/>(Express)
    participant DB as Base de données<br/>(PostgreSQL / Prisma)

    U->>F: Remplit email + mot de passe
    U->>F: Clique sur "Se connecter"

    Note over F: Validation côté client (Zod)<br/>─────────────────────<br/>✓ Format email valide<br/>✓ Min. 8 caractères<br/>✓ 1 majuscule minimum<br/>✓ 1 chiffre minimum<br/>✓ 1 caractère spécial (!@#$...)

    alt Critères non respectés
        F-->>U: Affiche les critères non respectés<br/>(indicateur visuel par règle)
    else Formulaire valide
        F->>RL: POST /api/auth/login<br/>{ email, password }

        Note over RL: Vérifie le compteur de tentatives<br/>par IP + par email<br/>─────────────────────<br/>Fenêtre : 5 essais / 15 minutes

        alt Limite atteinte (429)
            RL-->>F: 429 Too Many Requests<br/>Retry-After: 900 secondes
            F-->>U: "Trop de tentatives.<br/>Réessayez dans 15 min."
        else Sous la limite
            RL->>B: Transmet la requête<br/>+ incrémente le compteur

            Note over B: Validation côté serveur (Zod)<br/>2e ligne de défense<br/>─────────────────────<br/>Mêmes critères que côté client

            alt Données invalides
                B-->>F: 400 Bad Request
                F-->>U: Affiche l'erreur
            else Données valides
                B->>DB: SELECT * FROM users<br/>WHERE email = ?

                alt Utilisateur introuvable
                    DB-->>B: null
                    B-->>F: 401 Unauthorized<br/>"Identifiants incorrects"
                    F-->>U: Affiche l'erreur
                else Utilisateur trouvé
                    DB-->>B: { id, email, hashedPassword, ... }

                    Note over B: bcrypt.compare(<br/>  password,<br/>  hashedPassword<br/>)

                    alt Mot de passe incorrect
                        Note over RL: Compteur incrémenté<br/>pour cet email
                        B-->>F: 401 Unauthorized<br/>"Identifiants incorrects"
                        F-->>U: Affiche l'erreur
                    else Mot de passe correct
                        Note over RL: Compteur remis à zéro<br/>pour cet email
                        Note over B: jwt.sign(<br/>  { userId, email },<br/>  SECRET,<br/>  { expiresIn: "24h" }<br/>)
                        B-->>F: 200 OK<br/>{ token: "eyJhbGci..." }

                        Note over F: Stocke le JWT<br/>(localStorage ou cookie)

                        F-->>U: Redirection vers /library
                    end
                end
            end
        end
    end
```

---

## Explication pas à pas

### Les acteurs (les colonnes)

Chaque colonne verticale avec une ligne pointillée vers le bas s'appelle une **lifeline** (ligne de vie).

| Acteur | Rôle |
|--------|------|
| **Utilisateur** | La vraie personne devant l'écran |
| **Frontend (Next.js)** | Le code React qui s'exécute dans le navigateur |
| **Rate Limiter** | Un middleware Express qui surveille le nombre de tentatives |
| **Backend API (Express)** | Le serveur Node.js qui traite la logique métier |
| **Base de données (PostgreSQL/Prisma)** | Là où les données sont stockées en permanence |

---

### Les flèches

- `A ->> B` : flèche pleine → **requête / action** (A envoie quelque chose à B)
- `A -->> B` : flèche pointillée → **réponse** (B répond à A)

Le temps s'écoule **de haut en bas**.

---