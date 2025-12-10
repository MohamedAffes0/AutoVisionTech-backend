# Guide Complet des Commandes cURL - API AutoVisionTech

## Table des Matières

1. [Authentication (Better Auth)](#authentication)
2. [Users](#users)
3. [Cars](#cars)
4. [Reservations](#reservations)
5. [Comments](#comments)
6. [App Routes](#app-routes)

---

## 1. Authentication (Better Auth) {#authentication}

### Inscription (Sign Up)

#### Inscription d'un nouvel utilisateur

```bash
curl -X POST "http://localhost:3000/api/auth/sign-up/email" \
-H "Content-Type: application/json" \
-d '{
        "email": "user@example.com",
        "password": "Password123",
        "name": "John Doe"
    }'
```

> **Remarque :** 
> - Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre
> - Le rôle par défaut est "agent"
> - Le compte est inactif par défaut (isActive: false)
> - Un admin doit activer le compte pour qu'il soit utilisable

### Connexion (Sign In)

#### Connexion d'un utilisateur

```bash
curl -X POST "http://localhost:3000/api/auth/sign-in/email" \
-H "Content-Type: application/json" \
-d '{
        "email": "user@example.com",
        "password": "Password123"
    }' \
-c cookies.txt
```

### Déconnexion (Sign Out)

```bash
curl -X POST "http://localhost:3000/api/auth/sign-out" \
-H "Origin: http://localhost:3000" \
-b cookies.txt \
-c cookies.txt
```

### Obtenir la session courante

```bash
curl -X GET "http://localhost:3000/api/auth/get-session" \
-b cookies.txt
```

---

## 2. Users {#users}

### Lister tous les utilisateurs (Admin)

**Pagination :** Oui (`page`, `limit`)  
**Filtres :** `email`, `name`, `role`, `createdAtMin`, `createdAtMax`, `isActive`

```bash
curl -X GET "http://localhost:3000/users?page=1&limit=20" \
-b cookies.txt
```

**Exemple avec filtres :**
```bash
curl -X GET "http://localhost:3000/users?page=1&limit=20&role=agent&name=John&isActive=true" \
-b cookies.txt
```

### Obtenir mon profil

```bash
curl -X GET "http://localhost:3000/users/profile/me" \
-b cookies.txt
```

### Obtenir un utilisateur par ID (Admin)

```bash
curl -X GET "http://localhost:3000/users/<user_id>" \
-b cookies.txt
```

### Mettre à jour mon profil

```bash
curl -X PATCH "http://localhost:3000/users/profile/me" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "name": "John Updated",
        "email": "newmail@example.com"
    }'
```

> **Remarque :** Les champs optionnels sont :
> - `name` (minimum 2 caractères)
> - `email` (doit être unique)

### Upload Image de Profil

```bash
curl -X PATCH "http://localhost:3000/users/profile/me/image" \
-b cookies.txt \
-F "profileImage=@/chemin/vers/ton/image.jpg"
```

> **Validations :**
> - Maximum `1 image` par profil
> - Taille max `1MB`
> - Types acceptés: `jpg`, `jpeg`, `png`, `webp`, `gif`

### Supprimer Image de Profil

```bash
curl -X DELETE "http://localhost:3000/users/profile/me/image" \
-b cookies.txt
```

### Changer mon mot de passe

```bash
curl -X PATCH "http://localhost:3000/users/profile/password" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "currentPassword": "Password123",
        "newPassword": "NewPassword456"
    }'
```

> **Remarque :** 
> - Le nouveau mot de passe doit être différent de l'ancien
> - Minimum 8 caractères, une lettre et un chiffre

### Créer un utilisateur admin (Admin)

```bash
curl -X POST "http://localhost:3000/users/admin" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "email": "admin@example.com",
        "password": "Password123",
        "name": "Admin User",
        "role": "admin",
        "isActive": true
    }'
```

> **Remarque :** Les champs optionnels sont :
> - `name`
> - `role` (par défaut: "agent")
> - `isActive` (par défaut: true)

### Mettre à jour un utilisateur (Admin)

```bash
curl -X PATCH "http://localhost:3000/users/<user_id>" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "name": "Updated Name",
        "email": "updated@example.com"
    }'
```

> **Remarque :** Les champs optionnels sont :
> - `name`
> - `email`

### Activer/Désactiver un utilisateur (Admin)

```bash
curl -X PATCH "http://localhost:3000/users/isActive/<user_id>" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "isActive": true
    }'
```

### Changer le rôle d'un utilisateur (Admin)

```bash
curl -X PATCH "http://localhost:3000/users/role/<user_id>" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "role": "admin"
    }'
```

> **Remarque :** Rôles possibles: `"admin"` ou `"agent"`

### Supprimer mon profil

```bash
curl -X DELETE "http://localhost:3000/users/me" \
-b cookies.txt
```

### Supprimer un utilisateur (Admin)

```bash
curl -X DELETE "http://localhost:3000/users/<user_id>" \
-b cookies.txt
```

---

## 3. Cars {#cars}

### Lister toutes les voitures (Public)

**Pagination :** Oui (`page`, `limit`)  
**Filtres :** `brand`, `model`, `minYear`, `maxYear`, `sortByYear`, `minPrice`, `maxPrice`, `sortByPrice`, `minkilometerAge`, `maxkilometerAge`, `sortByKilometerAge`, `status`

```bash
curl -X GET "http://localhost:3000/cars?page=1&limit=20"
```

**Exemple avec filtres :**
```bash
curl -X GET "http://localhost:3000/cars?page=1&limit=20&brand=Toyota&minPrice=20000&maxPrice=30000&sortByPrice=asc&status=available"
```

**Exemple avec tri :**
```bash
# Tri par prix croissant
curl -X GET "http://localhost:3000/cars?sortByPrice=asc"

# Tri par année décroissante
curl -X GET "http://localhost:3000/cars?sortByYear=desc"

# Tri par kilométrage croissant
curl -X GET "http://localhost:3000/cars?sortByKilometerAge=asc"
```

### Obtenir une voiture par ID (Public)

```bash
curl -X GET "http://localhost:3000/cars/<car_id>"
```

### Créer une voiture (Agent)

```bash
curl -X POST "http://localhost:3000/cars" \
-b cookies.txt \
-F "brand=Toyota" \
-F "model=Corolla" \
-F "year=2024" \
-F "price=25000" \
-F "kilometerAge=0" \
-F "status=available" \
-F "condition=new" \
-F "description=Magnifique voiture en excellent état" \
-F "features[]=Climatisation" \
-F "features[]=GPS" \
-F "features[]=Bluetooth" \
-F "images=@/chemin/vers/image1.jpg" \
-F "images=@/chemin/vers/image2.jpg"
```

> **Remarque :** Les champs optionnels sont :
> - `description`
> - `features[]` (array de strings)
> - `images` (fichiers)
>
> **Validations :**
> - `year` >= 1900
> - `price` > 0
> - `kilometerAge` >= 0
> - `status` : "available", "reserved", ou "sold"
> - Maximum `5 images` par voiture
> - Taille max `1MB` par image
> - Types acceptés: `jpg`, `jpeg`, `png`, `webp`

### Mettre à jour une voiture (Agent)

```bash
curl -X PATCH "http://localhost:3000/cars/<car_id>" \
-b cookies.txt \
-F "brand=Toyota" \
-F "model=Corolla 2024" \
-F "year=2024" \
-F "price=26000" \
-F "kilometerAge=5000" \
-F "status=available" \
-F "condition=excellent" \
-F "description=Voiture mise à jour" \
-F "features[]=Climatisation" \
-F "features[]=GPS" \
-F "imagesToKeep[]=https://example.com/uploads/cars/old1.jpg" \
-F "imagesToKeep[]=https://example.com/uploads/cars/old2.jpg" \
-F "images=@/chemin/vers/new_image1.jpg"
```

> **Remarque :** 
> - Tous les champs sont optionnels
> - `imagesToKeep[]` : URLs des images à conserver
> - `images` : nouvelles images à ajouter
> - Le total (anciennes + nouvelles) ne doit pas dépasser 5 images

### Mettre à jour les images d'une voiture (Agent)

```bash
curl -X PATCH "http://localhost:3000/cars/<car_id>/images" \
-b cookies.txt \
-F "images=@/chemin/vers/image1.jpg" \
-F "images=@/chemin/vers/image2.jpg" \
-F "replaceAll=false"
```

> **Remarque :**
> - `replaceAll`: string ("true" ou "false")
>   - `"true"`: Remplace toutes les images existantes
>   - `"false"`: Ajoute les nouvelles images aux existantes (défaut)
>
> **Validations :**
> - Maximum `5 images` par voiture
> - Taille max `1MB` par image
> - Types acceptés: `jpg`, `jpeg`, `png`, `webp`

### Supprimer une voiture (Agent)

```bash
curl -X DELETE "http://localhost:3000/cars/<car_id>" \
-b cookies.txt
```

> **Remarque :** 
> - Supprime automatiquement toutes les images associées
> - Supprime en cascade tous les commentaires et réservations liés

---

## 4. Reservations {#reservations}

### Lister toutes les réservations (Agent)

**Pagination :** Oui (`page`, `limit`)  
**Filtres :** `clientPhone`, `minVisitDate`, `maxVisitDate`, `sortByVisitDate`, `status`, `carId`

```bash
curl -X GET "http://localhost:3000/reservations?page=1&limit=10" \
-b cookies.txt
```

**Exemple avec filtres :**
```bash
curl -X GET "http://localhost:3000/reservations?page=1&limit=10&status=pending&minVisitDate=2025-01-01&sortByVisitDate=asc" \
-b cookies.txt
```

### Obtenir une réservation par ID (Agent)

```bash
curl -X GET "http://localhost:3000/reservations/<reservation_id>" \
-b cookies.txt
```

### Créer une réservation (Public)

```bash
curl -X POST "http://localhost:3000/reservations/<car_id>" \
-H "Content-Type: application/json" \
-d '{
        "clientName": "John Doe",
        "clientEmail": "john@example.com",
        "clientPhone": "12345678",
        "visitDate": "2025-01-15",
        "visitTime": "14:00"
    }'
```

> **Validations :**
> - `clientEmail` : format email valide
> - `clientPhone` : exactement 8 chiffres
> - `visitDate` : format date ISO (YYYY-MM-DD)
> - `visitTime` : format heure (HH:mm)

### Mettre à jour une réservation (Agent)

```bash
curl -X PATCH "http://localhost:3000/reservations/<reservation_id>" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "clientName": "John Doe Updated",
        "clientEmail": "john.updated@example.com",
        "clientPhone": "87654321",
        "visitDate": "2025-01-20",
        "visitTime": "15:30",
        "status": "confirmed"
    }'
```

> **Remarque :** Tous les champs sont optionnels
>
> **Statuts possibles :**
> - `"pending"` : En attente
> - `"confirmed"` : Confirmée
> - `"cancelled"` : Annulée

### Supprimer une réservation (Agent)

```bash
curl -X DELETE "http://localhost:3000/reservations/<reservation_id>" \
-b cookies.txt
```

---

## 5. Comments {#comments}

### Créer un commentaire (Public)

```bash
curl -X POST "http://localhost:3000/comments" \
-H "Content-Type: application/json" \
-d '{
        "carId": "<car_id>",
        "content": "Excellente voiture, très bien entretenue!",
        "name": "John Doe"
    }'
```

> **Validations :**
> - `carId` : UUID valide
> - `content` : requis
> - `name` : requis

### Obtenir les commentaires d'une voiture (Public)

```bash
curl -X GET "http://localhost:3000/comments/car/<car_id>"
```

> **Remarque :** Les commentaires sont triés par date de création (plus récents en premier)

---

## 6. App Routes {#app-routes}

### Route publique (Hello World)

```bash
curl -X GET "http://localhost:3000/"
```

**Réponse attendue :**
```
Hello World!
```

### Route privée (Authentification requise)

```bash
curl -X GET "http://localhost:3000/private" \
-b cookies.txt
```

**Réponse attendue :**
```
Secret area 🕵️‍♂️
```

> **Remarque :** Nécessite une session valide avec un compte actif

---

## Exemples de Workflows Complets

### Workflow 1 : Inscription et Activation d'un Agent

```bash
# 1. S'inscrire en tant qu'agent
curl -X POST "http://localhost:3000/api/auth/sign-up/email" \
-H "Content-Type: application/json" \
-d '{
        "email": "agent@example.com",
        "password": "Password123",
        "name": "Agent Smith"
    }'

# 2. Un admin doit se connecter
curl -X POST "http://localhost:3000/api/auth/sign-in/email" \
-H "Content-Type: application/json" \
-d '{
        "email": "admin@example.com",
        "password": "AdminPass123"
    }' \
-c admin_cookies.txt

# 3. L'admin active le compte de l'agent
curl -X PATCH "http://localhost:3000/users/isActive/<agent_user_id>" \
-b admin_cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "isActive": true
    }'

# 4. L'agent peut maintenant se connecter
curl -X POST "http://localhost:3000/api/auth/sign-in/email" \
-H "Content-Type: application/json" \
-d '{
        "email": "agent@example.com",
        "password": "Password123"
    }' \
-c agent_cookies.txt
```

### Workflow 2 : Créer une Voiture avec Images

```bash
# 1. Se connecter en tant qu'agent
curl -X POST "http://localhost:3000/api/auth/sign-in/email" \
-H "Content-Type: application/json" \
-d '{
        "email": "agent@example.com",
        "password": "Password123"
    }' \
-c cookies.txt

# 2. Créer une voiture avec 3 images
curl -X POST "http://localhost:3000/cars" \
-b cookies.txt \
-F "brand=BMW" \
-F "model=X5" \
-F "year=2023" \
-F "price=55000" \
-F "kilometerAge=15000" \
-F "status=available" \
-F "condition=excellent" \
-F "description=BMW X5 2023, toutes options" \
-F "features[]=Toit panoramique" \
-F "features[]=Sièges chauffants" \
-F "features[]=Caméra 360°" \
-F "images=@./bmw_front.jpg" \
-F "images=@./bmw_side.jpg" \
-F "images=@./bmw_interior.jpg"

# 3. Ajouter 2 images supplémentaires
curl -X PATCH "http://localhost:3000/cars/<car_id>/images" \
-b cookies.txt \
-F "images=@./bmw_back.jpg" \
-F "images=@./bmw_engine.jpg" \
-F "replaceAll=false"
```

### Workflow 3 : Réservation Client

```bash
# 1. Client consulte les voitures disponibles (sans connexion)
curl -X GET "http://localhost:3000/cars?status=available&brand=Toyota&sortByPrice=asc"

# 2. Client consulte les détails d'une voiture
curl -X GET "http://localhost:3000/cars/<car_id>"

# 3. Client consulte les commentaires
curl -X GET "http://localhost:3000/comments/car/<car_id>"

# 4. Client crée une réservation (sans connexion)
curl -X POST "http://localhost:3000/reservations/<car_id>" \
-H "Content-Type: application/json" \
-d '{
        "clientName": "Marie Dupont",
        "clientEmail": "marie@example.com",
        "clientPhone": "98765432",
        "visitDate": "2025-01-18",
        "visitTime": "10:00"
    }'

# 5. Agent se connecte et consulte les réservations
curl -X POST "http://localhost:3000/api/auth/sign-in/email" \
-H "Content-Type: application/json" \
-d '{
        "email": "agent@example.com",
        "password": "Password123"
    }' \
-c cookies.txt

curl -X GET "http://localhost:3000/reservations?status=pending" \
-b cookies.txt

# 6. Agent confirme la réservation
curl -X PATCH "http://localhost:3000/reservations/<reservation_id>" \
-b cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "status": "confirmed"
    }'
```

### Workflow 4 : Gestion Admin

```bash
# 1. Admin se connecte
curl -X POST "http://localhost:3000/api/auth/sign-in/email" \
-H "Content-Type: application/json" \
-d '{
        "email": "admin@example.com",
        "password": "AdminPass123"
    }' \
-c admin_cookies.txt

# 2. Lister tous les utilisateurs
curl -X GET "http://localhost:3000/users?page=1&limit=20" \
-b admin_cookies.txt

# 3. Créer un nouvel admin
curl -X POST "http://localhost:3000/users/admin" \
-b admin_cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "email": "admin2@example.com",
        "password": "AdminPass456",
        "name": "Second Admin",
        "role": "admin",
        "isActive": true
    }'

# 4. Changer le rôle d'un utilisateur
curl -X PATCH "http://localhost:3000/users/role/<user_id>" \
-b admin_cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "role": "admin"
    }'

# 5. Désactiver un utilisateur
curl -X PATCH "http://localhost:3000/users/isActive/<user_id>" \
-b admin_cookies.txt \
-H "Content-Type: application/json" \
-d '{
        "isActive": false
    }'
```

---

## Notes Importantes

1. **Cookies vs Headers**: Better Auth utilise des cookies pour la session. Utilisez `-c cookies.txt` pour sauvegarder et `-b cookies.txt` pour charger les cookies.

2. **Format des dates**: 
   - Dates : ISO 8601 (YYYY-MM-DD)
   - Heures : Format 24h (HH:mm)

3. **UUIDs**: Remplacez `<car_id>`, `<user_id>`, `<reservation_id>` par les vrais IDs de votre base de données.

4. **Statuts**:
   - Voitures : `available`, `reserved`, `sold`
   - Réservations : `pending`, `confirmed`, `cancelled`

5. **Rôles**: 
   - `admin` : Toutes les permissions
   - `agent` : Gestion des voitures et réservations

6. **Permissions**: Certaines routes nécessitent des rôles spécifiques (admin, agent).

7. **Validation**: Tous les DTOs ont des validations strictes. Assurez-vous que vos données respectent les contraintes.

8. **Pagination**: Par défaut, `page=1` et `limit=20` pour users/cars, `limit=10` pour reservations.

9. **Filtres**: Les filtres textuels utilisent la recherche partielle et insensible à la casse (ILIKE).

10. **Upload de fichiers**:
    - Types acceptés: `jpeg`, `jpg`, `png`, `webp`, `gif`
    - Taille maximale par fichier: 1MB
    - Nombre maximum d'images par voiture: 5
    - Les images sont automatiquement supprimées lors de la suppression d'une voiture

11. **Comptes inactifs**: Les utilisateurs avec `isActive: false` ne peuvent pas se connecter ou utiliser les routes protégées.

12. **Cascade Delete**: 
    - Supprimer une voiture supprime automatiquement ses commentaires et réservations
    - Supprimer un utilisateur supprime automatiquement son image de profil

13. **Routes publiques**: 
    - Consultation des voitures
    - Consultation des commentaires
    - Création de réservations
    - Création de commentaires
    - Route racine et `/private` (hello world)

14. **Authentification requise**: Toutes les routes non marquées comme publiques nécessitent une session valide.

15. **Téléphone**: Doit être exactement 8 chiffres (validation stricte).

16. **Email**: Format email valide requis (validation via class-validator).

17. **Mots de passe**: 
    - Minimum 8 caractères
    - Au moins une lettre
    - Au moins un chiffre
    - Pattern: `/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/`

18. **Multipart/form-data**: Utilisé pour l'upload de fichiers (voitures, images de profil). Pour les données JSON simples, utilisez `Content-Type: application/json`.

19. **Arrays dans form-data**: Utilisez la notation `field[]=value` pour les arrays (features, imagesToKeep).

20. **Nettoyage automatique**: Si une erreur survient lors de l'upload, les fichiers sont automatiquement supprimés (CleanupFilesInterceptor).