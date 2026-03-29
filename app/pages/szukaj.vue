<script setup lang="ts">
const route = useRoute()

const { catalog, filterVisible } = useCatalog()
const { currentProfile, hiddenIds } = useProfiles()

const search = computed(() => String(route.query.q || '').trim().toLowerCase())
const visibleCatalog = computed(() => filterVisible(catalog, currentProfile.value, hiddenIds.value))

const results = computed(() =>
  visibleCatalog.value.filter((item) => {
    if (!search.value) {
      return true
    }

    return [
      item.title,
      item.description,
      item.shortDescription,
      ...item.genres,
    ].some(value => value.toLowerCase().includes(search.value))
  }),
)

const resultLabel = computed(() => {
  if (!search.value) {
    return 'Wpisz fraze w pasku wyszukiwania, aby zobaczyc wszystkie trafienia.'
  }

  if (results.value.length) {
    return `Znalezione tytuly dla: ${String(route.query.q || '')}`
  }

  return `Brak wynikow dla: ${String(route.query.q || '')}`
})
</script>

<template>
  <main class="search-page">
    <section class="search-page__hero page-wrap">
      <p class="search-page__eyebrow">Wyszukiwanie</p>
      <h1 class="search-page__title">Szukajka</h1>
      <p class="search-page__text">{{ resultLabel }}</p>
    </section>

    <MediaRow
      title="Wyniki"
      subtitle="Wyszukiwarka sprawdza tytuly, opisy i gatunki z aktualnej biblioteki."
      :items="results"
    />
  </main>
</template>

<style scoped>
.search-page {
  padding-top: 18px;
  padding-bottom: 40px;
}

.search-page__hero {
  padding-bottom: 22px;
}

.search-page__eyebrow {
  margin: 0 0 8px;
  color: #53b7ff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.search-page__title {
  margin: 0 0 10px;
  font-size: 52px;
  letter-spacing: -0.04em;
}

.search-page__text {
  margin: 0;
  color: #c5d2de;
  font-size: 18px;
  line-height: 1.6;
}
</style>
