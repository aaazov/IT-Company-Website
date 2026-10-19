<script setup lang="ts">
const visible = ref(false)
onMounted(() => {
  const update = () => { visible.value = window.scrollY > 100 }
  update()
  window.addEventListener('scroll', update, { passive: true })
  onBeforeUnmount(() => window.removeEventListener('scroll', update))
})
function goToTop() {
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}
</script>

<template>
  <a href="#" class="back-to-top" :style="{ display: visible ? 'block' : 'none' }" aria-label="Back to top" @click.prevent="goToTop"><i class="ion-ios-arrow-up"></i></a>
</template>
