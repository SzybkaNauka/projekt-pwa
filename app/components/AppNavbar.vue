<script setup lang="ts">
const route = useRoute()

const categoriesOpen = ref(false)
const accountOpen = ref(false)
const watchlistOpen = ref(false)

const { getByIds } = useCatalog()
const {
  currentProfile,
  favoriteIds,
  continueWatchingEntries,
  openProfileSelector,
} = useProfiles()

const watchlistItems = computed(() => getByIds(favoriteIds.value))
const continueItems = computed(() => getByIds(continueWatchingEntries.value.map(item => item.id)))

watch(
  () => route.fullPath,
  () => {
    categoriesOpen.value = false
    accountOpen.value = false
    watchlistOpen.value = false
  },
)
</script>

<template>
  <header class="navbar">
    <div class="navbar__container">
      <NuxtLink to="/" class="navbar__logo">
        StreamBox
      </NuxtLink>

      <nav class="navbar__nav">
        <NuxtLink to="/" class="navbar__link" :class="{ 'navbar__link--active': route.path === '/' }">
          Strona glowna
        </NuxtLink>
        <NuxtLink to="/filmy" class="navbar__link" :class="{ 'navbar__link--active': route.path === '/filmy' }">
          Filmy
        </NuxtLink>
        <NuxtLink to="/seriale" class="navbar__link" :class="{ 'navbar__link--active': route.path === '/seriale' }">
          Seriale
        </NuxtLink>
        <NuxtLink to="/moja-lista" class="navbar__link" :class="{ 'navbar__link--active': route.path === '/moja-lista' }">
          Moja lista
        </NuxtLink>
      </nav>

      <div class="navbar__actions">
        <PwaInstallButton />

        <NuxtLink class="navbar__icon" to="/filmy" title="Szukaj">
          S
        </NuxtLink>

        <div class="navbar__dropdown-wrap">
          <button class="navbar__icon" type="button" title="Kategorie" @click="categoriesOpen = !categoriesOpen">
            K
          </button>

          <div v-if="categoriesOpen" class="navbar__dropdown navbar__dropdown--wide">
            <div class="navbar__columns">
              <div>
                <p class="navbar__dropdown-label">Gatunki</p>
                <NuxtLink to="/filmy" class="navbar__dropdown-link">Akcja i thriller</NuxtLink>
                <NuxtLink to="/filmy" class="navbar__dropdown-link">Sci-fi</NuxtLink>
                <NuxtLink to="/filmy" class="navbar__dropdown-link">Dramaty</NuxtLink>
                <NuxtLink to="/seriale" class="navbar__dropdown-link">Seriale kryminalne</NuxtLink>
                <NuxtLink to="/seriale" class="navbar__dropdown-link">Nowe sezony</NuxtLink>
                <NuxtLink to="/seriale" class="navbar__dropdown-link">Dla dzieci</NuxtLink>
              </div>

              <div>
                <p class="navbar__dropdown-label">Polecane</p>
                <NuxtLink to="/filmy" class="navbar__dropdown-link">Nowe i nadchodzace</NuxtLink>
                <NuxtLink to="/moja-lista" class="navbar__dropdown-link">Kontynuuj ogladanie</NuxtLink>
                <NuxtLink to="/moja-lista" class="navbar__dropdown-link">Ulubione</NuxtLink>
                <NuxtLink to="/about" class="navbar__dropdown-link">O aplikacji</NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div class="navbar__dropdown-wrap">
          <button class="navbar__icon" type="button" title="Lista" @click="watchlistOpen = !watchlistOpen">
            L
          </button>

          <div v-if="watchlistOpen" class="navbar__dropdown">
            <p class="navbar__dropdown-label">Twoje skrzynki</p>
            <NuxtLink to="/moja-lista" class="navbar__dropdown-link">Zobacz wszystko</NuxtLink>

            <div v-if="watchlistItems.length" class="navbar__dropdown-group">
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

            <div v-if="continueItems.length" class="navbar__dropdown-group">
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
          </div>
        </div>

        <div class="navbar__dropdown-wrap">
          <button class="navbar__avatar" type="button" @click="accountOpen = !accountOpen">
            {{ currentProfile?.name?.charAt(0) || 'P' }}
          </button>

          <div v-if="accountOpen" class="navbar__dropdown navbar__dropdown--account">
            <div class="navbar__columns">
              <div>
                <p class="navbar__dropdown-label">Twoje konto</p>
                <button class="navbar__menu-button" type="button" @click="openProfileSelector">
                  Profile
                </button>
                <NuxtLink to="/moja-lista" class="navbar__dropdown-link">Moja lista</NuxtLink>
                <NuxtLink to="/about" class="navbar__dropdown-link">O aplikacji</NuxtLink>
              </div>

              <div>
                <p class="navbar__dropdown-label">Aktywny profil</p>
                <p class="navbar__active-profile">{{ currentProfile?.name }}</p>
                <p class="navbar__active-meta">
                  {{ currentProfile?.kids ? 'Tryb dzieci' : 'Tryb standardowy' }}
                </p>
                <button class="navbar__menu-button" type="button" @click="openProfileSelector">
                  Zmien profil
                </button>
              </div>
            </div>
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
  background: linear-gradient(180deg, rgba(7, 19, 31, 0.96), rgba(7, 19, 31, 0.74));
  backdrop-filter: blur(12px);
}

.navbar__container {
  display: flex;
  align-items: center;
  gap: 24px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 18px 24px;
}

.navbar__logo {
  font-size: 30px;
  font-weight: 700;
  color: #fff;
}

.navbar__nav {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-right: auto;
}

.navbar__link {
  color: #d7e1ea;
  font-weight: 700;
}

.navbar__link--active {
  color: #ffffff;
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.navbar__dropdown-wrap {
  position: relative;
}

.navbar__icon,
.navbar__avatar {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.navbar__avatar {
  background-color: #1f80d7;
}

.navbar__dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  min-width: 280px;
  padding: 18px;
  border-radius: 18px;
  background: rgba(23, 37, 53, 0.98);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.4);
}

.navbar__dropdown--wide {
  width: 680px;
}

.navbar__dropdown--account {
  width: 460px;
}

.navbar__columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.navbar__dropdown-label {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8ea2b6;
}

.navbar__dropdown-subtitle {
  margin: 12px 0 10px;
  font-size: 14px;
  color: #8ea2b6;
}

.navbar__dropdown-group {
  margin-top: 10px;
}

.navbar__dropdown-link,
.navbar__menu-button {
  display: block;
  width: 100%;
  padding: 10px 0;
  border: none;
  background: none;
  color: #fff;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
}

.navbar__active-profile {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
}

.navbar__active-meta {
  margin: 0 0 10px;
  color: #9bb0c5;
}

@media (max-width: 980px) {
  .navbar__container {
    flex-wrap: wrap;
  }

  .navbar__nav {
    width: 100%;
    justify-content: center;
    order: 3;
    flex-wrap: wrap;
  }

  .navbar__dropdown--wide,
  .navbar__dropdown--account {
    width: 320px;
  }

  .navbar__columns {
    grid-template-columns: 1fr;
  }
}
</style>
