# Technologies utilisées – AutoVisionTech Backend

---

## Langage & Framework

### **Node.js**
Runtime JavaScript côté serveur
- Version recommandée: 18.x ou supérieure
- Support des modules ES et TypeScript
- Écosystème npm riche

### **NestJS** (v10.x)
Framework backend moderne basé sur Node.js et TypeScript
- **Architecture modulaire**: Organisation claire du code en modules
- **Decorators**: Utilisation intensive des décorateurs TypeScript
- **Dependency Injection**: Inversion de contrôle (IoC) intégrée
- **Pipes**: Validation et transformation des données
- **Guards**: Protection et autorisation des routes
- **Interceptors**: Manipulation des requêtes/réponses
- **Exception Filters**: Gestion centralisée des erreurs

### **TypeScript** (v5.x)
Langage principal avec typage statique
- Typage strict pour meilleure fiabilité
- Interfaces et types personnalisés
- Support des décorateurs
- Compilation vers JavaScript
- Détection d'erreurs au compile-time

---

## Base de données

### **PostgreSQL** (v14+)
Système de base de données relationnelle
- ACID compliant
- Support des transactions
- Gestion avancée des relations
- Performances optimisées pour les requêtes complexes
- Types de données riches (UUID, enum, array, date, time)

### **TypeORM** (v0.3.x)
ORM (Object-Relational Mapping)
- **Entities**: Mapping objet-relationnel
- **Repositories**: Abstraction des requêtes
- **Query Builder**: Construction de requêtes complexes
- **Relations**: OneToMany, ManyToOne, etc.
- **Migrations**: Gestion du schéma de base de données
- **Transactions**: Support complet
- **Eager/Lazy Loading**: Stratégies de chargement optimisées

---

## Authentification & Sécurité

### **Better Auth**
Solution d'authentification moderne
- Gestion complète de l'authentification
- Support email/password
- Sessions sécurisées
- Validation de mots de passe personnalisée
- Gestion des utilisateurs
- Champs personnalisés (role, isActive)
- API REST intégrée

### **Système de Permissions Personnalisé**
- Enum de permissions typé
- Mapping rôles → permissions
- Guards de vérification
- Decorators pour routes protégées
- Vérification du statut actif

### **Express Sessions**
- Stockage des sessions
- Cookies sécurisés
- Gestion de l'expiration (1 jour)

---

## Upload & Stockage de Fichiers

### **Multer**
Middleware pour l'upload de fichiers
- Intégration avec `@nestjs/platform-express`
- Configuration personnalisée (multer.config.ts)
- Organisation par dossiers (profiles, cars, others)
- Génération de noms uniques

### **Système de Validation**
- Validation des types MIME (images uniquement)
- Limite de taille (1MB par fichier)
- Limite de nombre (5 images max)
- Validation côté service (UploadService)

### **Stockage Local**
- Dossier `./uploads` organisé
- Serving via Express static
- URLs publiques générées automatiquement

---

## Validation & Transformation

### **class-validator**
Validation déclarative via décorateurs
- `@IsNotEmpty()`, `@IsString()`, `@IsNumber()`
- `@IsEmail()`, `@IsUUID()`, `@IsDateString()`
- `@Min()`, `@Max()`, `@Length()`
- `@IsIn()`, `@IsOptional()`
- Messages d'erreur personnalisés

### **class-transformer**
Transformation automatique des données
- Conversion de types primitifs
- Sérialisation/désérialisation
- Exclusion de propriétés sensibles

### **ValidationPipe Global**
- Whitelist automatique
- Rejet des propriétés non-définies
- Transformation automatique activée
- Conversion implicite des types

---

## Pagination

### **nestjs-typeorm-paginate**
Librairie de pagination pour TypeORM
- Pagination standardisée
- Métadonnées complètes
- Support des query builders
- Format de réponse uniforme

```typescript
{
  items: T[],
  meta: {
    totalItems: number,
    itemCount: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number
  }
}
```

---

## Gestion des Erreurs

### **Exceptions NestJS**
Exceptions HTTP typées
- `BadRequestException` (400)
- `UnauthorizedException` (401)
- `ForbiddenException` (403)
- `NotFoundException` (404)
- Messages d'erreur descriptifs

### **Intercepteurs Personnalisés**
- `CleanupFilesInterceptor`: Nettoyage des fichiers en cas d'erreur
- Gestion des rollbacks
- Logging des erreurs

---

## Configuration & Environnement

### **dotenv**
Gestion des variables d'environnement
- Fichier `.env` à la racine
- Chargement au démarrage (`dotenv/config`)
- Variables typées

### **Variables Requises**
```env
# Database
DATABASE_URL
DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE

# Application
NODE_ENV, PORT

# Better Auth
BETTER_AUTH_SECRET, BETTER_AUTH_URL

# Multer
MULTER_BASE_URL
```

---

## Outils de Développement

### **ESLint**
Linter JavaScript/TypeScript
- Configuration Prettier intégrée
- Règles NestJS spécifiques
- Détection d'erreurs de code
- Formatage automatique

### **Prettier**
Formateur de code
- Style cohérent
- Intégration avec ESLint
- Configuration personnalisable

### **Jest**
Framework de tests
- Tests unitaires
- Tests end-to-end (e2e)
- Couverture de code
- Mocking intégré

### **Supertest**
Tests d'API HTTP
- Simulation de requêtes
- Assertions sur les réponses
- Tests e2e complets

---

## HTTP & CORS

### **Express**
Serveur HTTP sous-jacent
- Middleware ecosystem
- Static file serving
- Cookie parsing
- Session management

### **CORS**
Configuration Cross-Origin Resource Sharing
- Origin: `http://localhost:4200` (frontend Angular)
- Credentials: `true` (permet les cookies)
- Headers personnalisés autorisés

---

## Librairies Supplémentaires

### **pg** (PostgreSQL Client)
Client Node.js pour PostgreSQL
- Pool de connexions
- Support des promesses
- Utilisé par Better Auth et TypeORM

### **multer**
Parsing de multipart/form-data
- Upload de fichiers
- Configuration avancée
- Validation intégrée

### **path** & **fs**
Modules Node.js natifs
- Manipulation de chemins
- Opérations sur le système de fichiers
- Création/suppression de dossiers
- Lecture/écriture de fichiers

---

## Architecture & Patterns

### **Repository Pattern**
Via TypeORM
- Abstraction de la couche de données
- Méthodes CRUD standardisées
- Query builders pour requêtes complexes

### **DTO Pattern**
Data Transfer Objects
- Validation des entrées
- Transformation des données
- Séparation des concerns
- Documentation implicite

### **Guard Pattern**
Protection des routes
- PermissionsGuard pour l'autorisation
- Vérification du statut actif
- Gestion des sessions

### **Service Layer Pattern**
Logique métier centralisée
- Services injectables
- Réutilisabilité du code
- Testabilité améliorée

### **Module Pattern**
Organisation en modules NestJS
- Encapsulation des fonctionnalités
- Imports/Exports explicites
- Lazy loading possible

---

## Communication & API

### **REST API**
Architecture RESTful
- Méthodes HTTP standard (GET, POST, PATCH, DELETE)
- Routes sémantiques
- Status codes appropriés
- Responses JSON

### **Express Request/Response**
- Headers personnalisés
- Cookies de session
- Query parameters
- Path parameters
- Body parsing (JSON, multipart)

---

## Performance & Optimisation

### **Query Optimization**
- Eager loading stratégique
- Lazy loading pour relations volumineuses
- Index sur colonnes fréquemment recherchées
- Pagination pour limiter les résultats

### **Connection Pooling**
- Pool de connexions PostgreSQL
- Réutilisation des connexions
- Configuration optimisée

### **Caching**
- Pas de cache externe actuellement
- Opportunités: Redis pour sessions/cache

---

## Monitoring & Logging

### **Console Logging**
- Logs de développement activés
- Logs TypeORM en mode dev
- Logs Better Auth (debug mode)

### **Error Tracking**
- Stack traces complètes
- Contexte des erreurs
- Logs structurés

---

## CI/CD & Déploiement

### **Potentiel**
- GitHub Actions (futur)
- Docker containerization
- Environnements staging/production
- Migrations automatiques

---

## Sécurité

### **Mesures Implémentées**
- Validation stricte des entrées
- Prévention des injections SQL (TypeORM)
- Authentification robuste
- Gestion des permissions
- Validation des fichiers uploadés
- CORS configuré
- Sessions sécurisées
- Mots de passe hashés (Better Auth)

### **Bonnes Pratiques**
- Pas de données sensibles dans les logs
- Variables d'environnement pour secrets
- Validation côté serveur
- Limitation de taille des uploads
- Types MIME restreints

---

## Dépendances Principales

### Production
```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/platform-express": "^10.0.0",
  "@nestjs/typeorm": "^10.0.0",
  "@thallesp/nestjs-better-auth": "^1.0.0",
  "better-auth": "latest",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.1",
  "typeorm": "^0.3.0",
  "pg": "^8.11.0",
  "multer": "^1.4.5-lts.1",
  "nestjs-typeorm-paginate": "^4.0.0",
  "dotenv": "^16.0.0"
}
```

### Développement
```json
{
  "@nestjs/cli": "^10.0.0",
  "@nestjs/testing": "^10.0.0",
  "typescript": "^5.1.0",
  "jest": "^29.5.0",
  "supertest": "^6.3.0",
  "@types/node": "^20.3.0",
  "@types/express": "^4.17.17",
  "@types/multer": "^1.4.7",
  "eslint": "^8.42.0",
  "prettier": "^3.0.0"
}
```

---

## Stack Technologique Complet

```
Frontend (séparé): Angular
├── Backend: NestJS + TypeScript
│   ├── Runtime: Node.js
│   ├── Framework: Express (sous NestJS)
│   ├── Auth: Better Auth
│   └── API: REST
├── Base de données: PostgreSQL
│   └── ORM: TypeORM
├── Validation: class-validator + class-transformer
├── Upload: Multer
├── Pagination: nestjs-typeorm-paginate
└── Tests: Jest + Supertest
```

---

## Évolutions Futures Possibles

### **Redis**
- Cache de sessions
- Cache de données fréquentes
- Amélioration des performances

### **Elasticsearch**
- Recherche full-text avancée
- Recherche multicritères optimisée
- Agrégations complexes

### **AWS S3 / Cloud Storage**
- Stockage d'images externalisé
- CDN pour performance
- Backup automatisé

### **WebSockets / Socket.io**
- Notifications en temps réel
- Chat entre agents/clients
- Mise à jour live des réservations

### **GraphQL**
- Alternative à REST
- Requêtes flexibles
- Typage fort côté client

### **Docker**
- Containerisation de l'application
- Environnements reproductibles
- Déploiement simplifié

### **Swagger / OpenAPI**
- Documentation API automatique
- Interface de test intégrée
- Génération de clients