const { createApp, ref, computed, watch, onMounted, nextTick } = Vue

const SOCIAL_ICONS = {
  vk: '<svg viewBox="0 0 24 24"><path d="M15.07 2h-6.13C4.88 2 2 4.88 2 8.93v6.14C2 19.12 4.88 22 8.93 22h6.14C19.12 22 22 19.12 22 15.07V8.93C22 4.88 19.12 2 15.07 2zm2.83 11.2c.6.6.6.6 1.2.6h.6v1.6c0 .6-.6.6-1.2.6h-1.2c-.6 0-1.2-.6-1.8-.6-.6-.6-1.2-.6-1.8 0s-1.2.6-1.8.6h-.6c-.6 0-1.2-.6-1.2-1.2v-3c0-.6.6-1.2 1.2-1.2h.6c.6 0 1.2.6 1.2 1.2v1.2c0 .6.6.6.6.6.6 0 1.2-.6 1.2-1.2V9.8c0-1.2-.6-1.8-1.8-1.8h-1.2c-1.2 0-1.8.6-1.8 1.8v1.2c0 .6-.6 1.2-1.2 1.2H8.3c-.6 0-1.2-.6-1.2-1.2V9.8c0-1.2.6-1.8 1.8-1.8h1.2c1.2 0 1.8.6 1.8 1.8v1.2c0 .6.6 1.2 1.2 1.2.6 0 1.2-.6 1.2-1.2V9.8c0-1.2.6-1.8 1.8-1.8h1.2c1.2 0 1.8.6 1.8 1.8v2.4c0 .6 0 1.2.6 1.2z"/></svg>',
  telegram: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.15.15 0 00-.07-.2c-.08-.06-.19-.04-.27-.02-.11.02-1.91 1.21-5.4 3.56-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.37-.49 1.03-.74 4.04-1.76 6.74-2.92 8.09-3.48 3.85-1.6 4.64-1.88 5.17-1.88.11 0 .37.03.54.17.14.12.18.28.2.45-.01.07-.01.13-.02.2z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24"><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 00.5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 002.12 2.14c1.87.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 002.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.22.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.22a3.72 3.72 0 01-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.05.36-2.22.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.22-.41a3.72 3.72 0 01-1.38-.9 3.72 3.72 0 01-.9-1.38c-.16-.42-.36-1.05-.41-2.22-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.22-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07c-1.27.06-2.14.26-2.9.55A5.87 5.87 0 001.62 4.15C1.33 4.9 1.13 5.78 1.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.14.55 2.9a5.87 5.87 0 002.53 2.53c.76.29 1.63.49 2.9.55 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.27-.06 2.14-.26 2.9-.55a5.87 5.87 0 002.53-2.53c.29-.76.49-1.63.55-2.9.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.14-.55-2.9a5.87 5.87 0 00-2.53-2.53c-.76-.29-1.63-.49-2.9-.55C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm7.85-10.4a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5a8.9 8.9 0 01-1.68-2.08c-.18-.3-.02-.47.13-.62.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.66-1.6-.91-2.19-.24-.58-.48-.5-.67-.5-.17 0-.37-.03-.57-.03-.2 0-.52.08-.8.38-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.09 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.08 1.76-.72 2.01-1.41.25-.7.25-1.3.17-1.41-.07-.12-.27-.2-.57-.35m-5.47 7.62h-.01A9.93 9.93 0 016.95 19l-.44-.26-3.25.85.87-3.17-.29-.46A9.89 9.89 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10m0-18C7.37 4 2.84 8.53 2.84 14.2c0 1.97.57 3.88 1.64 5.5L2.84 24l4.4-1.16a10.16 10.16 0 004.76 1.2c4.63 0 9.16-3.77 9.16-8.4S16.63 4 12 4z"/></svg>',
  viber: '<svg viewBox="0 0 24 24"><path d="M11.42 2.05c-.37.03-.72.23-.81.56-.1.39.16.75.56.83 4.22.78 7.29 3.84 8.07 8.07.06.32.34.55.66.55h.17c.4-.1.61-.49.51-.88-.91-4.85-4.34-8.28-9.16-9.13zM12.42 2c-.39.03-.69.31-.69.7 0 .4.34.72.74.69A8.69 8.69 0 0121.3 12.54c.01.4.33.72.74.69.39-.03.69-.35.65-.74A10.23 10.23 0 0012.42 2z"/><path d="M17.24 15.98c-.57-.55-1.06-.84-1.86-.59-.49.15-1.05.59-1.42.95-.18.17-.29.17-.52.04-1.14-.62-2.29-1.58-2.99-2.73a.4.4 0 01-.01-.38c.12-.24.41-.62.62-.96.32-.51.57-.94.57-1.5 0-.69-.49-1.46-1.06-2.03C10.01 8.2 9.42 7.87 8.82 7.87c-.56 0-1.16.16-1.66.53-.54.4-.93.94-1.08 1.4-.57 1.79.3 3.68 1.72 5.28 1.44 1.63 3.54 2.98 5.78 3.36 1.26.22 2.68-.45 3-1.31.1-.32-.06-.63-.34-1.15z"/></svg>',
}

function parseJSON(str, fallback = null) {
  if (!str) return fallback
  try { return JSON.parse(str) } catch { return fallback }
}

function getImagePath(img) {
  if (img.local_path) return img.local_path
  return img.preview || img.original || ''
}

function isOpenNow(hoursStr) {
  if (!hoursStr) return null
  const [open, close] = hoursStr.split('-')
  if (!open || !close) return null
  const [oh, om] = open.split(':').map(Number)
  const [ch, cm] = close.split(':').map(Number)
  const openMins = oh * 60 + om
  let closeMins = ch * 60 + cm
  const now = new Date()
  const currMins = now.getHours() * 60 + now.getMinutes()
  if (closeMins < openMins) closeMins += 1440
  return currMins >= openMins && currMins <= closeMins
}

function todayHours(hoursArray) {
  if (!hoursArray || !hoursArray.length) return []
  const day = new Date().getDay()
  const idx = day === 0 ? 6 : day - 1
  return hoursArray.map((h, i) => ({ text: h, isToday: i === idx, openNow: i === idx ? isOpenNow(h) : null }))
}

const THEME_KEY = 'catalog-theme'

function formatPhone(phone) {
  if (!phone) return ''
  return phone.replace(/[^\d+]/g, '')
}
const isGitHubPages = window.location.hostname === 'bestdeejay-design.github.io'

const app = createApp({
  setup() {
    // --- State ---
    const theme = ref(localStorage.getItem(THEME_KEY) || 'system')
    const resolvedTheme = ref('light')
    const view = ref('cities')
    const loading = ref(true)
    const searchLoading = ref(false)

    const cities = ref([])
    const categories = ref([])
    const establishments = ref([])
    const allEstablishmentsCache = ref(null)

    const currentCity = ref(null)
    const currentCategory = ref(null)
    const currentEstablishment = ref(null)
    const globalSearchTerm = ref('')

    const searchQuery = ref('')
    const categoryFilter = ref(null)

    const galleryIndex = ref(0)
    const lightboxOpen = ref(false)
    const lightboxImage = ref('')

    // --- Theme ---
    function resolveTheme() {
      if (theme.value === 'dark') return 'dark'
      if (theme.value === 'light') return 'light'
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    function applyTheme() {
      resolvedTheme.value = resolveTheme()
      document.documentElement.setAttribute('data-theme', resolvedTheme.value)
    }

    function toggleTheme() {
      theme.value = resolvedTheme.value === 'dark' ? 'light' : 'dark'
      localStorage.setItem(THEME_KEY, theme.value)
      applyTheme()
    }

    // --- Data Loading ---
    async function loadBaseData() {
      try {
        const [citiesRes, catRes] = await Promise.all([
          fetch('data-generated/cities.json'),
          fetch('data-generated/categories.json'),
        ])
        cities.value = await citiesRes.json()
        categories.value = await catRes.json()
      } catch (e) {
        console.error('Failed to load base data:', e)
      }
    }

    async function loadCityEstablishments(city) {
      loading.value = true
      currentCity.value = city
      currentCategory.value = null

      const regularPath = `data-generated/${city.slug}.json`
      let resp = await fetch(regularPath)
      if (!isGitHubPages) {
        const withLocalPath = `data-generated/${city.slug}_with_local_images.json`
        let localResp = await fetch(withLocalPath)
        if (localResp.ok) resp = localResp
      }
      try {
        if (!resp.ok) throw new Error('City data not found')
        const data = await resp.json()
        establishments.value = data
      } catch (e) {
        establishments.value = []
      } finally {
        loading.value = false
        searchQuery.value = ''
        categoryFilter.value = null
      }
    }

    async function loadAllByCategory(cat) {
      loading.value = true
      currentCategory.value = cat
      currentCity.value = null

      const results = []
      for (const city of cities.value) {
        try {
          const resp = await fetch(`data-generated/${city.slug}.json`)
          if (!resp.ok) continue
          const data = await resp.json()
          const filtered = data.filter(e => e.category_id === cat.id)
          if (filtered.length) {
            filtered.forEach(e => { e._city_name = city.name; e._city_slug = city.slug })
            results.push(...filtered)
          }
        } catch {}
      }
      establishments.value = results
      loading.value = false
      searchQuery.value = ''
      categoryFilter.value = null
    }

    async function loadGlobalSearch(term) {
      if (!term || term.length < 2) return
      searchLoading.value = true
      globalSearchTerm.value = term
      currentCity.value = null
      currentCategory.value = null

      const t = term.toLowerCase()
      const results = []

      if (allEstablishmentsCache.value) {
        for (const est of allEstablishmentsCache.value) {
          if ((est.name && est.name.toLowerCase().includes(t)) ||
              (est.address && est.address.toLowerCase().includes(t)) ||
              (est.description && est.description.toLowerCase().includes(t))) {
            results.push(est)
            if (results.length >= 200) break
          }
        }
      } else {
        for (const city of cities.value) {
          try {
            const resp = await fetch(`data-generated/${city.slug}.json`)
            if (!resp.ok) continue
            const data = await resp.json()
            for (const est of data) {
              if ((est.name && est.name.toLowerCase().includes(t)) ||
                  (est.address && est.address.toLowerCase().includes(t)) ||
                  (est.description && est.description.toLowerCase().includes(t))) {
                est._city_name = city.name
                est._city_slug = city.slug
                results.push(est)
                if (results.length >= 200) break
              }
            }
          } catch {}
          if (results.length >= 200) break
        }
      }

      establishments.value = results
      searchLoading.value = false
      searchQuery.value = term
      categoryFilter.value = null
    }

    async function ensureAllCache() {
      if (allEstablishmentsCache.value) return
      const all = []
      for (const city of cities.value) {
        try {
          const resp = await fetch(`data-generated/${city.slug}.json`)
          if (!resp.ok) continue
          const data = await resp.json()
          data.forEach(e => { e._city_name = city.name; e._city_slug = city.slug })
          all.push(...data)
        } catch {}
      }
      allEstablishmentsCache.value = all
    }

    // --- Computed ---
    const sortedCities = computed(() =>
      [...cities.value].sort((a, b) => (b.establishments_count || 0) - (a.establishments_count || 0))
    )

    const filteredEstablishments = computed(() => {
      let result = [...establishments.value]
      const q = searchQuery.value.toLowerCase().trim()
      if (q) {
        result = result.filter(e =>
          (e.name && e.name.toLowerCase().includes(q)) ||
          (e.address && e.address.toLowerCase().includes(q))
        )
      }
      if (categoryFilter.value) {
        result = result.filter(e => e.category_id === categoryFilter.value)
      }
      return result
    })

    const availableCategories = computed(() => {
      const seen = new Set()
      return categories.value.filter(c => {
        if (seen.has(c.id)) return false
        const has = establishments.value.some(e => e.category_id === c.id)
        if (has) seen.add(c.id)
        return has
      })
    })

    const currentImages = computed(() => {
      if (!currentEstablishment.value) return []
      if (!isGitHubPages && currentEstablishment.value.images_local && currentEstablishment.value.images_local.length) {
        return currentEstablishment.value.images_local
      }
      return parseJSON(currentEstablishment.value?.images, [])
    })

    const currentMenu = computed(() => parseJSON(currentEstablishment.value?.menu, null))
    const currentFeatures = computed(() => parseJSON(currentEstablishment.value?.features, []))
    const currentSocials = computed(() => parseJSON(currentEstablishment.value?.social_links, null))
    const currentHours = computed(() => {
      const all = parseJSON(currentEstablishment.value?.working_hours, [])
      return todayHours(all)
    })
    const currentCategoryName = computed(() => {
      const c = categories.value.find(c => c.id === currentEstablishment.value?.category_id)
      return c ? c.name : ''
    })
    const currentOpenBadge = computed(() => {
      const hours = parseJSON(currentEstablishment.value?.working_hours, [])
      if (!hours.length) return null
      const day = new Date().getDay()
      const idx = day === 0 ? 6 : day - 1
      return isOpenNow(hours[idx])
    })

    // --- Actions ---
    function selectCity(city) {
      loadCityEstablishments(city)
      view.value = 'establishments'
      window.scrollTo(0, 0)
    }

    function selectCategory(cat) {
      loadAllByCategory(cat)
      view.value = 'establishments'
      window.scrollTo(0, 0)
    }

    function selectEstablishment(est) {
      currentEstablishment.value = est
      galleryIndex.value = 0
      view.value = 'detail'
      window.scrollTo(0, 0)
    }

    function goBack() {
      view.value = 'establishments'
      currentEstablishment.value = null
    }

    function goHome() {
      view.value = 'cities'
      establishments.value = []
      currentCity.value = null
      currentCategory.value = null
      searchQuery.value = ''
      globalSearchTerm.value = ''
      window.scrollTo(0, 0)
    }

    function goCategories() {
      view.value = 'categories'
      window.scrollTo(0, 0)
    }

    function handleGlobalSearch() {
      const term = globalSearchTerm.value.trim()
      if (!term || term.length < 2) return
      view.value = 'establishments'
      loadGlobalSearch(term)
      window.scrollTo(0, 0)
    }

    function clearSearch() {
      globalSearchTerm.value = ''
      searchQuery.value = ''
    }

    // --- Gallery ---
    function nextImage() {
      if (galleryIndex.value < currentImages.value.length - 1) galleryIndex.value++
      else galleryIndex.value = 0
    }
    function prevImage() {
      if (galleryIndex.value > 0) galleryIndex.value--
      else galleryIndex.value = currentImages.value.length - 1
    }
    function setImage(idx) { galleryIndex.value = idx }
    function openLightbox() {
      const img = currentImages.value[galleryIndex.value]
      if (img) {
        lightboxImage.value = getImagePath(img)
        lightboxOpen.value = true
      }
    }
    function closeLightbox() { lightboxOpen.value = false }

    // --- Lifecycle ---
    onMounted(async () => {
      applyTheme()
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (theme.value === 'system') applyTheme()
      })
      await loadBaseData()
      loading.value = false
      ensureAllCache()
    })

    // --- Toast ---
    const toast = ref(null)
    let toastTimer = null
    function showToast(msg) {
      toast.value = msg
      clearTimeout(toastTimer)
      toastTimer = setTimeout(() => { toast.value = null }, 2500)
    }

    return {
      theme, resolvedTheme, toggleTheme,
      view, loading, searchLoading,
      cities, sortedCities, categories, establishments,
      currentCity, currentCategory, currentEstablishment,
      globalSearchTerm,
      searchQuery, categoryFilter, filteredEstablishments,
      availableCategories,
      currentImages, currentMenu, currentFeatures, currentSocials, currentHours,
      currentCategoryName, currentOpenBadge,
      galleryIndex, lightboxOpen, lightboxImage,
      selectCity, selectCategory, selectEstablishment,
      goBack, goHome, goCategories,
      handleGlobalSearch, clearSearch,
      nextImage, prevImage, setImage, openLightbox, closeLightbox,
      toast,
    }
  },
})

// --- Components ---

app.component('app-header', {
  props: ['view', 'globalSearchTerm', 'resolvedTheme'],
  emits: ['go-home', 'go-categories', 'toggle-theme', 'update:globalSearchTerm', 'global-search'],
  template: `
    <header class="app-header">
      <div class="header-inner">
        <a href="#" class="header-logo" @click.prevent="$emit('go-home')">Каталог России</a>
        <div style="flex:1;max-width:400px;margin:0 24px;">
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input
              :value="globalSearchTerm"
              @input="$emit('update:globalSearchTerm', $event.target.value)"
              @keydown.enter="$emit('global-search')"
              placeholder="Поиск по всем городам..."
            />
          </div>
        </div>
        <nav class="header-nav">
          <a href="#" :class="{ active: view === 'cities' }" @click.prevent="$emit('go-home')">
            🏙️ <span class="nav-label">Города</span>
          </a>
          <a href="#" :class="{ active: view === 'categories' }" @click.prevent="$emit('go-categories')">
            📂 <span class="nav-label">Категории</span>
          </a>
          <button class="theme-toggle" @click="$emit('toggle-theme')" :title="resolvedTheme === 'dark' ? 'Светлая тема' : 'Тёмная тема'">
            {{ resolvedTheme === 'dark' ? '☀️' : '🌙' }}
          </button>
        </nav>
      </div>
    </header>
  `,
})

app.component('cities-view', {
  props: ['cities', 'loading'],
  emits: ['select-city'],
  template: `
    <div>
      <div class="section-header">
        <div>
          <h2 class="section-title">Города</h2>
          <p class="section-subtitle">{{ cities.length }} городов России</p>
        </div>
      </div>
      <div v-if="loading" class="loading-spinner"></div>
      <div v-else-if="cities.length" class="bento-grid cities">
        <div
          v-for="city in cities" :key="city.id"
          class="bento-card city-card"
          @click="$emit('select-city', city)"
        >
          <div class="card-city-name">{{ city.name }}</div>
          <div class="card-city-count">{{ (city.establishments_count || 0).toLocaleString() }} заведений</div>
        </div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-icon">🏙️</div>
        <div class="empty-title">Города не найдены</div>
      </div>
    </div>
  `,
})

app.component('categories-view', {
  props: ['categories'],
  emits: ['select-category'],
  methods: {
    catEmoji(cat) {
      const map = {
        restaurants: '🍽️', bars: '🍺', beauty: '💇', medicine: '🏥',
        education: '🎓', transport: '🚗', services: '🔧', shops: '🛍️',
        entertainment: '🎭', sports: '⚽', finance: '💰', realestate: '🏠',
      }
      return map[cat.slug] || '📋'
    },
  },
  template: `
    <div>
      <div class="section-header">
        <div>
          <h2 class="section-title">Категории</h2>
          <p class="section-subtitle">{{ categories.length }} категорий заведений</p>
        </div>
      </div>
      <div v-if="categories.length" class="bento-grid categories">
        <div
          v-for="cat in categories" :key="cat.id"
          class="bento-card category-card"
          @click="$emit('select-category', cat)"
        >
          <div class="card-cat-icon">{{ catEmoji(cat) }}</div>
          <div class="card-cat-name">{{ cat.name }}</div>
          <div class="card-cat-desc">{{ cat.description }}</div>
        </div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-icon">📂</div>
        <div class="empty-title">Категории не найдены</div>
      </div>
    </div>
  `,
})

app.component('establishments-view', {
  props: ['establishments', 'categories', 'city', 'category', 'loading', 'searchLoading', 'searchQuery', 'categoryFilter', 'availableCategories'],
  emits: ['select-establishment', 'update:searchQuery', 'update:categoryFilter', 'go-back'],
  setup(props, { emit }) {
    const debounceTimer = ref(null)
    function onSearchInput(e) {
      clearTimeout(debounceTimer.value)
      debounceTimer.value = setTimeout(() => {
        emit('update:searchQuery', e.target.value)
      }, 250)
    }
    function onCategoryChange(e) {
      emit('update:categoryFilter', e.target.value ? parseInt(e.target.value) : null)
    }
    function getCatName(id) {
      const c = props.categories.find(c => c.id === id)
      return c ? c.name : ''
    }
    function getCardImage(est) {
      if (!isGitHubPages && est.images_local && est.images_local.length) return getImagePath(est.images_local[0])
      const images = parseJSON(est.images, [])
      if (images && images.length) return images[0].preview || ''
      return ''
    }
    return { onSearchInput, onCategoryChange, getCatName, getCardImage, debounceTimer }
  },
  template: `
    <div>
      <div class="section-header">
        <div>
          <h2 class="section-title">
            <template v-if="city">Заведения в {{ city.name }}</template>
            <template v-else-if="category">Категория: {{ category.name }}</template>
            <template v-else>Результаты поиска</template>
          </h2>
          <p class="section-subtitle">{{ establishments.length.toLocaleString() }} заведений</p>
        </div>
      </div>

      <div class="filters-row">
        <div class="search-bar" style="max-width:100%">
          <span class="search-icon">🔍</span>
          <input
            :value="searchQuery"
            @input="onSearchInput"
            placeholder="Название или адрес..."
          />
        </div>
        <select class="filter-select" :value="categoryFilter || ''" @change="onCategoryChange">
          <option value="">Все категории</option>
          <option v-for="cat in availableCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>

      <div v-if="loading || searchLoading" class="loading-spinner"></div>

      <div v-else-if="establishments.length" class="bento-grid establishments">
        <div
          v-for="est in establishments" :key="est.id"
          class="bento-card est-card"
          @click="$emit('select-establishment', est)"
        >
          <div class="est-card-header">
            <div class="est-card-image-wrap">
              <img
                v-if="getCardImage(est)"
                :src="getCardImage(est)"
              class="est-card-image"
              loading="lazy"
              @error="$event.target.remove()"
            />
              <div class="est-card-image-placeholder">🏢</div>
            </div>
            <div class="est-card-info">
              <div class="est-card-name truncate">{{ est.name }}</div>
              <div class="est-card-category">{{ getCatName(est.category_id) }}</div>
              <div v-if="est._city_name" class="est-card-address truncate" style="font-size:0.75rem;color:var(--color-text-muted)">📍 {{ est._city_name }}</div>
            </div>
          </div>
          <div class="est-card-meta">
            <span v-if="est.rating" class="est-card-rating">⭐ {{ est.rating }}</span>
            <span v-if="est.review_count">{{ est.review_count }} отзывов</span>
            <span v-if="est.address" class="truncate" style="flex:1">📍 {{ est.address }}</span>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-title">Ничего не найдено</div>
        <div class="empty-desc">Попробуйте изменить параметры поиска</div>
      </div>
    </div>
  `,
})

app.component('establishment-detail', {
  props: ['establishment', 'categories', 'images', 'menu', 'features', 'socials', 'hours', 'categoryName', 'openBadge', 'galleryIndex', 'lightboxOpen', 'lightboxImage'],
  emits: ['go-back', 'prev-image', 'next-image', 'set-image', 'open-lightbox', 'close-lightbox'],
  template: `
    <div>
      <button class="back-btn" @click="$emit('go-back')">← Назад к списку</button>

      <div class="detail-card" style="margin-bottom:var(--space-lg)">
        <div class="detail-header">
          <div>
            <h1 class="detail-name">{{ establishment.name }}</h1>
            <div class="detail-rating-row">
              <span v-if="establishment.rating" class="detail-rating-value">⭐ {{ establishment.rating }}</span>
              <span v-if="establishment.review_count" class="detail-rating-count">({{ establishment.review_count }} отзывов)</span>
              <span v-if="categoryName" class="badge badge-primary">{{ categoryName }}</span>
              <span v-if="openBadge !== null" :class="['badge', openBadge ? 'badge-open' : 'badge-closed']">
                {{ openBadge ? '✓ Открыто' : '✗ Закрыто' }}
              </span>
            </div>
          </div>
          <div class="chip" v-if="establishment._city_name">📍 {{ establishment._city_name }}</div>
        </div>
      </div>

      <div class="detail-layout">
        <div class="detail-main-col">
          <div v-if="images.length" class="detail-card">
            <div class="gallery-main-wrap" @click="$emit('open-lightbox')">
              <img :src="getImagePath(images[galleryIndex])" alt="Фото" @error="onGalleryError" />
              <button class="gallery-nav prev" @click.stop="$emit('prev-image')">‹</button>
              <button class="gallery-nav next" @click.stop="$emit('next-image')">›</button>
              <span class="gallery-counter">{{ galleryIndex + 1 }} / {{ images.length }}</span>
            </div>
            <div class="gallery-thumbs" v-if="images.length > 1">
              <div
                v-for="(img, i) in images" :key="i"
                :class="['gallery-thumb', { active: i === galleryIndex }]"
                @click="$emit('set-image', i)"
              >
                <img :src="getImagePath(img)" loading="lazy" alt="Миниатюра" @error="onThumbError($event, i)" />
              </div>
            </div>
          </div>

          <div v-if="establishment.description" class="detail-card">
            <div class="detail-section-title">📝 Описание</div>
            <div class="detail-description-text">{{ establishment.description }}</div>
          </div>

          <div v-if="hours.length" class="detail-card">
            <div class="detail-section-title">🕐 Часы работы</div>
            <ul class="hours-list">
              <li v-for="(h, i) in hours" :key="i" :class="['hours-item', { today: h.isToday }]">
                <span class="hours-day">{{ h.isToday ? 'Сегодня' : h.text }}</span>
                <span class="hours-time" v-if="!h.isToday">{{ h.text }}</span>
                <span v-else :class="['badge', h.openNow ? 'badge-open' : 'badge-closed']">
                  {{ h.openNow ? 'Открыто' : 'Закрыто' }}
                </span>
              </li>
            </ul>
          </div>

          <div v-if="menu" class="detail-card">
            <div class="detail-section-title">🍽️ Меню</div>
            <details v-for="(items, catName) in menu" :key="catName" class="menu-category" open>
              <summary>{{ catName }} <span class="chip">{{ items.length }}</span></summary>
              <div v-for="(item, i) in items" :key="i" class="menu-item-row">
                <span class="menu-item-name">{{ item.name || item }}</span>
                <span class="menu-item-price" v-if="item.price || item.cost">{{ (item.price || item.cost) }} ₽</span>
              </div>
            </details>
          </div>
        </div>

        <div class="detail-side-col">
          <div class="detail-card">
            <div class="detail-section-title">📞 Контакты</div>
            <div class="contact-row"><label>Адрес:</label><span>{{ establishment.address || '—' }}</span></div>
            <div class="contact-row">
              <label>Телефон:</label>
              <a v-if="establishment.phone" :href="'tel:' + formatPhone(establishment.phone)">{{ establishment.phone }}</a>
              <span v-else>—</span>
            </div>
            <div class="contact-row">
              <label>Сайт:</label>
              <a v-if="establishment.website" :href="establishment.website" target="_blank" rel="noopener">{{ establishment.website }}</a>
              <span v-else>—</span>
            </div>
            <div style="display:flex;gap:8px;margin-top:12px">
              <a v-if="establishment.phone" class="btn btn-primary" :href="'tel:' + formatPhone(establishment.phone)" style="flex:1">📞 Позвонить</a>
              <a v-if="establishment.website" class="btn btn-outline" :href="establishment.website" target="_blank" rel="noopener" style="flex:1">🌐 Сайт</a>
            </div>
          </div>

          <div v-if="features.length" class="detail-card">
            <div class="detail-section-title">✨ Особенности</div>
            <div class="features-wrap">
              <span v-for="(f, i) in features" :key="i" class="chip">{{ f }}</span>
            </div>
          </div>

          <div v-if="socials" class="detail-card">
            <div class="detail-section-title">🔗 Соцсети</div>
            <div class="social-icons-row">
              <a
                v-for="(url, platform) in socials" :key="platform"
                :href="Array.isArray(url) ? url[0] : url"
                class="social-icon-link" target="_blank" rel="noopener"
                :title="platform"
                v-html="SOCIAL_ICONS[platform.toLowerCase()] || SOCIAL_ICONS.vk"
              ></a>
            </div>
          </div>
        </div>
      </div>

      <teleport to="body">
        <div v-if="lightboxOpen" class="lightbox-overlay" @click="$emit('close-lightbox')">
          <button class="lightbox-close" @click="$emit('close-lightbox')">×</button>
          <img :src="lightboxImage" @click.stop @error="onLightboxError" alt="Полноразмерное фото" />
        </div>
      </teleport>
    </div>
  `,
  methods: {
    getImagePath,
    formatPhone,
    onGalleryError(event) {
      if (event.target.dataset.fallback) return
      event.target.dataset.fallback = '1'
      const img = this.images[this.galleryIndex]
      if (img && img.preview) event.target.src = img.preview
    },
    onThumbError(event, idx) {
      if (event.target.dataset.fallback) return
      event.target.dataset.fallback = '1'
      const img = this.images[idx]
      if (img && img.preview) event.target.src = img.preview
    },
    onLightboxError(event) {
      if (event.target.dataset.fallback) return
      event.target.dataset.fallback = '1'
      const img = this.images[this.galleryIndex]
      if (img) event.target.src = img.original || img.preview || ''
    },
  },
  data() {
    return { SOCIAL_ICONS }
  },
})

app.mount('#app')
