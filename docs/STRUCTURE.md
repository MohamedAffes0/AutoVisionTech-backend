# Structure et Description des Modules du Projet AutoVisionTech

## Structure Générale

```
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
├── auth/
│   ├── decorators/
│   ├── guards/
│   └── types/
├── config/
│   ├── database.config.ts
│   └── multer.config.ts
├── modules/
│   ├── user/
│   ├── car/
│   ├── comment/
│   ├── reservation/
│   └── upload/
├── utils/
│   └── auth.ts
└── uploads/
    ├── profiles/     # Images de profil utilisateurs
    ├── cars/         # Images de voitures
    └── others/       # Autres fichiers
```

---

## Module d'Authentification (`auth/`)

### Description
Gère l'authentification et l'autorisation des utilisateurs avec Better Auth, incluant les gardes, décorateurs et types personnalisés pour le système de permissions.

### Composants

#### **Decorators**
- `@CurrentUser()` - Extrait l'utilisateur authentifié de la requête
- `@Public()` - Marque une route comme publique (pas d'authentification requise)
- `@RequirePermissions()` - Spécifie les permissions requises pour accéder à une route

#### **Guards**
- `PermissionsGuard` - Vérifie les permissions utilisateur et l'authentification
  - Valide la session Better Auth
  - Vérifie le statut actif de l'utilisateur
  - Contrôle les permissions selon le rôle
  - Gère les routes publiques

#### **Types**
- `AuthUser` - Interface représentant un utilisateur authentifié
  ```typescript
  interface AuthUser {
    id: string;
    email: string;
    role: 'admin' | 'agent';
    isActive: boolean;
  }
  ```

- `Permission` - Enum définissant toutes les permissions du système
- `UserRole` - Type pour les rôles utilisateur (admin, agent)
- `ROLE_PERMISSIONS` - Mapping des rôles vers leurs permissions

### Permissions Disponibles

**Gestion des Voitures**:
- `CREATE_CAR` - Créer une voiture
- `UPDATE_CAR` - Modifier une voiture
- `DELETE_CAR` - Supprimer une voiture

**Gestion des Commentaires**:
- `MANAGE_COMMENTS` - Gérer les commentaires
- `DELETE_ANY_COMMENT` - Supprimer n'importe quel commentaire

**Gestion des Réservations**:
- `MANAGE_RESERVATIONS` - Gérer les réservations
- `UPDATE_RESERVATION_STATUS` - Mettre à jour le statut

**Gestion des Utilisateurs**:
- `USERS_VIEW` - Voir les utilisateurs
- `USERS_UPDATE` - Modifier les utilisateurs
- `USERS_DELETE` - Supprimer les utilisateurs
- `ADMIN_USER_CREATE` - Créer un administrateur
- `ADMIN_USER_ACTIVATE` - Activer un utilisateur
- `ADMIN_USER_DEACTIVATE` - Désactiver un utilisateur
- `UPDATE_USER_ROLE` - Changer le rôle d'un utilisateur

### Permissions par Rôle

**Agent**:
- Création, modification et suppression de voitures
- Gestion des réservations
- Mise à jour du statut des réservations

**Admin**:
- Toutes les permissions des agents
- Gestion complète des utilisateurs
- Suppression de commentaires
- Gestion des rôles

---

## Module Utilisateur (`user/`)

### Description
Gère les profils utilisateurs avec système de rôles et permissions, incluant la création, modification, suppression et gestion des images de profil.

### Entités
- **User**: 
  - id (UUID généré par Better Auth)
  - email (unique)
  - name (optionnel)
  - image (URL de l'image de profil)
  - role (enum: 'admin' | 'agent')
  - isActive (boolean, défaut: true)
  - createdAt, updatedAt (timestamps)

### Endpoints Principaux

**Profil Personnel**:
- `GET /users/profile/me` - Obtenir mon profil
- `PATCH /users/profile/me` - Mettre à jour mon profil
- `PATCH /users/profile/password` - Changer mon mot de passe
- `PATCH /users/profile/me/image` - Mettre à jour mon image de profil
- `DELETE /users/profile/me/image` - Supprimer mon image de profil
- `DELETE /users/me` - Supprimer mon compte

**Gestion Admin**:
- `GET /users` - Liste tous les utilisateurs (paginée, filtrée)
- `GET /users/:id` - Détails d'un utilisateur
- `POST /users/admin` - Créer un compte admin
- `PATCH /users/:id` - Modifier un utilisateur
- `PATCH /users/isActive/:id` - Activer/désactiver un utilisateur
- `PATCH /users/role/:id` - Changer le rôle d'un utilisateur
- `DELETE /users/:id` - Supprimer un utilisateur

### DTOs
- `CreateUserDto` - Création d'un utilisateur admin
  ```typescript
  {
    email: string;
    password: string; // Min 8 caractères
    name?: string;
    role?: 'admin' | 'agent';
    isActive?: boolean;
  }
  ```

- `UpdateProfileDto` - Mise à jour du profil
  ```typescript
  {
    name?: string; // Min 2 caractères
    email?: string; // Format email valide
  }
  ```

- `ChangePasswordDto` - Changement de mot de passe
  ```typescript
  {
    currentPassword: string;
    newPassword: string; // Min 8 caractères
  }
  ```

- `UserFilterDto` - Filtrage des utilisateurs
  ```typescript
  {
    email?: string;
    name?: string;
    role?: 'admin' | 'agent';
    createdAtMin?: string; // Date ISO
    createdAtMax?: string; // Date ISO
    isActive?: boolean;
  }
  ```

### Fonctionnalités Spéciales
- Gestion des images de profil avec upload/suppression
- Changement de mot de passe via Better Auth API
- Activation/désactivation des comptes (admin)
- Changement de rôle avec validation (admin)
- Vérification d'unicité de l'email
- Suppression de l'image lors de la suppression du compte

---

## Module Voiture (`car/`)

### Description
Gère le catalogue de véhicules avec upload d'images multiples, filtrage avancé et système de statuts.

### Entités
- **Car**:
  - id (UUID)
  - brand (marque, requis)
  - model (modèle, requis)
  - year (année, int >= 1900)
  - price (prix, decimal 10,2)
  - kilometerAge (kilométrage, int >= 0)
  - status (enum: 'available' | 'reserved' | 'sold')
  - condition (état du véhicule)
  - description (texte long, optionnel)
  - images (array de URLs, max 5)
  - features (array de caractéristiques, optionnel)
  - userId (référence à l'agent créateur)
  - createdAt, updatedAt (timestamps)
  - Relations: user, comments, reservations

### Endpoints Principaux
- `GET /cars` - Liste des voitures (public, paginée, filtrée)
- `GET /cars/:id` - Détails d'une voiture (public)
- `POST /cars` - Créer une voiture (agent, avec upload)
- `PATCH /cars/:id` - Modifier une voiture (agent, avec upload)
- `PATCH /cars/:id/images` - Mettre à jour les images (agent)
- `DELETE /cars/:id` - Supprimer une voiture (agent)

### DTOs
- `CreateCarDto` - Création d'une voiture
  ```typescript
  {
    brand: string;
    model: string;
    year: number; // >= 1900
    price: number; // > 0
    kilometerAge: number; // >= 0
    status: 'available' | 'reserved' | 'sold';
    condition: string;
    description?: string;
    features?: string[];
    images?: string[]; // URLs
  }
  ```

- `UpdateCarDto` - Mise à jour d'une voiture
  ```typescript
  {
    brand?: string;
    model?: string;
    year?: number;
    price?: number;
    kilometerAge?: number;
    status?: 'available' | 'reserved' | 'sold';
    condition?: string;
    description?: string;
    features?: string[];
    imagesToKeep?: string[]; // URLs à conserver
  }
  ```

- `CarFilterDto` - Filtrage des voitures
  ```typescript
  {
    brand?: string; // Recherche partielle
    model?: string; // Recherche partielle
    minYear?: string;
    maxYear?: string;
    sortByYear?: 'asc' | 'desc';
    minPrice?: string;
    maxPrice?: string;
    sortByPrice?: 'asc' | 'desc';
    minkilometerAge?: string;
    maxkilometerAge?: string;
    sortByKilometerAge?: 'asc' | 'desc';
    status?: 'available' | 'reserved' | 'sold';
  }
  ```

### Fonctionnalités Spéciales
- Upload jusqu'à 5 images par voiture
- Gestion intelligente des images (conservation/suppression)
- Calcul du nombre de commentaires
- Recherche insensible à la casse (ILIKE)
- Tri multiple (prix, année, kilométrage)
- Validation du stock d'images (max 5)
- Suppression automatique des images lors de la suppression
- Eager loading de l'utilisateur créateur

---

## Module Commentaire (`comment/`)

### Description
Gère les avis et retours des utilisateurs sur les véhicules.

### Entités
- **Comment**:
  - id (UUID)
  - content (contenu du commentaire, requis)
  - name (nom du commentateur, requis)
  - carId (référence à la voiture)
  - createdAt (timestamp)
  - Relation: car (avec cascade delete)

### Endpoints Principaux
- `POST /comments` - Créer un commentaire (public)
- `GET /comments/car/:carId` - Commentaires d'une voiture (public)

### DTOs
- `CreateCommentDto` - Création d'un commentaire
  ```typescript
  {
    carId: string; // UUID
    content: string;
    name: string;
  }
  ```

### Fonctionnalités Spéciales
- Cascade delete avec la voiture
- Validation de l'existence de la voiture
- Tri par date de création
- Pas d'authentification requise (public)

---

## Module Réservation (`reservation/`)

### Description
Gère les réservations de visites de véhicules par les clients avec système de statuts et filtrage avancé.

### Entités
- **Reservation**:
  - id (UUID)
  - clientName (nom du client, requis)
  - clientEmail (email du client, requis)
  - clientPhone (téléphone, 8 chiffres, requis)
  - visitDate (date de visite, requis)
  - visitTime (heure de visite, requis)
  - status (enum: 'pending' | 'confirmed' | 'cancelled')
  - carId (référence à la voiture)
  - createdAt, updatedAt (timestamps)
  - Relation: car (eager loading, cascade delete)

### Endpoints Principaux
- `POST /reservations/:carId` - Créer une réservation (public)
- `GET /reservations` - Liste des réservations (agent, paginée, filtrée)
- `GET /reservations/:id` - Détails d'une réservation (agent)
- `PATCH /reservations/:id` - Modifier une réservation (agent)
- `DELETE /reservations/:id` - Supprimer une réservation (agent)

### DTOs
- `CreateReservationDto` - Création d'une réservation
  ```typescript
  {
    clientName: string;
    clientEmail: string; // Format email
    clientPhone: string; // 8 chiffres exactement
    visitDate: string; // Format date ISO
    visitTime: string; // Format heure
  }
  ```

- `UpdateReservationDto` - Mise à jour d'une réservation
  ```typescript
  {
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    visitDate?: string;
    visitTime?: string;
    status?: 'pending' | 'confirmed' | 'cancelled';
  }
  ```

- `ReservationFilterDto` - Filtrage des réservations
  ```typescript
  {
    clientPhone?: string; // Recherche partielle
    minVisitDate?: string; // Date ISO
    maxVisitDate?: string; // Date ISO
    sortByVisitDate?: 'asc' | 'desc';
    status?: 'pending' | 'confirmed' | 'cancelled';
    carId?: string; // UUID
  }
  ```

### Fonctionnalités Spéciales
- Validation stricte du téléphone (8 chiffres)
- Validation de l'email
- Cascade delete avec la voiture
- Eager loading de la voiture
- Filtrage par plage de dates
- Tri par date de visite
- Statut par défaut: 'pending'

---

## Module Upload (`upload/`)

### Description
Service centralisé pour la gestion des fichiers uploadés (validation, URL, suppression).

### Service: UploadService

#### Méthodes Principales

**`getFileUrl(filename: string, folder: string)`**
- Génère l'URL complète d'un fichier uploadé
- Base URL: `process.env.MULTER_BASE_URL || http://localhost:3000`
- Format: `{baseUrl}/uploads/{folder}/{filename}`

**`getFilenameFromUrl(url: string)`**
- Extrait le nom de fichier depuis une URL
- Retourne `null` si URL invalide

**`getFolderFromUrl(url: string)`**
- Extrait le nom du dossier depuis une URL
- Retourne 'profiles' par défaut

**`deleteFile(fileUrl: string)`**
- Supprime un fichier du système de fichiers
- Gestion des erreurs silencieuse

**`deleteMultipleFiles(fileUrls: string[])`**
- Supprime plusieurs fichiers
- Utilise `Promise.allSettled` pour ne pas échouer si un fichier manque

**`validateFile(file: Express.Multer.File)`**
- Valide un fichier unique
- Vérifie: présence, taille (max 5MB), type MIME

**`validateFiles(files: Express.Multer.File[])`**
- Valide plusieurs fichiers
- Vérifie: présence, nombre (max 5), puis valide chaque fichier

### Types MIME Acceptés
- `image/jpeg`
- `image/jpg`
- `image/png`
- `image/webp`
- `image/gif`

### Limitations
- Taille maximale par fichier: 5MB
- Nombre maximum de fichiers: 5
- Seules les images sont acceptées

---

## Configuration (`config/`)

### database.config.ts
Configuration TypeORM pour PostgreSQL:
```typescript
{
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'autovisiontech',
  entities: [/* auto-loaded */],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development'
}
```

### multer.config.ts
Configuration Multer pour l'upload de fichiers:
- **Storage**: diskStorage avec organisation par dossiers
- **Destinations**:
  - `profileImage` / `image` → `./uploads/profiles`
  - `images` → `./uploads/cars`
  - autres → `./uploads/others`
- **Filename**: `{basename}-{timestamp}-{random}.{ext}`
- **File Filter**: Validation des types MIME
- **Limits**: 1MB par fichier

---

## Utilitaires (`utils/`)

### auth.ts
Configuration Better Auth:
```typescript
{
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8
  },
  password: {
    verify: (password) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)
  },
  user: {
    additionalFields: {
      role: { type: 'string', defaultValue: 'agent' },
      isActive: { type: 'boolean', defaultValue: false }
    }
  },
  session: {
    enabled: true,
    expiresIn: 60 * 60 * 24 * 1 // 1 jour
  },
  trustedOrigins: ['http://localhost:3000', 'http://localhost:4200']
}
```

**Validation du mot de passe**:
- Minimum 8 caractères
- Au moins une lettre
- Au moins un chiffre

---

## Point d'Entrée (`main.ts`)

### Configuration de l'Application

**Body Parser**: Désactivé (requis pour Better Auth)

**ValidationPipe Global**:
- `whitelist: true` - Supprime les attributs non-DTO
- `forbidNonWhitelisted: true` - Erreur si champ non-autorisé
- `transform: true` - Conversion automatique des types
- `enableImplicitConversion: true` - Conversion des primitives

**Static Assets**:
- Dossier: `./uploads`
- Prefix: `/uploads/`

**CORS**:
- Origin: `http://localhost:4200`
- Credentials: `true` (permet les cookies)

**Port**: 3000 (ou `process.env.PORT`)

---

## Intercepteurs

### CleanupFilesInterceptor
Nettoie automatiquement les fichiers uploadés en cas d'erreur:
- Intercepte les erreurs de la route
- Supprime tous les fichiers uploadés dans la requête
- Gère les fichiers uniques et multiples
- Gère les structures `files` en array ou objet

---

## Pagination

Toutes les routes de liste utilisent une pagination standardisée:

**Paramètres**:
- `page` (défaut: 1)
- `limit` (défaut: 20 pour users/cars, 10 pour reservations)

**Format de réponse**:
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

**Librairie**: `nestjs-typeorm-paginate`

---

## Sécurité

### Gardes d'Authentification

**PermissionsGuard**:
- Appliqué sur tous les contrôleurs nécessitant une authentification
- Vérifie la session Better Auth
- Contrôle le statut actif de l'utilisateur
- Valide les permissions selon le rôle
- Gère les routes publiques via `@Public()`

### Routes Publiques
Marquées avec `@Public()`:
- Lecture des voitures et détails
- Création de commentaires
- Création de réservations
- Routes racine

### Routes Authentifiées
Requièrent une session valide mais sans permission spécifique:
- Profil utilisateur
- Changement de mot de passe

### Routes avec Permissions
Requièrent des permissions spécifiques via `@RequirePermissions()`:
- Gestion des voitures (agent)
- Gestion des réservations (agent)
- Gestion des utilisateurs (admin)

### Validation des Comptes
Les utilisateurs désactivés (`isActive: false`) ne peuvent pas:
- Accéder aux routes protégées
- Effectuer des actions nécessitant l'authentification
- Message d'erreur: "Your account has been deactivated"

---

## Notes Importantes

1. **Better Auth**: Gère l'authentification et la création des comptes utilisateurs
2. **Synchronize**: Désactivé pour l'entité User (gérée par Better Auth)
3. **Cascade Delete**: Configuré sur commentaires et réservations
4. **Validation**: DTOs avec class-validator sur toutes les entrées
5. **Eager Loading**: Utilisé stratégiquement (user dans car, car dans reservation)
6. **Upload**: Maximum 5 images par voiture, 1MB par fichier
7. **Cleanup**: Suppression automatique des fichiers en cas d'erreur
8. **Images**: Stockage local dans `./uploads` avec organisation par type
9. **Permissions**: Système complet basé sur les rôles
10. **Activation**: Les admins peuvent activer/désactiver les comptes

---

## Architecture des Données

### Relations OneToMany
- User → Cars (un agent crée plusieurs voitures)
- Car → Comments (une voiture a plusieurs commentaires)
- Car → Reservations (une voiture a plusieurs réservations)

### Relations ManyToOne
- Car → User (une voiture appartient à un agent)
- Comment → Car (un commentaire concerne une voiture)
- Reservation → Car (une réservation concerne une voiture)

### Stratégies de Chargement
- **Eager**: Chargement automatique (car.user, reservation.car)
- **Lazy**: Chargement à la demande (user.cars, car.comments)

### Actions en Cascade
- **onDelete: 'SET NULL'**: car.user (préserve les voitures)
- **onDelete: 'CASCADE'**: comment.car, reservation.car (supprime tout)