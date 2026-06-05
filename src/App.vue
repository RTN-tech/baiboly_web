<script setup>
import { RouterView } from 'vue-router'
import ThemeToggle from './components/ThemeToggle.vue'
import InstallBadge from './components/InstallBadge.vue'
import { useTheme } from './composables/useTheme.js'

useTheme()
</script>

<template>
  <div class="app">
    <RouterView />
    <ThemeToggle />
    <InstallBadge />
  </div>
</template>

<style>
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--bg-app);
  color: var(--color-text);
  transition: background 0.3s ease, color 0.3s ease;
}

::selection {
  background: rgba(212, 175, 55, 0.3);
  color: var(--color-text-inverse);
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}

/* ==============================
   CSS Custom Properties
   ============================== */

:root {
  /* ---- Backgrounds ---- */
  --bg-app: #1a1a2e;
  --bg-page: transparent;
  --bg-card: rgba(255, 255, 255, 0.02);
  --bg-card-hover: rgba(212, 175, 55, 0.05);
  --bg-elevated: #25254a;
  --bg-nav: rgba(26, 26, 46, 0.97);
  --bg-nav-hover: rgba(255, 255, 255, 0.1);
  --bg-toggle: #d4af37;
  --bg-reader: #1a1a2e;
  --bg-reader-card: #222245;
  --bg-chapter-selector: #222245;
  --bg-verse-hover: rgba(255, 255, 255, 0.06);
  --bg-search-input: rgba(255, 255, 255, 0.08);
  --bg-search-input-focus: rgba(255, 255, 255, 0.12);
  --bg-group-header: #222245;
  --bg-result-item: #222245;
  --bg-progress: rgba(255, 255, 255, 0.1);
  --bg-search-header: rgba(26, 26, 46, 0.98);
  --bg-icon-btn: rgba(255, 255, 255, 0.08);
  --bg-icon-btn-hover: rgba(255, 255, 255, 0.15);

  /* ---- Text ---- */
  --color-text: #f5f5f5;
  --color-text-secondary: rgba(255, 255, 255, 0.7);
  --color-text-tertiary: rgba(255, 255, 255, 0.5);
  --color-text-muted: rgba(255, 255, 255, 0.4);
  --color-text-nav: rgba(255, 255, 255, 0.7);
  --color-text-nav-hover: #ffffff;
  --color-text-inverse: #1a1a2e;
  --color-toggle: #1a1a2e;
  --color-verse-text: rgba(255, 255, 255, 0.85);
  --color-verse-number: #d4af37;
  --color-chapter-number: #f5f5f5;
  --color-heading: #f0f0f0;
  --color-placeholder: rgba(255, 255, 255, 0.3);
  --color-search-input: #ffffff;
  --color-search-placeholder: rgba(255, 255, 255, 0.35);
  --color-result-text: rgba(255, 255, 255, 0.75);
  --color-group-name: #f0f0f0;
  --color-group-count: rgba(255, 255, 255, 0.4);
  --color-result-ref: #d4af37;
  --color-empty-icon: rgba(255, 255, 255, 0.2);
  --color-empty-text: rgba(255, 255, 255, 0.5);
  --color-empty-heading: #ccc;
  --color-hint: rgba(255, 255, 255, 0.3);
  --color-truncated: rgba(255, 255, 255, 0.3);
  --color-ch-text: var(--color-text);
  --color-ch-active-text: #d4af37;
  --color-nav-label: var(--color-text-tertiary);
  --color-nav-chapter: var(--color-text);

  /* ---- Borders ---- */
  --border: rgba(255, 255, 255, 0.06);
  --border-light: rgba(255, 255, 255, 0.08);
  --border-accent: rgba(212, 175, 55, 0.25);
  --border-nav: rgba(255, 255, 255, 0.06);
  --border-card-hover: rgba(212, 175, 55, 0.25);
  --border-book-nav: rgba(212, 175, 55, 0.15);
  --border-reader: rgba(255, 255, 255, 0.06);
  --border-chapter-title: rgba(255, 255, 255, 0.08);
  --border-group-header: rgba(255, 255, 255, 0.08);
  --border-result-item: rgba(255, 255, 255, 0.06);
  --border-search-focus: rgba(212, 175, 55, 0.5);
  --border-tab: rgba(255, 255, 255, 0.08);
  --border-tab-hover: rgba(212, 175, 55, 0.3);
  --border-tab-active: #d4af37;
  --border-ch-dropdown: var(--border);
  --border-large: var(--border);
  --border-large-hover: #d4af37;

  /* ---- Shadows ---- */
  --shadow-card: 0 8px 25px rgba(0, 0, 0, 0.2);
  --shadow-elevated: 0 12px 40px rgba(0, 0, 0, 0.3);
  --shadow-chapter-selector: 0 2px 12px rgba(0, 0, 0, 0.15);
  --shadow-verses: 0 2px 20px rgba(0, 0, 0, 0.1);
  --shadow-group-header: 0 1px 4px rgba(0, 0, 0, 0.15);
  --shadow-result-hover: 0 4px 15px rgba(212, 175, 55, 0.08);
  --shadow-large-hover: 0 4px 15px rgba(212, 175, 55, 0.1);

  /* ---- Hero ---- */
  --hero-from: #1a1a2e;
  --hero-mid: #16213e;
  --hero-to: #0f3460;
  --hero-search-bg: rgba(255, 255, 255, 0.08);
  --hero-search-border: rgba(255, 255, 255, 0.1);
  --hero-search-bg-focus: rgba(255, 255, 255, 0.12);
  --hero-search-shadow: 0 0 30px rgba(212, 175, 55, 0.08);
  --hero-search-icon: rgba(255, 255, 255, 0.35);
  --hero-search-input: #ffffff;
  --hero-search-placeholder: rgba(255, 255, 255, 0.3);
  --hero-search-btn-hover: #1a1a2e;
  --hero-stat-color: rgba(255, 255, 255, 0.5);
  --hero-stat-divider: rgba(255, 255, 255, 0.1);

  /* ---- Misc ---- */
  --search-btn-hover-bg: #d4af37;
  --loader-track: rgba(255, 255, 255, 0.1);
  --progress-track: rgba(255, 255, 255, 0.1);
  --back-btn-bg: #1a1a2e;
  --back-btn-color: #ffffff;
  --back-btn-hover: #2a2a3e;
  --book-nav-text: #8b7a3a;
  --ch-active-bg: rgba(212, 175, 55, 0.1);
  --ch-current-bg: rgba(255, 255, 255, 0.08);
  --ch-current-hover: rgba(255, 255, 255, 0.12);
  --ch-item-hover: rgba(255, 255, 255, 0.05);
  --search-highlight-bg: rgba(212, 175, 55, 0.25);
  --search-highlight-color: #d4af37;
  --tip-btn-bg: rgba(212, 175, 55, 0.1);
  --tip-btn-border: rgba(212, 175, 55, 0.2);
  --tip-btn-hover-bg: rgba(212, 175, 55, 0.2);
  --tip-btn-hover-border: rgba(212, 175, 55, 0.4);
  --tab-bg-inactive: rgba(255, 255, 255, 0.03);
  --tab-color-inactive: rgba(255, 255, 255, 0.6);
  --tab-color-hover: rgba(255, 255, 255, 0.8);
  --tab-active-bg: rgba(212, 175, 55, 0.1);
  --reader-nav-text: var(--color-text-nav);
  --reader-nav-border: var(--border-nav);
  --nav-testament-color: #d4af37;
  --nav-book-color: #ffffff;
}

/* ==============================
   LIGHT THEME OVERRIDES
   ============================== */

[data-theme="light"] {
  --bg-app: #faf8f5;
  --bg-card: #ffffff;
  --bg-card-hover: rgba(212, 175, 55, 0.05);
  --bg-elevated: #ffffff;
  --bg-nav: rgba(255, 255, 255, 0.97);
  --bg-nav-hover: rgba(0, 0, 0, 0.05);
  --bg-toggle: #1a1a2e;
  --bg-reader: #faf8f5;
  --bg-reader-card: #ffffff;
  --bg-chapter-selector: #ffffff;
  --bg-verse-hover: #faf8f5;
  --bg-search-input: rgba(0, 0, 0, 0.05);
  --bg-search-input-focus: rgba(0, 0, 0, 0.08);
  --bg-group-header: #ffffff;
  --bg-result-item: #ffffff;
  --bg-progress: #e8e4df;
  --bg-search-header: rgba(255, 255, 255, 0.98);
  --bg-icon-btn: rgba(0, 0, 0, 0.06);
  --bg-icon-btn-hover: rgba(0, 0, 0, 0.1);

  --color-text: #2c2c2c;
  --color-text-secondary: #666;
  --color-text-tertiary: #999;
  --color-text-muted: #aaa;
  --color-text-nav: rgba(0, 0, 0, 0.6);
  --color-text-nav-hover: #000000;
  --color-text-inverse: #ffffff;
  --color-toggle: #ffffff;
  --color-verse-text: #333;
  --color-verse-number: #d4af37;
  --color-chapter-number: #1a1a2e;
  --color-heading: #2c2c2c;
  --color-placeholder: rgba(0, 0, 0, 0.25);
  --color-search-input: #333;
  --color-search-placeholder: rgba(0, 0, 0, 0.3);
  --color-result-text: #444;
  --color-group-name: #1a1a2e;
  --color-group-count: #aaa;
  --color-result-ref: #d4af37;
  --color-empty-icon: #ccc;
  --color-empty-text: #888;
  --color-empty-heading: #333;
  --color-hint: #aaa;
  --color-truncated: #aaa;
  --color-ch-text: #444;
  --color-ch-active-text: #8b7a3a;
  --color-nav-label: #999;
  --color-nav-chapter: #2c2c2c;

  --border: #e8e4df;
  --border-light: #f0ece7;
  --border-accent: rgba(212, 175, 55, 0.3);
  --border-nav: rgba(0, 0, 0, 0.06);
  --border-card-hover: rgba(212, 175, 55, 0.25);
  --border-book-nav: rgba(212, 175, 55, 0.15);
  --border-reader: #e8e4df;
  --border-chapter-title: #f0ece7;
  --border-group-header: #f0ece7;
  --border-result-item: #f0ece7;
  --border-search-focus: rgba(212, 175, 55, 0.5);
  --border-tab: rgba(0, 0, 0, 0.08);
  --border-tab-hover: rgba(212, 175, 55, 0.3);
  --border-tab-active: #d4af37;
  --border-ch-dropdown: #e8e4df;
  --border-large: #e8e4df;
  --border-large-hover: #d4af37;

  --shadow-card: 0 8px 25px rgba(0, 0, 0, 0.08);
  --shadow-elevated: 0 12px 40px rgba(0, 0, 0, 0.12);
  --shadow-chapter-selector: 0 2px 12px rgba(0, 0, 0, 0.06);
  --shadow-verses: 0 2px 20px rgba(0, 0, 0, 0.04);
  --shadow-group-header: 0 1px 4px rgba(0, 0, 0, 0.04);
  --shadow-result-hover: 0 4px 15px rgba(212, 175, 55, 0.08);
  --shadow-large-hover: 0 4px 15px rgba(212, 175, 55, 0.1);

  --hero-from: #faf8f5;
  --hero-mid: #f0ece7;
  --hero-to: #e8e4df;
  --hero-search-bg: rgba(0, 0, 0, 0.05);
  --hero-search-border: rgba(0, 0, 0, 0.08);
  --hero-search-bg-focus: rgba(212, 175, 55, 0.06);
  --hero-search-shadow: 0 0 30px rgba(212, 175, 55, 0.06);
  --hero-search-icon: rgba(0, 0, 0, 0.3);
  --hero-search-input: #333;
  --hero-search-placeholder: rgba(0, 0, 0, 0.25);
  --hero-search-btn-hover: #ffffff;
  --hero-stat-color: rgba(0, 0, 0, 0.4);
  --hero-stat-divider: rgba(0, 0, 0, 0.08);

  --search-btn-hover-bg: #d4af37;
  --loader-track: #e8e4df;
  --progress-track: #e8e4df;
  --back-btn-bg: #1a1a2e;
  --back-btn-color: #ffffff;
  --back-btn-hover: #2a2a3e;
  --book-nav-text: #8b7a3a;
  --ch-active-bg: rgba(212, 175, 55, 0.1);
  --ch-current-bg: #f5f3f0;
  --ch-current-hover: #ede9e4;
  --ch-item-hover: #faf8f5;
  --search-highlight-bg: rgba(212, 175, 55, 0.25);
  --search-highlight-color: #8b7a3a;
  --tip-btn-bg: rgba(212, 175, 55, 0.1);
  --tip-btn-border: rgba(212, 175, 55, 0.2);
  --tip-btn-hover-bg: rgba(212, 175, 55, 0.2);
  --tip-btn-hover-border: rgba(212, 175, 55, 0.4);
  --tab-bg-inactive: rgba(0, 0, 0, 0.02);
  --tab-color-inactive: rgba(0, 0, 0, 0.5);
  --tab-color-hover: rgba(0, 0, 0, 0.8);
  --tab-active-bg: rgba(212, 175, 55, 0.1);
  --reader-nav-text: rgba(0, 0, 0, 0.6);
  --reader-nav-border: rgba(0, 0, 0, 0.06);
  --nav-testament-color: #d4af37;
  --nav-book-color: #1a1a2e;
}
</style>
