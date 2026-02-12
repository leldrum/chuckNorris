import { ref, onMounted } from 'vue'
import { fetchMemes as fetchMemesService, getRandomMeme } from '../services/memeService'

export const useMemes = () => {
  const memes = ref([])
  const currentMeme = ref(null)

  const loadMemes = async () => {
    try {
      memes.value = await fetchMemesService()
      selectRandomMeme()
    } catch (err) {
      console.error('Erreur lors du chargement des memes:', err)
    }
  }

  const selectRandomMeme = () => {
    currentMeme.value = getRandomMeme(memes.value)
  }

  onMounted(loadMemes)

  return {
    memes,
    currentMeme,
    selectRandomMeme,
    loadMemes
  }
}
