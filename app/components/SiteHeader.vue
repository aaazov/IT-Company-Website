<script setup lang="ts">
const asset = usePublicAsset()
const menuOpen = ref(false)
const scrolled = ref(false)
onMounted(() => {
  const update = () => { scrolled.value = window.scrollY > 600; menuOpen.value = false }
  update()
  window.addEventListener('scroll', update, { passive: true })
  onBeforeUnmount(() => window.removeEventListener('scroll', update))
})
</script>

<template>
<header class="header" :style="scrolled ? { background: '#002e5f', boxShadow: '0 .2rem .5rem rgba(0,0,0,.4)' } : {}" data-scroll-threshold="600">
            <a href="#" class="logo"><img :src="asset('images/logo-white.PNG')" alt="vitaRay logo" /></a>
            <div class="fas fa-bars" :class="{ 'fa-times': menuOpen }" role="button" tabindex="0" aria-label="Toggle navigation" :aria-expanded="menuOpen" aria-controls="main-navigation" @click="menuOpen = !menuOpen" @keydown.enter.prevent="menuOpen = !menuOpen" @keydown.space.prevent="menuOpen = !menuOpen"></div>
            <nav id="main-navigation" class="navbar" :class="{ 'nav-toggle': menuOpen }" @click="menuOpen = false">
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#product">Product</a></li>
                    <li><a href="#scenario">Scenario</a></li>
                    <li><a href="#team">Team</a></li>
                    <li><a href="#contact">Contact</a></li>
                    <li><a href="#faq">FAQ</a></li>

                </ul>
            </nav>
        </header>
</template>
