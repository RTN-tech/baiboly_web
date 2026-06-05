<script setup>
import { useRouter } from 'vue-router'
import { useLanguage } from '../composables/useLanguage.js'
import { ref, onMounted } from 'vue'

const router = useRouter()
const { t } = useLanguage()
const mounted = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

const APP_VERSION = '1.0.0'
const CREATOR_NAME = 'RAKOTOARIMANANA Tsiriniaina'
const CREATOR_PHONE = '0344788311'
const CREATOR_EMAIL = 'tsiriniainartn@gmail.com'

const socialLinks = [
  {
    name: 'WhatsApp',
    url: 'https://wa.me/261344788311',
    icon: 'whatsapp'
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/tsiriniaina.rakotoarimanana',
    icon: 'facebook'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/tsiriniaina-rakotoarimanana-88337a202/',
    icon: 'linkedin'
  }
]

const whatsappIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`

const facebookIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`

const linkedinIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`

const icons = { whatsapp: whatsappIcon, facebook: facebookIcon, linkedin: linkedinIcon }
</script>

<template>
  <div class="about-page">
    <!-- Top bar -->
    <nav class="about-nav">
      <button class="about-back-btn" @click="router.push('/')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        <span>{{ t('app.info.back') }}</span>
      </button>
    </nav>

    <div class="about-content">
      <!-- App icon + name -->
      <div class="about-hero" :class="{ 'anim-visible': mounted }">
        <div class="about-icon-wrap">
          <svg width="64" height="64" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="192" height="192" rx="42" fill="var(--bg-toggle)"/>
            <g transform="translate(48, 36)" stroke="var(--color-toggle)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 120A12 12 0 0 1 20 108H88V8H20A12 12 0 0 0 8 20v100z" fill="none"/>
              <path d="M88 8h24v112H20A12 12 0 0 0 8 120" fill="none"/>
              <line x1="28" y1="40" x2="72" y2="40"/>
              <line x1="28" y1="60" x2="64" y2="60"/>
              <line x1="28" y1="80" x2="56" y2="80"/>
            </g>
          </svg>
        </div>
        <h1 class="about-title">{{ t('app.name') }}</h1>
        <span class="about-badge">v{{ APP_VERSION }}</span>
        <p class="about-subtitle">{{ t('app.subtitle') }}</p>
      </div>

      <!-- Description card -->
      <div class="about-card anim-card" :class="{ 'anim-visible': mounted }" style="animation-delay: 0.15s">
        <h2 class="about-card-title">{{ t('app.info.about') }}</h2>
        <p class="about-desc">{{ t('app.info.description') }}</p>
      </div>

      <!-- Tech stack card -->
      <!-- <div class="about-card about-card-tech">
        <h2 class="about-card-title">{{ t('app.info.tech') }}</h2>
        <div class="about-tech">
          <span class="tech-chip"><span class="chip-dot"></span>Vue.js 3</span>
          <span class="tech-chip"><span class="chip-dot"></span>Vite</span>
          <span class="tech-chip"><span class="chip-dot"></span>PWA</span>
          <span class="tech-chip"><span class="chip-dot"></span>IndexedDB</span>
          <span class="tech-chip"><span class="chip-dot"></span>Service Worker</span>
          <span class="tech-chip"><span class="chip-dot"></span>CSS3</span>
        </div>
      </div> -->

      <!-- Creator card -->
      <div class="about-card anim-card" :class="{ 'anim-visible': mounted }" style="animation-delay: 0.45s">
        <h2 class="about-card-title">{{ t('app.info.creator') }}</h2>
        <div class="about-creator-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="about-row-icon">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>{{ CREATOR_NAME }}</span>
        </div>
        <a :href="`tel:${CREATOR_PHONE}`" class="about-creator-row about-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="about-row-icon">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span>{{ CREATOR_PHONE }}</span>
        </a>
        <a :href="`mailto:${CREATOR_EMAIL}`" class="about-creator-row about-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="about-row-icon">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <span>{{ CREATOR_EMAIL }}</span>
        </a>
      </div>

      <!-- Social links card -->
      <div class="about-card anim-card" :class="{ 'anim-visible': mounted }" style="animation-delay: 0.6s">
        <h2 class="about-card-title">{{ t('app.info.social') }}</h2>
        <div class="about-socials">
          <a
            v-for="social in socialLinks"
            :key="social.name"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="about-social-btn"
          >
            <span class="social-icon" v-html="icons[social.icon]"></span>
            <span class="social-label">{{ social.name }}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="social-external">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Footer -->
      <p class="about-footer anim-footer" :class="{ 'anim-visible': mounted }" style="animation-delay: 0.75s">{{ t('app.name') }} &mdash; {{ t('app.info.version') }} {{ APP_VERSION }}</p>
    </div>
  </div>
</template>

<style scoped>
/* ==========================================
   KEYFRAMES — FADE & SLIDE UP
   ========================================== */

@keyframes aboutFadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes aboutZoomIn {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Hero fades & zooms in first */
.about-hero {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.about-hero.anim-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Cards slide up with stagger */
.anim-card {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.anim-card.anim-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Footer fades in */
.anim-footer {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.anim-footer.anim-visible {
  opacity: 1;
}

/* ===== PAGE LAYOUT ===== */
.about-page {
  min-height: 100vh;
  background: var(--bg-app);
  display: flex;
  flex-direction: column;
}

/* ===== NAV ===== */
.about-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background: var(--bg-nav);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-nav);
}

.about-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-icon-btn);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--color-text-nav);
  font-family: 'Inter', sans-serif;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.about-back-btn:hover {
  background: var(--bg-icon-btn-hover);
  color: var(--color-text-nav-hover);
}

/* ===== CONTENT ===== */
.about-content {
  max-width: 520px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 20px 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ===== HERO ===== */
.about-hero {
  text-align: center;
  padding: 32px 0 24px;
}

.about-icon-wrap {
  margin-bottom: 16px;
}

.about-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 8px;
}

.about-badge {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 3px 12px;
  border-radius: 8px;
  background: rgba(212, 175, 55, 0.15);
  color: #d4af37;
  letter-spacing: 0.3px;
  margin-bottom: 10px;
}

.about-subtitle {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  max-width: 360px;
  margin: 0 auto;
  line-height: 1.5;
}

/* ===== CARDS ===== */
.about-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
}

.about-card-title {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--color-text-tertiary);
  margin: 0 0 14px;
}

.about-desc {
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0 0 14px;
}

/* Tech card — always visible, no animation dependency */
.about-card-tech {
  background: rgba(212, 175, 55, 0.04);
  border-color: rgba(212, 175, 55, 0.12);
}

/* Tech chips */
.about-tech {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tech-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 500;
  padding: 5px 12px;
  border-radius: 20px;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.18);
  color: #d4af37;
}

.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d4af37;
  opacity: 0.5;
  flex-shrink: 0;
}

/* Creator rows */
.about-creator-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  font-size: 0.88rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-bottom: 1px solid var(--border);
}

.about-creator-row:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.about-creator-row:first-of-type {
  padding-top: 0;
}

.about-row-icon {
  flex-shrink: 0;
  opacity: 0.4;
  color: var(--color-text);
}

.about-link {
  color: #d4af37;
  transition: opacity 0.2s;
}

.about-link:hover {
  opacity: 0.8;
}

/* ===== SOCIAL BUTTONS ===== */
.about-socials {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.about-social-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 12px;
  text-decoration: none;
  color: var(--color-text);
  transition: all 0.2s;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 0.88rem;
}

.about-social-btn:hover {
  background: rgba(212, 175, 55, 0.06);
  border-color: rgba(212, 175, 55, 0.2);
  transform: translateX(3px);
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  color: #d4af37;
  flex-shrink: 0;
}

.social-icon :deep(svg) {
  width: 18px;
  height: 18px;
}

.social-label {
  flex: 1;
  font-weight: 500;
}

.social-external {
  opacity: 0.3;
  transition: opacity 0.2s;
}

.about-social-btn:hover .social-external {
  opacity: 0.7;
}

/* ===== FOOTER ===== */
.about-footer {
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin: 12px 0 0;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

/* ===== LIGHT THEME ADJUSTMENTS ===== */
[data-theme="light"] .about-social-btn {
  background: rgba(0, 0, 0, 0.02);
}

[data-theme="light"] .about-social-btn:hover {
  background: rgba(212, 175, 55, 0.06);
}
</style>
