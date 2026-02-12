<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  memes: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['select-meme'])

const searchQuery = ref('')

const filteredMemes = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.memes
  }
  return props.memes.filter(meme =>
    meme.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<template>
  <div class="meme-gallery">
    <h2 class="gallery-title">Choisissez un Template</h2>
    
    <!-- Filtre de recherche -->
    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 Rechercher un meme par nom..."
        class="search-input"
      />
      <span v-if="searchQuery" class="search-results">{{ filteredMemes.length }} résultat(s)</span>
    </div>

    <!-- Message quand aucun résultat -->
    <div v-if="searchQuery && filteredMemes.length === 0" class="no-results">
      Aucun meme trouvé pour "{{ searchQuery }}"
    </div>

    <!-- Galerie -->
    <div class="gallery-grid">
      <div
        v-for="meme in filteredMemes"
        :key="meme.id"
        class="gallery-item"
        @click="emit('select-meme', meme)"
      >
        <img 
          :src="meme.url" 
          :alt="meme.name"
          class="gallery-image"
          loading="lazy"
        />
        <div class="gallery-overlay">
          <span class="gallery-name">{{ meme.name }}</span>
          <span class="gallery-action">Créer</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.meme-gallery {
  padding: 20px 0;
}

.gallery-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  color: #fff;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.search-input {
  padding: 12px 18px;
  width: 100%;
  max-width: 400px;
  border: 2px solid rgba(255, 107, 53, 0.5);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #ff6b35;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 10px rgba(255, 107, 53, 0.3);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search-results {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  white-space: nowrap;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.1rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 0 10px;
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }

  .search-container {
    flex-direction: column;
    gap: 10px;
  }

  .search-input {
    max-width: 100%;
  }

  .search-results {
    width: 100%;
    text-align: center;
  }
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.gallery-item:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.4);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  padding: 15px 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.gallery-name {
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
  text-align: center;
}

.gallery-action {
  font-size: 0.85rem;
  color: #ff6b35;
  text-align: center;
  font-weight: bold;
}
</style>
