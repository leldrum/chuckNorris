# 🔥 Générateur de Memes

Une application Vue 3 pour créer, éditer et gérer des memes à partir de templates ou d'images personnalisées.

## 🚀 Fonctionnalités

- 🎲 **Mode Aléatoire** : Découvrez des memes aléatoires
- 🎭 **Galerie** : Parcourez et recherchez tous les templates de memes disponibles
- 🔍 **Recherche** : Filtrez les memes par nom
- ✏️ **Création** : Créez des memes avec des templates ou vos propres images
- 📸 **Import Photo** : Téléchargez votre propre image et créez un meme
- 📝 **Textes Dynamiques** : Le nombre de champs de texte s'adapte au template
- 📥 **Téléchargement** : Sauvegardez vos créations
- 💾 **Galerie Personnelle** : Stockez vos memes créés localement

## 📋 Prérequis

- Node.js `^20.19.0 || >=22.12.0`
- npm ou yarn

## 🛠️ Installation

```bash
cd chuck-norris-app
npm install
```

## 🚀 Démarrage

### Développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

### Production

```bash
npm run build
npm run preview
```

## 📦 Déploiement sur GitHub Pages

### Configuration automatique avec GitHub Actions

1. Assurez-vous que votre repository est public
2. Allez dans Settings → Pages
3. Sélectionnez "Deploy from a branch"
4. Choisissez la branche `gh-pages` comme source

Le workflow GitHub Actions déploiera automatiquement votre app à chaque push sur `main`.

### Déploiement manuel

```bash
npm run deploy
```

L'application sera accessible à : `https://leldrum.github.io/chuckNorris/`

## 🏗️ Architecture

```
src/
├── components/
│   ├── MemeGenerator.vue      # Créateur de memes
│   ├── MemeCard.vue            # Carte de meme
│   ├── MemeGallery.vue         # Galerie avec recherche
│   └── CreatedMemesGallery.vue # Galerie personnelle
├── composables/
│   └── useMemes.js             # Logique memes
├── services/
│   └── memeService.js          # API Imgflip
├── App.vue                     # App principale
└── main.js                     # Point d'entrée
```

## 🔌 API utilisée

- **Imgflip API** : Génération et templates de memes

## 📝 Licence

MIT
