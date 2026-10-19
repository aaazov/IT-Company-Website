<script setup lang="ts">
const asset = usePublicAsset()
const { popup, visible, hidden, dismiss } = useSurveyInvitation()
</script>

<template>
<aside ref="popup" class="contact-popover" :class="{ 'is-visible': visible }" :hidden="hidden" :inert="!visible" :aria-hidden="!visible" aria-labelledby="contact-popover-title">
            <div class="contact-popover-header">
                <svg class="contact-popover-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M21 11.5a9 9 0 0 1-13.3 7.9L3 21l1.6-4.7A9 9 0 1 1 21 11.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                </svg>
                <h2 id="contact-popover-title">Help Shape VitaRay</h2>
                <button type="button" class="contact-popover-close" aria-label="Close survey invitation" @click="dismiss">&times;</button>
            </div>
            <p class="contact-popover-body">Your thoughts could help us design better monitoring for older adults.</p>
            <div class="contact-popover-actions">
                <span class="contact-popover-time">About 5 minutes</span>
                <a class="contact-popover-feedback" @click="dismiss" @auxclick.middle="dismiss" href="https://docs.google.com/forms/d/e/1FAIpQLSexLzbMZUh8XRcB74q_75m5TvK0zzS0o6m3AmigOjda5j25-A/viewform?usp=header" target="_blank" rel="noopener noreferrer">Share Feedback <span aria-hidden="true">→</span></a>
            </div>
        </aside>
</template>
