<script setup>
import { ref } from 'vue'
import { useMemes } from './composables/useMemes'
import MemeCard from './components/MemeCard.vue'
import MemeGenerator from './components/MemeGenerator.vue'
import MemeGallery from './components/MemeGallery.vue'
import CreatedMemesGallery from './components/CreatedMemesGallery.vue'

const { memes, currentMeme, selectRandomMeme } = useMemes()

const viewMode = ref('random')
const selectedMemeForGeneration = ref(null)

const openGallery = () => {
  viewMode.value = 'gallery'
}

const openGenerator = (meme) => {
  selectedMemeForGeneration.value = meme || currentMeme.value
  viewMode.value = 'generator'
}

const closeGenerator = () => {
  viewMode.value = 'random'
  selectedMemeForGeneration.value = null
}

const selectMemeFromGallery = (meme) => {
  openGenerator(meme)
}
</script>

<template>
  <div class="app">
    <div class="container">
      <header class="header">
        <h1 class="title">🔥 Générateur de Memes</h1>
        <p class="subtitle">Découvrez et créez les meilleurs memes</p>
      </header>

      <nav class="nav-tabs">
        <button 
          @click="viewMode = 'random'" 
          :class="['tab', { active: viewMode === 'random' }]"
        >
           Aléatoire
        </button>
        <button 
          @click="openGallery" 
          :class="['tab', { active: viewMode === 'gallery' }]"
        >
           Galerie
        </button>
        <button 
          @click="viewMode = 'created'" 
          :class="['tab', { active: viewMode === 'created' }]"
        >
           Mes Créations
        </button>
      </nav>

      <main class="main-content">
        <MemeGenerator 
          v-if="viewMode === 'generator' && selectedMemeForGeneration"
          :selected-meme="selectedMemeForGeneration"
          @close="closeGenerator"
        />

        <MemeGallery
          v-else-if="viewMode === 'gallery'"
          :memes="memes"
          @select-meme="selectMemeFromGallery"
        />

        <CreatedMemesGallery 
          v-else-if="viewMode === 'created'"
        />

        <div v-else-if="viewMode === 'random' && currentMeme" class="random-view">
          <MemeCard :meme="currentMeme" />
          
          <div class="actions">
            <button @click="selectRandomMeme" class="btn btn-primary">
               Meme aléatoire
            </button>
            <button @click="openGenerator(currentMeme)" class="btn btn-create">
               Créer ce meme
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
}

.nav-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.tab {
  padding: 12px 30px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.tab.active {
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
}

.main-content {
  min-height: 400px;
}

.random-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
}

.btn {
  padding: 12px 24px;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.btn-primary {
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 107, 53, 0.4);
}

.btn-create {
  background: linear-gradient(45deg, #9b59b6, #8e44ad);
  color: white;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(155, 89, 182, 0.4);
}

.btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>
