<script setup>
defineProps({
  meme: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && value.name && value.url
    }
  }
})
</script>

<template>
  <div class="meme-card">
    <h3 class="meme-card__title">{{ meme.name }}</h3>
    <img 
      :src="meme.url" 
      :alt="meme.name" 
      class="meme-card__image"
      loading="lazy"
    />
  </div>
</template>

<style scoped>
.meme-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.meme-card__title {
  margin: 0 0 15px 0;
  font-size: 1.5rem;
  color: #fff;
}

.meme-card__image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  display: block;
  margin: 0 auto;
}
</style>
