<script setup>
import { ref, computed } from 'vue'
import { captionMeme, downloadImage, captionCustomImage, saveCreatedMeme } from '../services/memeService'

const props = defineProps({
  selectedMeme: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const memeTexts = ref({})
const generatedMemeUrl = ref(null)
const isGenerating = ref(false)
const error = ref(null)
const customImage = ref(null)
const customImagePreview = ref(null)
const imageInput = ref(null)

const boxCount = computed(() => {
  return props.selectedMeme?.box_count || 2
})

const canGenerate = computed(() => {
  return Object.values(memeTexts.value).some(text => text?.trim())
})

const onImageSelected = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    error.value = 'Veuillez sélectionner une image valide'
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    error.value = 'L\'image doit faire moins de 5MB'
    return
  }

  customImage.value = file
  error.value = null

  const reader = new FileReader()
  reader.onload = (e) => {
    customImagePreview.value = e.target?.result
  }
  reader.readAsDataURL(file)
}

const clearCustomImage = () => {
  customImage.value = null
  customImagePreview.value = null
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const generateMeme = async () => {
  if (!canGenerate.value) return
  
  isGenerating.value = true
  error.value = null
  
  try {
    let result
    
    const textsArray = Object.values(memeTexts.value)
    
    if (customImage.value) {
      console.log('Génération avec image personnalisée')
      result = await captionCustomImage(
        customImage.value,
        memeTexts.value[0] || '',
        memeTexts.value[1] || ''
      )
    } else {
      console.log('Template sélectionné:', props.selectedMeme)
      console.log('Textes:', textsArray)
      
      result = await captionMeme(
        props.selectedMeme.id,
        textsArray
      )
    }
    
    generatedMemeUrl.value = result.url
    console.log('Meme généré:', result.url)
    saveCreatedMeme(result.url)
  } catch (err) {
    console.error('Erreur complète:', err)
    error.value = err.message || 'Erreur lors de la génération'
  } finally {
    isGenerating.value = false
  }
}

const handleDownload = async () => {
  if (!generatedMemeUrl.value) return
  
  try {
    const filename = `meme-${Date.now()}.jpg`
    await downloadImage(generatedMemeUrl.value, filename)
  } catch (err) {
    error.value = 'Erreur lors du téléchargement'
  }
}

const reset = () => {
  memeTexts.value = {}
  generatedMemeUrl.value = null
  error.value = null
  clearCustomImage()
}
</script>

<template>
  <div class="meme-generator">
    <div class="generator-header">
      <h2> Créer votre Meme</h2>
      <button @click="emit('close')" class="btn-close">✕</button>
    </div>

    <div class="generator-content">
      <div class="template-info">
        <h3>{{ selectedMeme.name }}</h3>
        <img 
          :src="generatedMemeUrl || customImagePreview || selectedMeme.url" 
          :alt="selectedMeme.name"
          class="template-preview"
        />
        
        <div class="custom-image-section">
          <label class="upload-label">
            <span class="upload-button">📤 Importer une photo</span>
            <input
              ref="imageInput"
              type="file"
              accept="image/*"
              @change="onImageSelected"
              style="display: none"
            />
          </label>
          
          <div v-if="customImage" class="custom-image-info">
            <p class="image-name">📸 {{ customImage.name }}</p>
            <button @click="clearCustomImage" class="btn-clear-image">Supprimer l'image</button>
          </div>
        </div>
      </div>

      <div class="meme-form">
        <div v-for="index in boxCount" :key="index" class="form-group">
          <label :for="`text${index - 1}`">
            <span v-if="index === 1">Texte du haut</span>
            <span v-else-if="index === boxCount">Texte du bas</span>
            <span v-else>Texte {{ index }}</span>
          </label>
          <input
            :id="`text${index - 1}`"
            v-model="memeTexts[index - 1]"
            type="text"
            :placeholder="`Entrez le texte ${index}...`"
            maxlength="100"
            @keyup.enter="generateMeme"
          />
        </div>

        <div v-if="error" class="error-alert">
           {{ error }}
        </div>

        <div class="form-actions">
          <button
            @click="generateMeme"
            :disabled="!canGenerate || isGenerating"
            class="btn btn-generate"
          >
            <span v-if="isGenerating">Génération...</span>
            <span v-else> Générer</span>
          </button>

          <button
            v-if="generatedMemeUrl"
            @click="handleDownload"
            class="btn btn-download"
          >
             Télécharger
          </button>

          <button
            v-if="generatedMemeUrl"
            @click="reset"
            class="btn btn-reset"
          >
             Recommencer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.meme-generator {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 25px;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.generator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.generator-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #fff;
}

.btn-close {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: rgba(255, 0, 0, 0.3);
  transform: rotate(90deg);
}

.generator-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

@media (max-width: 768px) {
  .generator-content {
    grid-template-columns: 1fr;
  }
}

.template-info {
  text-align: center;
}

.template-info h3 {
  margin: 0 0 15px 0;
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
}

.template-preview {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.custom-image-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.upload-label {
  cursor: pointer;
  display: inline-block;
  width: 100%;
}

.upload-button {
  display: inline-block;
  padding: 10px 20px;
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  border-radius: 8px;
  font-weight: bold;
  transition: all 0.3s ease;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.upload-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(76, 175, 80, 0.4);
}

.custom-image-info {
  margin-top: 15px;
  padding: 10px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.image-name {
  margin: 0 0 10px 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  word-break: break-all;
}

.btn-clear-image {
  width: 100%;
  padding: 8px;
  background: rgba(255, 100, 100, 0.2);
  border: 1px solid rgba(255, 100, 100, 0.5);
  color: #ff6464;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-clear-image:hover {
  background: rgba(255, 100, 100, 0.3);
}

.meme-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

.form-group input {
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #ff6b35;
  background: rgba(255, 255, 255, 0.1);
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.error-alert {
  padding: 12px;
  background: rgba(255, 0, 0, 0.1);
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 8px;
  color: #ff6b6b;
  text-align: center;
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.btn {
  flex: 1;
  min-width: 140px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-generate {
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  color: white;
}

.btn-generate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 107, 53, 0.4);
}

.btn-generate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-download {
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
}

.btn-download:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(76, 175, 80, 0.4);
}

.btn-reset {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.btn-reset:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
</style>
