# 🚬 HumiTrack

Une application moderne de gestion de collection de cigares avec interface élégante et fonctionnalités avancées.

## ✨ Fonctionnalités

- **🎯 Humidor Intelligent** : Gestion complète de votre collection de cigares
- **📊 Tableau de Bord Insights** : Graphiques interactifs de votre collection
- **🔍 Découverte** : Explorez de nouveaux cigares
- **💝 Wishlist** : Liste de souhaits personnalisée
- **📝 Notes de Dégustation** : Enregistrez vos expériences
- **🏷️ Tags Personnalisés** : Organisez votre collection
- **📱 Interface Responsive** : Optimisé mobile et desktop
- **☁️ Synchronisation Cloud** : Données sauvegardées sur Supabase

## 🛠️ Technologies

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS + Framer Motion
- **Graphiques** : Recharts + Chart.js
- **Backend** : Supabase (PostgreSQL + Auth)
- **Déploiement** : Vercel

## 🚀 Déploiement Rapide

### Prérequis
- Node.js 18+
- Compte Supabase
- Compte Vercel

### Installation Locale

```bash
# Cloner le repository
git clone https://github.com/votre-username/humitrack.git
cd humitrack

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase

# Lancer en développement
npm run dev
```

### Variables d'Environnement

Créez un fichier `.env` avec :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase
```

## 📊 Base de Données

L'application utilise Supabase avec les tables suivantes :
- `cigars` : Collection de cigares
- `tasting_notes` : Notes de dégustation
- `user_tags` : Tags personnalisés
- `auth.users` : Authentification

## 🎨 Design

- **Palette** : Tons ambrés et dorés
- **Typographie** : Moderne et lisible
- **Animations** : Fluides avec Framer Motion
- **Responsive** : Mobile-first design

## 📱 Fonctionnalités Principales

### Humidor
- Ajout/suppression de cigares
- Gestion des quantités
- Alertes de stock faible
- Photos et détails complets

### Insights
- Graphiques par pays d'origine
- Répartition par force
- Top 10 des marques
- Statistiques en temps réel

### Découverte
- Catalogue de 450+ cigares
- Filtres avancés
- Ajout rapide à la wishlist

## 🔧 Scripts Disponibles

```bash
npm run dev      # Développement local
npm run build    # Build de production
npm run preview  # Prévisualisation build
npm run lint     # Vérification code
```

## 🌐 Déploiement

### Vercel (Recommandé)

1. **Connecter GitHub** :
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez votre compte GitHub
   - Importez le repository

2. **Configurer les variables** :
   - Dans les paramètres du projet Vercel
   - Ajoutez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

3. **Déployer** :
   - Vercel détecte automatiquement Vite
   - Déploiement automatique à chaque push

### GitHub Pages (Alternative)

```bash
# Installer gh-pages
npm install --save-dev gh-pages

# Ajouter au package.json
"homepage": "https://votre-username.github.io/humitrack",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Déployer
npm run deploy
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [Supabase](https://supabase.com) pour l'infrastructure backend
- [Vercel](https://vercel.com) pour l'hébergement
- [Tailwind CSS](https://tailwindcss.com) pour le styling
- [Framer Motion](https://framer.com/motion) pour les animations

---

**HumiTrack** - Votre compagnon digital pour la gestion de collection de cigares premium 🚬✨ 