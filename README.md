# Z-0 - Optician Pro

<a href="https://z0-optician.vercel.app" target="_blank">
  <img src="https://img.shields.io/badge/Live%20Demo-Click%20Here-blue" alt="Live Demo">
</a>

Système de gestion complet pour opticiens - Devis, Factures, Stock, Clients et Ordonnances.

## ✨ Fonctionnalités

### 📊 Tableau de bord
- Statistiques en temps réel (chiffre d'affaires, clients, stock)
- Alertes stock faible
- Factures en retard
- Actions rapides
- Graphique historique des ventes

### 👥 Gestion des Clients
- Fiches clients complètes
- Historique des achats
- Informations d'assurance
- Recherche avancée

### 📦 Gestion des Produits
- Catalogue avec SKU
- Suivi de stock intelligent
- Seuils de réapprovisionnement
- Historique des mouvements
- Opérations: Ajouter, Modifier, Dupliquer, Supprimer

### 📝 Devis
- Création de devis professionnels
- Numérotation automatique (QT-2025-XXXX)
- Envoi par email
- Conversion en facture

### 💳 Factures
- Facturation complète avec TVA
- Suivi des paiements
- Paiements partiels supportés
- Alertes de retard
- Numérotation automatique (INV-2025-XXXX)

### 👓 Ordonnances
- Stockage des prescriptions optiques
- Mesures détaillées (SPH, CYL, AXIS, ADD, PD)
- Alertes d'expiration
- Historique par client

### 👤 Gestion Utilisateurs
- Inscription avec approbation admin
- Rôles: User, Manager
- Statuts: Pending, Active, Rejected, Suspended
- Tableau de bord admin

### 🌍 Internationalisation
- **Langue par défaut**: Français
- **Langue secondaire**: Anglais
- Support i18n complet

## 🛠 Stack Technique

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **PostgreSQL** + **Prisma ORM**
- **JWT** Authentication

### Frontend
- **Next.js 16** + **TypeScript**
- **React 19**
- **Redux Toolkit** + **RTK Query**
- **Tailwind CSS** + **Shadcn/UI** (New York style)
- **TanStack Table**
- **next-i18next**

---

## 🚀 Installation Locale

### Prérequis
- Node.js 18+
- PostgreSQL 14+

### Étapes

```bash
# 1. Cloner le projet
git clone https://github.com/your-repo/z0-optician.git
cd z0-optician

# 2. Configuration PostgreSQL
# Créer la base de données
createdb z0_db

# 3. Configuration Backend
cd server
cp .env.example .env
# Éditer .env avec vos paramètres

# 4. Installation et setup
npm install
npx prisma generate
npx prisma migrate dev --name init

# 5. Démarrer le serveur backend
npm run dev
# Server: http://localhost:8080

# 6. Configuration Frontend (nouveau terminal)
cd ../client
cp .env.example .env.local
npm install
npm run dev
# App: http://localhost:3000
```

### Variables d'environnement

**server/.env**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/z0_db?schema=public"
JWT_SECRET="your-super-secret-key-min-32-chars"
CLIENT_URL="http://localhost:3000"
NODE_ENV=development
PORT=8080
```

**client/.env.local**
```env
NEXT_PUBLIC_API_URL="http://localhost:8080/api"
```

---

## ☁️ Déploiement Cloud

### Option 1: Coolify ( Recommandé )

Coolify est une plateforme open-source d'auto-hébergement.

#### Déploiement en 5 minutes:

1. **Créer un projet Coolify**
   - Se connecter à votre instance Coolify
   - Créer un nouveau projet
   - Ajouter une nouvelle ressource "Git Repository"

2. **Configurer le Repository**
   ```
   Repository: your-github-repo/z0-optician
   Branch: main
   ```

3. **Configuration Backend**
   ```env
   # Variables pour le service "server"
   DATABASE_URL=postgresql://coolify:password@10.0.0.1:5432/z0_db
   JWT_SECRET=generate-a-strong-random-secret
   CLIENT_URL=https://your-coolify-domain.com
   NODE_ENV=production
   PORT=8080
   ```

4. **Configuration Frontend**
   ```env
   # Variables pour le service "client"
   NEXT_PUBLIC_API_URL=https://your-coolify-domain.com/api
   ```

5. **Build & Start**
   - Backend: `npm run build && npm run start`
   - Frontend: `npm run build && npm run start`

#### Avec Docker Compose (Coolify)

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: z0_db
      POSTGRES_USER: z0_user
      POSTGRES_PASSWORD: strong_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U z0_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  server:
    build: ./server
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: postgresql://z0_user:strong_password@postgres:5432/z0_db
      JWT_SECRET: your-secret-key
      CLIENT_URL: http://localhost:3000
      NODE_ENV: production
    depends_on:
      postgres:
        condition: service_healthy

  client:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8080/api
    depends_on:
      - server

volumes:
  postgres_data:
```

---

### Option 2: Railway

Railway offre un déploiement simplifié avec PostgreSQL intégré.

#### Déploiement:

1. **Créer un compte Railway**
   - Se connecter sur railway.app
   - Créer un nouveau projet

2. **Ajouter PostgreSQL**
   - Cliquer sur "New" → "Database" → "PostgreSQL"
   - Noter les variables générées

3. **Déployer le Backend**
   - "New" → "GitHub Repository"
   - Sélectionner le projet
   - Configurer:
     ```env
     DATABASE_URL: ${POSTGRES_URL}
     JWT_SECRET: generate-random-secret
     CLIENT_URL: https://your-app.up.railway.app
     NODE_ENV: production
     PORT: 8080
     ```

4. **Déployer le Frontend**
   - "New" → "GitHub Repository"
   - Sélectionner le projet (ou un sous-module)
   - Configurer:
     ```env
     NEXT_PUBLIC_API_URL: https://your-backend.up.railway.app/api
     ```
   - Build Command: `npm run build`
   - Start Command: `npm run start`

5. **Variables Railway自动**
   Railway injecte automatiquement `DATABASE_URL` depuis PostgreSQL

#### Alternative: Monorepo Railway

Pour un déploiement monorepo:
```javascript
// railway.json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd server && npm install && npm run build"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

### Option 3: Render

#### Backend
1. Créer un service "Web Service"
2. Connecter le repo
3. Configuration:
   - Build Command: `cd server && npm install && npm run build`
   - Start Command: `cd server && npm run start`
4. Variables:
   ```env
   DATABASE_URL=postgresql://user:pass@host:5432/z0_db
   JWT_SECRET=secret
   CLIENT_URL=https://your-render-app.onrender.com
   ```

#### Frontend
1. Créer un service "Static Site"
2. Configuration:
   - Build Command: `cd client && npm install && npm run build`
   - Publish directory: `client/.next`
3. Variables:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
   ```

---

### Option 4: VPS (DigitalOcean, Linode, Hetzner)

#### Script de déploiement automatique:

```bash
#!/bin/bash
# deploy.sh

# Mise à jour
apt update && apt upgrade -y

# Installation Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Installation PostgreSQL
apt install -y postgresql postgresql-contrib

# Configuration PostgreSQL
sudo -u postgres psql -c "CREATE USER z0_user WITH PASSWORD 'password';"
sudo -u postgres psql -c "CREATE DATABASE z0_db OWNER z0_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE z0_db TO z0_user;"

# Clone du projet
cd /var/www
git clone https://github.com/your-repo/z0-optician.git
cd z0-optician

# Backend
cd server
cp .env.example .env
nano .env  # Configurer les variables
npm install
npm run build

# Frontend
cd ../client
cp .env.example .env.local
nano .env.local
npm install
npm run build

# Configuration Nginx
cat > /etc/nginx/sites-available/z0 << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
EOF

ln -s /etc/nginx/sites-available/z0 /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# PM2 pour garder les services actifs
npm install -g pm2
cd /var/www/z0-optician/server
pm2 start npm --name "z0-server" -- run start
cd /var/www/z0-optician/client
pm2 start npm --name "z0-client" -- run start
pm2 save
```

---

### Option 5: Docker (Coolify/Portainer)

```dockerfile
# server/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "start"]
```

```dockerfile
# client/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_PUBLIC_API_URL=/api
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## 🔧 Configuration Production

### Variables obligatoires

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | Connection PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Clé secrète JWT (32+ chars) | `your-secret-key` |
| `CLIENT_URL` | URL du frontend | `https://z0.yourdomain.com` |
| `NODE_ENV` | Environment | `production` |
| `PORT` | Port du serveur | `8080` |
| `NEXT_PUBLIC_API_URL` | URL API pour le frontend | `https://api.yourdomain.com` |

### Checklist Déploiement

- [ ] Base de données PostgreSQL créée
- [ ] Variables d'environnement configurées
- [ ] Migrations Prisma exécutées
- [ ] Build réussi (server + client)
- [ ] Domain configuré
- [ ] SSL/HTTPS activé (Let's Encrypt)
- [ ] Health check fonctionnel (`/api/health`)
- [ ] Logs configurés

---

## 📁 Structure du Projet

```
z0-optician/
├── server/                 # Backend API
│   ├── prisma/
│   │   └── schema.prisma  # Schéma BDD
│   ├── src/
│   │   ├── modules/      # Routes API
│   │   ├── lib/         # Utilitaires
│   │   └── index.ts     # Point d'entrée
│   └── package.json
│
├── client/                # Frontend Next.js
│   ├── src/
│   │   ├── pages/       # Pages
│   │   ├── components/  # Composants
│   │   ├── redux/      # State management
│   │   └── styles/      # CSS
│   ├── public/
│   │   └── locales/    # Traductions (fr/en)
│   └── package.json
│
├── docs/                  # Documentation
└── docker-compose.yml    # Docker config
```

---

## 🧪 Testing

```bash
# Tous les tests
make test

# Backend uniquement
cd server && npm test

# Frontend uniquement  
cd client && npm test
```

---

## 📄 License

MIT License - voir [LICENSE](LICENSE)

---

## 🆘 Support

- Issues GitHub
- Documentation dans `/docs`

---

**Développé avec ❤️ pour les opticiens - Z-0**
