<script setup lang="ts">
const asset = usePublicAsset()
const position = ref(6)
const index = computed(() => position.value % 6)
const items = ref(2)
const dragging = ref(false)
const animating = ref(true)
const moving = ref(false)
let startX = 0
let timer: ReturnType<typeof setInterval> | undefined
const images = ['scenario-1.png', 'scenario-2.png', 'scenario-3.png', 'scenario-4.png', 'scenario-5.png', 'scenario-6.png']
const slides = [...images, ...images, ...images]
function advance(direction = 1) {
  if (moving.value) return
  moving.value = true
  position.value += direction
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finishMove()
}
function finishMove() {
  if (position.value >= 12 || position.value < 6) {
    animating.value = false
    position.value = 6 + (position.value % 6)
    requestAnimationFrame(() => requestAnimationFrame(() => { animating.value = true }))
  }
  moving.value = false
}
function select(value: number) { position.value = 6 + value; moving.value = false }
function pause() { clearInterval(timer) }
function play() {
  pause()
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(advance, 5000)
}
function pointerDown(event: PointerEvent) {
  if ((event.target as HTMLElement).closest('button')) return
  startX = event.clientX
  dragging.value = true
  pause()
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}
function pointerUp(event: PointerEvent) {
  if (!dragging.value) return
  const distance = event.clientX - startX
  if (Math.abs(distance) > 35) advance(distance < 0 ? 1 : -1)
  dragging.value = false
  play()
}
onMounted(() => {
  const resize = () => { items.value = window.innerWidth >= 900 ? 6 : window.innerWidth >= 768 ? 4 : 2 }
  resize()
  play()
  window.addEventListener('resize', resize)
  onBeforeUnmount(() => { pause(); window.removeEventListener('resize', resize) })
})
</script>

<template>
  <div class="pt-5 pb-5">
    <div class="container">
      <div class="row">
        <div class="section-head-1 col-sm-12" style="text-align: center">
          <h4 id="scenario" style="margin-top: -5rem"><span>Our Scenarios</span></h4>
          <p>VitaRay is designed to support a wide range of care environments — from private homes to residential aged care — wherever discreet, continuous health monitoring is needed.</p>
        </div>
      </div>
      <div class="owl-carousel clients-carousel scenario-carousel owl-loaded owl-drag" role="region" aria-label="Care environment scenarios" tabindex="0" @mouseenter="pause" @mouseleave="play" @focusin="pause" @focusout="play" @keydown.left.prevent="advance(-1)" @keydown.right.prevent="advance(1)" @pointerdown="pointerDown" @pointerup="pointerUp" @pointercancel="dragging = false; play()">
        <div class="owl-stage-outer">
          <div class="scenario-track" :style="{ '--slide-position': position, transition: animating ? undefined : 'none' }" @transitionend.self="finishMove">
            <div v-for="(image, offset) in slides" :key="offset" class="owl-item" :class="{ active: offset >= position && offset < position + items }" :aria-hidden="offset < position || offset >= position + items">
              <img :src="asset('images/' + image)" alt="Client Logo" draggable="false" />
            </div>
          </div>
        </div>
        <div class="owl-dots" aria-label="Choose scenario">
          <button v-for="(_, offset) in images" :key="offset" type="button" class="owl-dot" :class="{ active: index === offset }" :aria-label="'Show scenario ' + (offset + 1)" :aria-pressed="index === offset" @click="select(offset)"><span></span></button>
        </div>
      </div>
    </div>
  </div>
</template>
