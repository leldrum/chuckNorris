<script setup>
import { ref, onMounted } from 'vue'
import { getCreatedMemes, deleteCreatedMeme, clearAllCreatedMemes, downloadImage } from '../services/memeService'

const createdMemes = ref([])

const loadMemes = () => {
  createdMemes.value = getCreatedMemes()
}

const deleteMeme = (memeId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce mème ?')) {
    deleteCreatedMeme(memeId)
    loadMemes()
  }
}

const clearAll = () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer tous les mèmes créés ?')) {
    clearAllCreatedMemes()
    loadMemes()
  }
}

const downloadMeme = async (memeUrl) => {
  try {
    const filename = `meme-${Date.now()}.jpg`
    await downloadImage(memeUrl, filename)
  } catch (err) {
    alert('Erreur lors du téléchargement')
  }
}

onMounted(loadMemes)
</script>

<template>
  <div class="created-memes">
    <h2>Mes Mèmes Créés</h2>
    
    <div v-if="createdMemes.length === 0" class="empty-state">
      <p>Aucun mème créé pour le moment</p>
    </div>
    
    <div v-else>
      <div class="memes-grid">
        <div v-for="meme in createdMemes" :key="meme.id" class="meme-item">
          <img :src="meme.url" :alt="meme.id" class="meme-image" />
          <div class="meme-actions">
            <button @click="downloadMeme(meme.url)" class="btn-action btn-download">
               Télécharger
            </button>
            <button @click="deleteMeme(meme.id)" class="btn-action btn-delete">
               Supprimer
            </button>
          </div>
        </div>
      </div>
      
      <div class="gallery-footer">
        <button @click="clearAll" class="btn-clear-all">
          Supprimer tous les mèmes
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.created-memes {
  padding: 20px 0;
}

.created-memes h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  color: #fff;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2rem;
}

.memes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 0 10px;
  margin-bottom: 30px;
}

.meme-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.meme-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.meme-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  padding: 10px;
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.meme-item:hover .meme-actions {
  opacity: 1;
}

.btn-action {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-download {
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
}

.btn-download:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.4);
}

.btn-delete {
  background: rgba(255, 100, 100, 0.2);
  color: #ff6464;
  border: 1px solid rgba(255, 100, 100, 0.5);
}

.btn-delete:hover {
  background: rgba(255, 100, 100, 0.3);
}

.gallery-footer {
  text-align: center;
}

.btn-clear-all {
  padding: 12px 30px;
  background: rgba(255, 100, 100, 0.2);
  border: 2px solid rgba(255, 100, 100, 0.5);
  color: #ff6464;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-clear-all:hover {
  background: rgba(255, 100, 100, 0.3);
  box-shadow: 0 4px 8px rgba(255, 100, 100, 0.2);
}
</style>
