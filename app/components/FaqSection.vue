<script setup lang="ts">
const asset = usePublicAsset()
const open = ref([false, false, false, false, false])
const toggle = (index: number) => { open.value[index] = !open.value[index] }
const expand = (element: Element) => {
  const el = element as HTMLElement
  el.style.height = '0'; el.style.overflow = 'hidden'
  requestAnimationFrame(() => { el.style.height = el.scrollHeight + 'px' })
}
const expanded = (element: Element) => {
  const el = element as HTMLElement
  el.style.height = ''
  el.style.overflow = ''
}
const collapse = (element: Element) => {
  const el = element as HTMLElement
  el.style.height = el.scrollHeight + 'px'
  void el.offsetHeight
  el.style.height = '0'
}
</script>

<template>
<section class="faq">
            <h1
                class="heading"
                style="margin-top: -2rem; color: #00bfff"
                id="faq"
            >
                FAQ
            </h1>
            <div class="row">
                <div class="accordion-container">
                    <div class="accordion">
                        <div class="accordion-header" :class="{ 'is-open': open[0] }" role="button" tabindex="0" :aria-expanded="open[0]" aria-controls="faq-answer-0" @click="toggle(0)" @keydown.enter.prevent="toggle(0)" @keydown.space.prevent="toggle(0)">
<span>{{ open[0] ? '−' : '+' }}</span>
<h3>What makes VitaRay different?</h3>
</div>
<Transition name="faq" @enter="expand" @after-enter="expanded" @leave="collapse"><div v-show="open[0]" id="faq-answer-0" class="accordion-body">
<p>
                                VitaRay is completely contactless — it uses radar, not wearables or cameras.
                                Our system uses mmWave radar and AI to monitor vital signs
                                and detect risks like falls or cognitive decline,
                                while preserving the user’s comfort and privacy.
                            </p>
                        </div></Transition>
                    </div>
                    <div class="accordion">
                        <div class="accordion-header" :class="{ 'is-open': open[1] }" role="button" tabindex="0" :aria-expanded="open[1]" aria-controls="faq-answer-1" @click="toggle(1)" @keydown.enter.prevent="toggle(1)" @keydown.space.prevent="toggle(1)">
<span>{{ open[1] ? '−' : '+' }}</span>
<h3>Is VitaRay suitable for use at home?</h3>
</div>
<Transition name="faq" @enter="expand" @after-enter="expanded" @leave="collapse"><div v-show="open[1]" id="faq-answer-1" class="accordion-body">
<p>
                                Yes. VitaRay is designed for both private homes and aged care facilities.
                                It’s easy to install, requires no ongoing input from the user,
                                and works in common living areas like bedrooms, bathrooms, and hallways.
                                Family members can receive real-time alerts and insights through a connected platform.
                            </p>
                        </div></Transition>
                    </div>
                    <div class="accordion">
                        <div class="accordion-header" :class="{ 'is-open': open[2] }" role="button" tabindex="0" :aria-expanded="open[2]" aria-controls="faq-answer-2" @click="toggle(2)" @keydown.enter.prevent="toggle(2)" @keydown.space.prevent="toggle(2)">
<span>{{ open[2] ? '−' : '+' }}</span>
<h3>How is user privacy protected?</h3>
</div>
<Transition name="faq" @enter="expand" @after-enter="expanded" @leave="collapse"><div v-show="open[2]" id="faq-answer-2" class="accordion-body">
<p>
                                VitaRay does not use cameras or audio — only radar-based sensing.
                                All data is processed with strict privacy protocols, and no personal
                                or visual information is captured. The system is designed to provide peace of
                                mind without compromising dignity.
                            </p>
                        </div></Transition>
                    </div>
                    <div class="accordion">
                        <div class="accordion-header" :class="{ 'is-open': open[3] }" role="button" tabindex="0" :aria-expanded="open[3]" aria-controls="faq-answer-3" @click="toggle(3)" @keydown.enter.prevent="toggle(3)" @keydown.space.prevent="toggle(3)">
<span>{{ open[3] ? '−' : '+' }}</span>
<h3>
                                What kind of setup is required?
                            </h3>
</div>
<Transition name="faq" @enter="expand" @after-enter="expanded" @leave="collapse"><div v-show="open[3]" id="faq-answer-3" class="accordion-body">
<p>
                                VitaRay is a plug-and-play system that can be installed by
                                trained staff or facility teams. We provide onboarding support, configuration guidance,
                                and integration with care teams or alert platforms if needed. Ongoing technical support is also available.

                            </p>
                        </div></Transition>
                    </div>
                    <div class="accordion">
                        <div class="accordion-header" :class="{ 'is-open': open[4] }" role="button" tabindex="0" :aria-expanded="open[4]" aria-controls="faq-answer-4" @click="toggle(4)" @keydown.enter.prevent="toggle(4)" @keydown.space.prevent="toggle(4)">
<span>{{ open[4] ? '−' : '+' }}</span>
<h3>Can we join your pilot program or clinical trial?</h3>
</div>
<Transition name="faq" @enter="expand" @after-enter="expanded" @leave="collapse"><div v-show="open[4]" id="faq-answer-4" class="accordion-body">
<p>
                                Yes — we are currently designing our clinical study and
                                welcoming expressions of interest from individuals,
                                families, and aged care providers.
                                Please <a href="https://forms.gle/fXwqWVgDhsX5gEK9A">contact us</a> to learn more about participation options.
                            </p>
                        </div></Transition>
                    </div>
                </div>
            </div>
        </section>
</template>
