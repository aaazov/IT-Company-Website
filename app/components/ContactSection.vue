<script setup lang="ts">
const asset = usePublicAsset()
const config = useRuntimeConfig()
const form = reactive({ name: '', phone: '', email: '', message: '' })
const sending = ref(false)
const status = ref('')
let messageTimer: ReturnType<typeof setTimeout> | undefined
onBeforeUnmount(() => clearTimeout(messageTimer))
async function submit(event: Event) {
  const element = event.target as HTMLFormElement
  if (sending.value || !element.reportValidity()) return
  clearTimeout(messageTimer)
  if (!config.public.contactEndpoint) {
    status.value = 'Error submitting the form. Please try again.'
    return
  }
  sending.value = true
  status.value = ''
  try {
    const response = await fetch(config.public.contactEndpoint, { method: 'POST', body: JSON.stringify({ ...form }) })
    if (!response.ok) throw new Error('Submission failed')
    const data = await response.json()
    if (data.status === 'success') {
      status.value = 'Thank you! Your message has been sent.'
      Object.assign(form, { name: '', phone: '', email: '', message: '' })
    } else {
      status.value = 'Submission Failed:  ' + (data.error || 'Please try again.')
    }
  } catch {
    status.value = 'Error submitting the form. Please try again.'
  } finally {
    sending.value = false
    messageTimer = setTimeout(() => { status.value = '' }, 5000)
  }
}
</script>

<template>
<section id="contact" class="contact">
            <h1 class="heading">Get In Touch</h1>
        </section>
        <div class="contact-in">
            <div class="contact-form">
                <form id="contact-form" @submit.prevent="submit">
                    <input
                        type="text"
                        name="name" v-model="form.name" aria-label="Name"
                        placeholder="Name"
                        class="contact-form-txt"
                        required
                    />
                    <input
                        type="tel"
                        id="phone"
                        name="phone" v-model="form.phone" aria-label="Phone"
                        pattern="[0-9]{10}"
                        required
                        placeholder="Phone number"
                        maxlength="11"
                        class="contact-form-phone"
                    />
                    <input
                        type="email"
                        name="email" v-model="form.email" aria-label="Email"
                        placeholder="Email"
                        class="contact-form-email"
                        pattern="^[^@]+@[^@]+\.[^@]+$"
                    />
                    <textarea
                        placeholder="Your Message"
                        name="message" v-model="form.message" aria-label="Your message"
                        class="contact-form-txtarea"
                        required
                    ></textarea>
                    <button
                        type="submit"
                        class="contact-form-btn" :disabled="sending"
                    >{{ sending ? 'Sending...' : 'Submit' }}</button>
                </form>
                <p id="response-message" role="status" aria-live="polite">{{ status }}</p>
            </div>
        </div>
</template>
