<script setup lang="ts">
const asset = usePublicAsset()
// Preserve the original cascade: the local Bootstrap 4.2.1 stylesheet is last.
useHead({
  link: [
    { rel: 'stylesheet', href: asset('css/style.css') },
    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css' },
    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css' },
    { rel: 'icon', type: 'image/svg+xml', href: asset('images/favicon-v.svg') },
    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.min.css' },
    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css' },
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css' },
    { rel: 'stylesheet', href: asset('lib/bootstrap/css/bootstrap.min.css') },
    { rel: 'stylesheet', href: asset('lib/ionicons/css/ionicons.min.css') },
    { rel: 'stylesheet', href: asset('lib/owlcarousel/assets/owl.carousel.min.css') },
    { rel: 'stylesheet', href: asset('css/nuxt.css') },
  ],
})
</script>

<template>
  <SiteHeader />
  <HomeIntro />
  <HealthSignals />
  <ScenarioCarousel />
  <CompanyStory />
  <TeamSection />
  <ContactSection />
  <FaqSection />
  <SiteFooter />
  <SurveyInvitation />
  <BackToTop />
</template>
