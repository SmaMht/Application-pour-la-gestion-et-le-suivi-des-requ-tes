# CAHIER DES CHARGES TECHNIQUE
## Application de Gestion et Suivi des Requêtes Étudiantes
### Université de Maroua - Faculté des Sciences

---

## 1. PRÉSENTATION GÉNÉRALE DU PROJET

### 1.1 Contexte
L'Université de Maroua, Faculté des Sciences, souhaite moderniser et digitaliser le processus de gestion des requêtes étudiantes pour améliorer l'efficacité administrative et la satisfaction des étudiants.

### 1.2 Objectifs du Projet
- Digitaliser le processus de soumission et de traitement des requêtes étudiantes
- Améliorer la transparence et la traçabilité des demandes
- Optimiser les délais de traitement
- Faciliter la communication entre étudiants et administration
- Générer des statistiques pour une meilleure gestion des ressources

### 1.3 Périmètre du Projet
Application web responsive accessible depuis ordinateurs, tablettes et smartphones, destinée aux étudiants de la Faculté des Sciences et au personnel administratif de l'Université de Maroua.

---

## 2. SPÉCIFICATIONS FONCTIONNELLES

### 2.1 Gestion des Utilisateurs

#### 2.1.1 Profils Utilisateurs
- **Étudiant** : Soumission et suivi des requêtes
- **Agent** : Traitement des requêtes assignées
- **Chef de Departement** : Gestion d'équipe et affectation des requêtes
- **Administrateur Système** : Gestion complète de l'application

#### 2.1.2 Authentification et Autorisation
- Connexion sécurisée par matricule/email et mot de passe
- Récupération de mot de passe par email
- Gestion des sessions utilisateur
- Contrôle d'accès basé sur les rôles (RBAC)

### 2.2 Module de Soumission des Requêtes (Étudiants)

#### 2.2.1 Types de Requêtes
- Demandes de documentation (attestations, relevés, diplômes)
- Demandes d'assistance financière
- Demandes de changement de programme/filière
- Demandes de transfert
- Demandes de lettre de recommandation
- Autres demandes

#### 2.2.2 Formulaire de Soumission
- Interface intuitive avec champs obligatoires et optionnels
- Upload de documents justificatifs (PDF)
- Validation des données en temps réel
- Sauvegarde automatique (brouillon)
- Confirmation de soumission avec le matricule de l'étudiant

#### 2.2.3 Tableau de Bord Étudiant
- Vue d'ensemble des requêtes soumises
- Statut en temps réel de chaque requête
- Historique des actions et communications
- Téléchargement des documents de réponse

### 2.3 Module de Gestion des Requêtes (Personnel)

#### 2.3.1 Tableau de Bord Administratif
- Liste des requêtes par statut (En attente, En cours, Terminées)
- Filtres avancés (date, type, priorité, étudiant)
- Recherche
- Vue détaillée de chaque requête
- Affectation et réaffectation des requêtes

#### 2.3.2 Traitement des Requêtes
- Changement de statut des réquettes
- Upload de documents de réponse
- Demande d'informations complémentaires
- Rejection avec motifs détaillés
- Validation finale avec signature électronique

### 2.4 Système de Suivi et Notifications

#### 2.4.1 Statuts des Requêtes
- **Soumise** : Requête nouvellement créée
- **En cours d'examen** : Prise en charge par un agent
- **Informations requises** : Attente de compléments de l'étudiant
- **En traitement** : Traitement en cours
- **Validée** : Approuvée, en attente de délivrance
- **Terminée** : Requête complètement traitée
- **Rejetée** : Refusée avec motifs

#### 2.4.2 Système de Notifications
- Notifications email automatiques
- Notifications in-app (dans l'application) en temps réel
- Rappels automatiques pour les délais

### 2.5 Communication Interne

#### 2.5.1 Messagerie Intégrée
- Chat en temps réel entre étudiants et agents
- Historique complet des conversations
- Partage de fichiers dans les messages
- Accusés de réception et de lecture
### 2.6 Génération de Rapports

#### 2.6.1 Rapports Disponibles
- Volume de requêtes par période
- Temps de traitement moyen par type
- Performance des agents
- Taux de satisfaction étudiante
- Requêtes en retard
- Statistiques par faculté/département

#### 2.6.2 Formats d'Export
- PDF pour les rapports formels
- Excel pour l'analyse de données

---

## 3. SPÉCIFICATIONS TECHNIQUES

### 3.1 Architecture Système

#### 3.1.1 Architecture Générale
- Architecture 3-tiers (Présentation, Logique métier, Données)
- API REST pour la communication client-serveur
- Architecture microservices recommandée pour la scalabilité

#### 3.1.2 Technologies Utilisées

**Frontend :**
- Framework : React.js
- UI Framework : Tailwind css

**Backend :**
- Langage : Node.js (Express)
- API : REST avec documentation Swagger
- Authentification : JWT tokens
- ORM : Mongoose

**Base de Données :**
- MongoDB

### 3.2 Base de Données

#### 3.2.1 Modèle de Données Principal
```
Utilisateurs (users)
- id, matricule, nom, prenom, email, telephone
- mot_de_passe_hash, role, faculte, departement
- date_creation, derniere_connexion, statut

Requêtes (requests)
- id, numero_reference, type_requete, titre
- description, priorite, statut, etudiant_id
- agent_assigne_id, date_creation, date_limite
- date_derniere_maj, documents_joints

Types_Requetes (request_types)
- id, nom, description, delai_standard
- documents_requis, formulaire_specifique

Historique_Statuts (status_history)
- id, requete_id, ancien_statut, nouveau_statut
- commentaire, agent_id, date_changement

Messages (messages)
- id, requete_id, expediteur_id, contenu
- fichiers_joints, date_envoi, lu

Documents (documents)
- id, nom_fichier, chemin, type_mime
- taille, requete_id, uploade_par, date_upload
```

### 3.3 Sécurité

#### 3.3.1 Mesures de Sécurité
- Chiffrement HTTPS obligatoire (SSL/TLS)
- Hashage sécurisé des mots de passe (bcrypt)
- Protection CSRF et XSS
- Validation et sanitisation des inputs
- Rate limiting sur les API
- Logging de sécurité complet
- Sauvegardes chiffrées

#### 3.3.2 Gestion des Accès
- Contrôle d'accès basé sur les rôles
- Session timeout configurable

### 3.4 Performance et Scalabilité

#### 3.4.1 Optimisations
- Pagination des listes longues
- Lazy loading des documents
- CDN pour les ressources statiques

---

## 4. CONTRAINTES ET EXIGENCES

### 4.1 Contraintes Techniques
- Compatible avec les navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Responsive design obligatoire
- Temps de réponse < 3 secondes
- Disponibilité 99.5% minimum
- Supporter plusieurs utilisateurs simultanés

---

## 5. LIVRABLES

### 5.1 Documentation
- Cahier des charges technique (ce document)

### 5.2 Code Source
- Le lien github

---

## 6. PLANNING ET PHASES

### Phase 1 : Analyse et Conception
- Analyse détaillée des besoins
- Conception de l'architecture
- Maquettage des interfaces

### Phase 2 : Développement 
- Développement de l'authentification
- Module de soumission des requêtes
- Interface de gestion pour le personnel
- API REST complète

### Phase 3 : Fonctionnalités Avancées
- Système de notifications
- Messagerie interne
- Génération de rapports
- Système de priorisation

### Phase 4 : Tests et Déploiement
- Tests fonctionnels complets
- Tests de performance et sécurité
- Formation des utilisateurs
- Déploiement en production

### Phase 5 : Maintenance et Support (Continue)
- Support technique
- Corrections de bugs
- Évolutions fonctionnelles
- Maintenance préventive

---

## 7. CRITÈRES D'ACCEPTATION

### 7.1 Fonctionnels
- Tous les types de requêtes peuvent être soumis
- Le système de notifications fonctionne correctement
- Les rapports sont générés avec précision
- La messagerie interne est opérationnelle
- Le système de priorisation est effectif

### 7.2 Techniques
- Performance : temps de réponse < 3 secondes
- Disponibilité : 99.5% minimum
- Sécurité : audit de sécurité réussi
- Compatibilité : tests sur tous les navigateurs cibles
- Responsive : fonctionnel sur mobile et tablette

### 7.3 Utilisabilité
- Interface intuitive validée par tests utilisateur
- Formation minimale requise pour l'utilisation
- Taux d'erreur utilisateur < 5%
- Satisfaction utilisateur > 80%

---

## 8. MAINTENANCE ET ÉVOLUTION

### 8.1 Maintenance Corrective
- Correction des bugs signalés
- Résolution des problèmes de performance
- Mises à jour de sécurité

### 8.2 Maintenance Évolutive
- Ajout de nouveaux types de requêtes
- Intégration avec d'autres systèmes universitaires
- Amélioration de l'interface utilisateur
- Nouvelles fonctionnalités selon les besoins

## 9. BUDGET ET RESSOURCES

### 9.1 Ressources Humaines
- Chef de projet
- Architecte technique
- Développeurs full-stack
- Designer UX/UI
- Testeur 

### 9.2 Infrastructure
- Serveur de production (spécifications selon charge)
- Serveur de développement/test
- Licences logicielles nécessaires
- Outils de développement et monitoring
- Hébergement et nom de domaine

### 9.3 Formation
- Formation des administrateurs système
- Formation du personnel utilisateur
- Formation des agents de support
- Documentation et guides utilisateur

---

*Ce cahier des charges technique constitue le référentiel pour le développement de l'application de gestion des requêtes étudiantes de l'Université de Maroua, Faculté des Sciences. Il devra être validé par toutes les parties prenantes avant le début du développement.*