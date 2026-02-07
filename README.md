# Optician Pro - MVP

<a href="https://optician-pro-demo.vercel.app" target="_blank">
  <img src="https://img.shields.io/badge/Live%20Demo-Click%20Here-blue" alt="Live Demo">
</a>

Système de gestion complet pour opticiens - Devis, Factures, Stock, Clients et Ordonnances.

## ✨ Fonctionnalités MVP

### 📊 Tableau de bord
- Statistiques en temps réel (chiffre d'affaires, clients, stock)
- Alertes stock faible
- Factures en retard
- Actions rapides

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

### 📈 Rapports
- Rapport des ventes
- Performance des produits
- Analyse du stock
- Tableau de bord financier

## 🌍 Internationalisation

**Langue par défaut**: Français  
**Langue secondaire**: Anglais

Support i18n complet avec next-i18next. Facilement extensible pour ajouter d'autres langues.

## 🛠 Stack Technique

### Backend
- **Node.js** + **Express**
- **TypeScript** 5.7
- **PostgreSQL** + **Prisma ORM** 6.x
- **JWT** Authentication
- **Resend** Email API
- **Jest** + **Supertest** for testing

### Frontend
- **Next.js 15** + **TypeScript**
- **React 19**
- **Redux Toolkit** + **RTK Query**
- **Tailwind CSS** + **Shadcn/UI**
- **TanStack Table**
- **next-i18next**
- **Vitest** + **Playwright** for testing

### Documentation
- **Docusaurus** 3.x
- Full API documentation
- User guides
- Deployment guides

### DevOps
- **GitHub Actions** CI/CD
- Automated testing
- Code coverage reporting
- Automated documentation deployment

## 🚀 Installation Rapide

### Prérequis
- Node.js 18+
- PostgreSQL 14+

### 1. Cloner le projet

```bash
git clone <repository-url>
cd eyeglasse-shop
```

### Quick Start avec Make

Si vous avez Make installé, utilisez les commandes simplifiées :

```bash
# Installation complète
make install

# Démarrer tous les serveurs
make dev

# Exécuter tous les tests
make test

# Voir toutes les commandes disponibles
make help
```

### 2. Configuration de la base de données

```bash
# Créer la base de données PostgreSQL
createdb optician_db

# Copier et configurer les variables d'environnement
cp server/.env.example server/.env
# Éditer server/.env avec vos paramètres PostgreSQL
```

### 3. Installation Backend

```bash
cd server
npm install

# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma migrate dev --name init

# (Optionnel) Créer des données de démonstration
npx prisma db seed

# Démarrer le serveur
npm run dev
```

Le serveur démarre sur http://localhost:8080

### 4. Installation Frontend

```bash
cd client
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application démarre sur http://localhost:3000

### 5. Connexion

Utilisez les identifiants de démonstration (si vous avez exécuté le seed) :
- **Email**: manager@optician.pro
- **Mot de passe**: manager123

## 📁 Structure du Projet

```
eyeglasse-shop/
├── server/
│   ├── prisma/
│   │   ├── schema.prisma       # Schéma de base de données
│   │   └── seed.ts             # Données de démonstration
│   ├── src/
│   │   ├── modules/
│   │   │   ├── user/           # Authentification
│   │   │   ├── customer/       # Gestion clients
│   │   │   ├── product/        # Gestion produits
│   │   │   ├── quote/          # Gestion devis
│   │   │   ├── invoice/        # Gestion factures
│   │   │   ├── prescription/   # Ordonnances
│   │   │   └── report/         # Rapports
│   │   ├── lib/
│   │   │   ├── prisma.ts       # Client Prisma
│   │   │   └── email.ts        # Service email
│   │   ├── routes.ts           # Routes API
│   │   └── app.ts              # Configuration Express
│   └── package.json
│
└── client/
    ├── public/
    │   └── locales/
    │       ├── fr/             # Traductions françaises
    │       └── en/             # Traductions anglaises
    ├── src/
    │   ├── pages/              # Pages Next.js
    │   ├── redux/
    │   │   └── api/            # API clients (RTK Query)
    │   │       ├── customers.ts
    │   │       ├── quotes.ts
    │   │       ├── invoices.ts
    │   │       ├── prescriptions.ts
    │   │       └── reports.ts
    │   └── components/         # Composants React
    └── package.json
```

## 🔧 Configuration

### Variables d'environnement

**Server (.env)**:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/optician_db?schema=public"
JWT_SECRET="votre-cle-secrete"
RESEND_API_KEY="votre-cle-resend"  # Optionnel
CLIENT_URL="http://localhost:3000"
NODE_ENV=development
PORT=8080
```

**Client (.env.local)**:
```env
NEXT_PUBLIC_API_URL="http://localhost:8080/api"
```

### Configuration Email (Optionnel)

Pour activer l'envoi d'emails:

1. Créer un compte sur [Resend](https://resend.com)
2. Obtenir une clé API
3. Ajouter à `server/.env`
4. Vérifier votre domaine dans le dashboard Resend

## 🧪 Testing

Optician Pro uses Test-Driven Development (TDD) with comprehensive test coverage.

### Running Tests

```bash
# Run all tests
make test

# Backend tests only
cd server && npm test

# Frontend tests only
cd client && npm test

# E2E tests
cd client && npm run test:e2e

# With coverage
make test-coverage
```

### Test Coverage

- **Backend**: 80%+ coverage target with Jest
- **Frontend**: 70%+ coverage target with Vitest
- **E2E**: Complete user workflows with Playwright

See [Testing Guide](docs/docs/dev/testing.md) for detailed information.

## 📚 Documentation

Comprehensive documentation is available via Docusaurus:

```bash
cd docs
npm install
npm start
```

Visit http://localhost:3001

### Documentation includes:
- Getting Started guide
- User Guide (Dashboard, Customers, Products, etc.)
- Development guides (Architecture, API, Testing)
- API Reference
- Deployment guides

## 📊 Schéma de Base de Données

![Database Schema](https://via.placeholder.com/800x600?text=PostgreSQL+Schema)

### Principales Entités

- **Users**: Gestion des utilisateurs et rôles
- **Customers**: Informations clients
- **Products**: Catalogue produits avec suivi de stock
- **Quotes**: Devis avec ligne de produits
- **Invoices**: Factures avec paiements
- **Prescriptions**: Ordonnances optiques

## 🎯 Roadmap

### MVP Actuel ✅
- [x] Migration PostgreSQL + Prisma
- [x] Multi-langue (FR/EN)
- [x] Gestion clients
- [x] Gestion devis
- [x] Gestion factures avec paiements
- [x] Gestion ordonnances
- [x] Suivi de stock avancé
- [x] Tableau de bord avec rapports

### Phase 2 (À venir)
- [ ] Système de rendez-vous
- [ ] Examens de la vue
- [ ] Commandes laboratoire
- [ ] Garanties et réparations
- [ ] Intégration assurance
- [ ] Application mobile
- [ ] Scanner de code-barres

## 🤝 Contribution

Les contributions sont les bienvenues! Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les guidelines.

## 📄 License

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou problème:
- Ouvrir une issue sur GitHub
- Consulter la documentation Prisma: https://prisma.io/docs
- Consulter la documentation Next.js: https://nextjs.org/docs

---

**Développé avec ❤️ pour les opticiens**
