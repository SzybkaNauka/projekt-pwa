<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const accountOpen = ref(false)
const watchlistOpen = ref(false)
const searchOpen = ref(false)
const searchInput = ref('')
const searchField = ref<HTMLInputElement | null>(null)

const { catalog, getByIds, filterVisible } = useCatalog()
const {
  currentProfile,
  favoriteIds,
  continueWatchingEntries,
  hiddenIds,
  openProfileSelector,
} = useProfiles()

const watchlistItems = computed(() => getByIds(favoriteIds.value))
const continueItems = computed(() => getByIds(continueWatchingEntries.value.map(item => item.id)))
const visibleCatalog = computed(() => filterVisible(catalog, currentProfile.value, hiddenIds.value))

const categories = computed(() =>
  Array.from(new Set(visibleCatalog.value.flatMap(item => item.genres))).slice(0, 10),
)

const searchPreview = computed(() => {
  const query = searchInput.value.trim().toLowerCase()

  if (!query) {
    return []
  }

  return visibleCatalog.value.filter((item) => {
    return [
      item.title,
      item.description,
      item.shortDescription,
      ...item.genres,
    ].some(value => value.toLowerCase().includes(query))
  }).slice(0, 5)
})

const syncSearchFromRoute = () => {
  searchInput.value = String(route.query.q || '')
}

const submitSearch = async () => {
  const query = searchInput.value.trim()
  await router.push({
    path: '/szukaj',
    query: query ? { q: query } : {},
  })
}

const openSearch = async () => {
  searchOpen.value = true
  await nextTick()
  searchField.value?.focus()
}

const searchCategory = async (genre: string) => {
  searchInput.value = genre
  await router.push({
    path: '/szukaj',
    query: { q: genre },
  })
}

watch(
  () => route.fullPath,
  () => {
    accountOpen.value = false
    watchlistOpen.value = false
    syncSearchFromRoute()
  },
  { immediate: true },
)
</script>

<template>
  <header class="navbar">
    <div class="navbar__container">
      <div class="navbar__brand">
        <NuxtLink to="/" class="navbar__logo" aria-label="StreamBox">
          <span class="navbar__logo-mark">stream</span>
          <span class="navbar__logo-text">box</span>
        </NuxtLink>
      </div>

      <nav class="navbar__nav" aria-label="Nawigacja glowna">
        <NuxtLink to="/" class="navbar__nav-link" :class="{ 'navbar__nav-link--active': route.path === '/' }">
          Strona glowna
        </NuxtLink>
        <NuxtLink to="/filmy" class="navbar__nav-link" :class="{ 'navbar__nav-link--active': route.path === '/filmy' }">
          Filmy
        </NuxtLink>
        <NuxtLink to="/seriale" class="navbar__nav-link" :class="{ 'navbar__nav-link--active': route.path === '/seriale' }">
          Seriale
        </NuxtLink>
        <NuxtLink to="/moja-lista" class="navbar__nav-link" :class="{ 'navbar__nav-link--active': route.path === '/moja-lista' }">
          Moja lista
        </NuxtLink>
      </nav>

      <div class="navbar__actions">
        <div class="navbar__search" :class="{ 'navbar__search--open': searchOpen }">
          <button class="navbar__icon-button" type="button" title="Szukaj" @click="openSearch">
            <span class="navbar__icon navbar__icon--search"></span>
          </button>

          <form class="navbar__search-form" @submit.prevent="submitSearch">
            <input
              ref="searchField"
              v-model="searchInput"
              class="navbar__search-input"
              type="search"
              placeholder="Szukaj filmow, seriali i kategorii"
              @focus="searchOpen = true"
            >
          </form>

          <div v-if="searchOpen" class="navbar__search-dropdown">
            <p class="navbar__dropdown-label">Szukaj</p>
            <p class="navbar__search-hint">
              Wpisz tytul, opis lub gatunek i nacisnij Enter.
            </p>

            <div v-if="searchPreview.length" class="navbar__search-results">
              <NuxtLink
                v-for="item in searchPreview"
                :key="item.id"
                :to="`/watch/${item.id}`"
                class="navbar__search-result"
                @click="searchOpen = false"
              >
                <span class="navbar__search-result-title">{{ item.title }}</span>
                <span class="navbar__search-result-meta">{{ item.type === 'film' ? 'Film' : 'Serial' }} / {{ item.genres.join(', ') }}</span>
              </NuxtLink>
            </div>

            <button v-else-if="searchInput.trim()" class="navbar__search-empty" type="button" @click="submitSearch">
              Zobacz pelne wyniki dla "{{ searchInput }}"
            </button>

            <div v-else class="navbar__search-tags">
              <button
                v-for="genre in categories.slice(0, 4)"
                :key="genre"
                class="navbar__genre-pill"
                type="button"
                @click="searchCategory(genre)"
              >
                {{ genre }}
              </button>
            </div>
          </div>
        </div>

        <div class="navbar__menu navbar__menu--hover">
          <button class="navbar__icon-button navbar__icon-button--dots" type="button" title="Kategorie">
            <span class="navbar__dots">
              <span v-for="index in 9" :key="index" class="navbar__dot"></span>
            </span>
          </button>

          <div class="navbar__dropdown navbar__dropdown--categories">
            <div class="navbar__dropdown-columns">
              <div>
                <p class="navbar__dropdown-label">Kategorie</p>
                <button
                  v-for="genre in categories"
                  :key="genre"
                  class="navbar__dropdown-link navbar__dropdown-link--button"
                  type="button"
                  @click="searchCategory(genre)"
                >
                  {{ genre }}
                </button>
              </div>

              <div>
                <p class="navbar__dropdown-label">Przegladaj</p>
                <NuxtLink to="/filmy" class="navbar__dropdown-link">Filmy</NuxtLink>
                <NuxtLink to="/seriale" class="navbar__dropdown-link">Seriale</NuxtLink>
                <NuxtLink to="/moja-lista" class="navbar__dropdown-link">Ogladaj dalej</NuxtLink>
                <NuxtLink to="/about" class="navbar__dropdown-link">O projekcie</NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div class="navbar__menu">
          <button class="navbar__icon-button navbar__icon-button--bookmark" type="button" title="Moja lista" @click="watchlistOpen = !watchlistOpen">
            <span class="navbar__icon navbar__icon--bookmark"></span>
          </button>

          <div v-if="watchlistOpen" class="navbar__dropdown navbar__dropdown--watchlist">
            <p class="navbar__dropdown-label">Twoje listy</p>

            <div v-if="continueItems.length" class="navbar__dropdown-section">
              <p class="navbar__dropdown-subtitle">Kontynuuj ogladanie</p>
              <NuxtLink
                v-for="item in continueItems.slice(0, 4)"
                :key="item.id"
                :to="`/watch/${item.id}`"
                class="navbar__dropdown-link"
              >
                {{ item.title }}
              </NuxtLink>
            </div>

            <div v-if="watchlistItems.length" class="navbar__dropdown-section">
              <p class="navbar__dropdown-subtitle">Moja lista</p>
              <NuxtLink
                v-for="item in watchlistItems.slice(0, 4)"
                :key="item.id"
                :to="`/watch/${item.id}`"
                class="navbar__dropdown-link"
              >
                {{ item.title }}
              </NuxtLink>
            </div>

            <NuxtLink to="/moja-lista" class="navbar__dropdown-link navbar__dropdown-link--strong">
              Otworz pelna liste
            </NuxtLink>
          </div>
        </div>

        <PwaInstallButton />

        <div class="navbar__menu">
          <button class="navbar__avatar" type="button" @click="accountOpen = !accountOpen">
            {{ currentProfile?.name?.charAt(0) || 'P' }}
          </button>

          <div v-if="accountOpen" class="navbar__dropdown navbar__dropdown--account">
            <p class="navbar__dropdown-label">Aktywny profil</p>
            <p class="navbar__profile-name">{{ currentProfile?.name }}</p>
            <p class="navbar__profile-meta">
              {{ currentProfile?.kids ? 'Tryb dzieci' : 'Tryb standardowy' }}
            </p>

            <button class="navbar__profile-button" type="button" @click="openProfileSelector">
              Zarzadzaj profilami
            </button>
            <NuxtLink to="/about" class="navbar__dropdown-link">O aplikacji</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background:
    linear-gradient(180deg, rgba(1, 10, 20, 0.96), rgba(1, 10, 20, 0.9) 72%, rgba(1, 10, 20, 0.4)),
    #05101b;
  backdrop-filter: blur(18px);
}

.navbar__container {
  display: flex;
  align-items: center;
  gap: 30px;
  max-width: 1520px;
  margin: 0 auto;
  padding: 14px 24px;
}

.navbar__brand {
  flex: 0 0 auto;
}

.navbar__logo {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  color: #ffffff;
  font-size: 31px;
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 0.9;
}

.navbar__logo-mark {
  color: #cfd8e3;
  font-weight: 600;
}

.navbar__logo-text {
  color: #ffffff;
}

.navbar__nav {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: auto;
}

.navbar__nav-link {
  padding: 11px 16px;
  border-radius: 13px;
  color: #e8eef5;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.navbar__nav-link:hover {
  background: rgba(255, 255, 255, 0.08);
}

.navbar__nav-link--active {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.17), rgba(255, 255, 255, 0.09));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.navbar__menu,
.navbar__search {
  position: relative;
}

.navbar__icon-button,
.navbar__avatar {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.navbar__icon-button:hover,
.navbar__avatar:hover {
  background: rgba(255, 255, 255, 0.08);
}

.navbar__avatar {
  background: linear-gradient(135deg, #3097ff, #1f74d9);
  font-weight: 700;
}

.navbar__icon {
  position: relative;
  display: block;
  width: 18px;
  height: 18px;
}

.navbar__icon--search::before,
.navbar__icon--search::after {
  content: "";
  position: absolute;
}

.navbar__icon--search::before {
  inset: 0 4px 4px 0;
  border: 2px solid #ffffff;
  border-radius: 50%;
}

.navbar__icon--search::after {
  right: 0;
  bottom: 0;
  width: 8px;
  height: 2px;
  border-radius: 999px;
  background: #ffffff;
  transform: rotate(45deg);
  transform-origin: center;
}

.navbar__icon--bookmark::before,
.navbar__icon--bookmark::after {
  content: "";
  position: absolute;
}

.navbar__icon--bookmark::before {
  inset: 0;
  border: 2px solid #ffffff;
  border-radius: 4px;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 76%, 0 100%);
}

.navbar__dots {
  display: grid;
  grid-template-columns: repeat(3, 4px);
  gap: 3px;
}

.navbar__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ffffff;
}

.navbar__search {
  display: flex;
  align-items: center;
  min-width: 40px;
  min-height: 40px;
  border-radius: 999px;
}

.navbar__search--open {
  padding-right: 8px;
  background: rgba(255, 255, 255, 0.06);
}

.navbar__search-form {
  overflow: hidden;
}

.navbar__search-input {
  width: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: #ffffff;
  font-size: 14px;
  outline: none;
  transition: width 0.24s ease, padding 0.24s ease;
}

.navbar__search-input::placeholder {
  color: #8ea2b7;
}

.navbar__search--open .navbar__search-input {
  width: 290px;
  padding: 0 10px 0 2px;
}

.navbar__dropdown,
.navbar__search-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  min-width: 290px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  background:
    radial-gradient(circle at top right, rgba(73, 160, 255, 0.14), transparent 26%),
    rgba(8, 18, 29, 0.98);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.46);
}

.navbar__search-dropdown {
  width: 360px;
}

.navbar__menu--hover:hover .navbar__dropdown,
.navbar__menu--hover:focus-within .navbar__dropdown {
  display: block;
}

.navbar__menu--hover .navbar__dropdown {
  display: none;
}

.navbar__dropdown--categories {
  width: 540px;
}

.navbar__dropdown--watchlist {
  width: 320px;
}

.navbar__dropdown--account {
  width: 300px;
}

.navbar__dropdown-columns {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr;
  gap: 24px;
}

.navbar__dropdown-label {
  margin: 0 0 12px;
  color: #7fbaff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.navbar__dropdown-subtitle {
  margin: 12px 0 8px;
  color: #8ba0b6;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.navbar__dropdown-link,
.navbar__profile-button {
  display: block;
  width: 100%;
  padding: 9px 0;
  border: none;
  background: transparent;
  color: #f3f7fb;
  text-align: left;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.navbar__dropdown-link:hover,
.navbar__profile-button:hover,
.navbar__search-result:hover {
  color: #7ec4ff;
}

.navbar__dropdown-link--button {
  padding-right: 8px;
}

.navbar__dropdown-link--strong {
  margin-top: 8px;
  color: #7ec4ff;
}

.navbar__dropdown-section + .navbar__dropdown-section {
  margin-top: 6px;
}

.navbar__search-hint {
  margin: 0 0 14px;
  color: #afc1d1;
  font-size: 14px;
  line-height: 1.5;
}

.navbar__search-results {
  display: grid;
  gap: 4px;
}

.navbar__search-result {
  display: block;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.navbar__search-result:last-child {
  border-bottom: none;
}

.navbar__search-result-title {
  display: block;
  font-size: 15px;
  font-weight: 700;
}

.navbar__search-result-meta {
  display: block;
  margin-top: 3px;
  color: #90a6bb;
  font-size: 12px;
}

.navbar__search-empty {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(126, 196, 255, 0.22);
  border-radius: 14px;
  background: rgba(126, 196, 255, 0.08);
  color: #ffffff;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.navbar__search-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.navbar__genre-pill {
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: #ebf3fa;
  cursor: pointer;
}

.navbar__profile-name {
  margin: 0 0 4px;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.navbar__profile-meta {
  margin: 0 0 14px;
  color: #9cb1c5;
  font-size: 14px;
}
</style>
