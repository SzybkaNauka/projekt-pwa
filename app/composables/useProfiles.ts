export interface StreamProfile {
  id: string
  name: string
  color: string
  kids: boolean
}

export interface ContinueWatchingEntry {
  id: string
  currentTime: number
  duration: number
  progress: number
  updatedAt: number
}

const defaultProfiles: StreamProfile[] = [
  { id: 'p1', name: 'Piotr', color: '#1f80d7', kids: false },
  { id: 'p2', name: 'Dzieci', color: '#f59e0b', kids: true },
]

export const useProfiles = () => {
  const profiles = useState<StreamProfile[]>('profiles', () => defaultProfiles)
  const activeProfileId = useState<string>('active-profile-id', () => 'p1')
  const favoriteMap = useState<Record<string, string[]>>('favorite-map', () => ({
    p1: [],
    p2: [],
  }))
  const hiddenMap = useState<Record<string, string[]>>('hidden-map', () => ({
    p1: [],
    p2: [],
  }))
  const continueMap = useState<Record<string, ContinueWatchingEntry[]>>('continue-map', () => ({
    p1: [],
    p2: [],
  }))
  const profileSelectorOpen = useState('profile-selector-open', () => false)

  const ensureBucket = <T>(mapRef: Ref<Record<string, T[]>>, profileId: string) => {
    if (!profileId) {
      return
    }

    if (!mapRef.value[profileId]) {
      mapRef.value[profileId] = []
    }
  }

  const ensureAllBuckets = (profileId: string) => {
    ensureBucket(favoriteMap, profileId)
    ensureBucket(hiddenMap, profileId)
    ensureBucket(continueMap, profileId)
  }

  ensureAllBuckets(activeProfileId.value)

  const currentProfile = computed(
    () => profiles.value.find(profile => profile.id === activeProfileId.value) || profiles.value[0],
  )

  const favoriteIds = computed(() => {
    ensureBucket(favoriteMap, activeProfileId.value)
    return favoriteMap.value[activeProfileId.value] || []
  })

  const hiddenIds = computed(() => {
    ensureBucket(hiddenMap, activeProfileId.value)
    return hiddenMap.value[activeProfileId.value] || []
  })

  const continueWatchingEntries = computed(() => {
    ensureBucket(continueMap, activeProfileId.value)
    return [...(continueMap.value[activeProfileId.value] || [])].sort((a, b) => b.updatedAt - a.updatedAt)
  })

  const setActiveProfile = (profileId: string) => {
    activeProfileId.value = profileId
    ensureAllBuckets(profileId)
    profileSelectorOpen.value = false
  }

  const openProfileSelector = () => {
    profileSelectorOpen.value = true
  }

  const closeProfileSelector = () => {
    profileSelectorOpen.value = false
  }

  const addProfile = (name: string, kids = false) => {
    const normalizedName = name.trim()

    if (!normalizedName || profiles.value.length >= 6) {
      return
    }

    const newId = `p${Date.now()}`

    profiles.value.push({
      id: newId,
      name: normalizedName,
      color: kids ? '#f59e0b' : '#10b981',
      kids,
    })

    ensureAllBuckets(newId)
  }

  const removeProfile = (profileId: string) => {
    if (profiles.value.length === 1) {
      return
    }

    profiles.value = profiles.value.filter(profile => profile.id !== profileId)
    delete favoriteMap.value[profileId]
    delete hiddenMap.value[profileId]
    delete continueMap.value[profileId]

    if (activeProfileId.value === profileId) {
      activeProfileId.value = profiles.value[0]?.id || ''
      ensureAllBuckets(activeProfileId.value)
    }
  }

  const isFavorite = (id: string) => favoriteIds.value.includes(id)
  const isHidden = (id: string) => hiddenIds.value.includes(id)

  const toggleFavorite = (id: string) => {
    favoriteMap.value[activeProfileId.value] = isFavorite(id)
      ? favoriteIds.value.filter(itemId => itemId !== id)
      : [...favoriteIds.value, id]
  }

  const hideTitle = (id: string) => {
    if (!isHidden(id)) {
      hiddenMap.value[activeProfileId.value] = [...hiddenIds.value, id]
    }
  }

  const unhideTitle = (id: string) => {
    hiddenMap.value[activeProfileId.value] = hiddenIds.value.filter(itemId => itemId !== id)
  }

  const updateContinueWatching = ({
    id,
    currentTime,
    duration,
  }: {
    id: string
    currentTime: number
    duration: number
  }) => {
    if (!duration || Number.isNaN(duration)) {
      return
    }

    const progress = Math.min(100, Math.round((currentTime / duration) * 100))

    if (progress >= 97) {
      removeFromContinueWatching(id)
      return
    }

    const list = [...(continueMap.value[activeProfileId.value] || [])]
    const existingIndex = list.findIndex(item => item.id === id)
    const payload: ContinueWatchingEntry = {
      id,
      currentTime,
      duration,
      progress,
      updatedAt: Date.now(),
    }

    if (existingIndex >= 0) {
      list[existingIndex] = payload
    } else {
      list.push(payload)
    }

    continueMap.value[activeProfileId.value] = list
  }

  const removeFromContinueWatching = (id: string) => {
    continueMap.value[activeProfileId.value] =
      continueWatchingEntries.value.filter(item => item.id !== id)
  }

  return {
    profiles,
    activeProfileId,
    currentProfile,
    favoriteIds,
    hiddenIds,
    continueWatchingEntries,
    profileSelectorOpen,
    setActiveProfile,
    openProfileSelector,
    closeProfileSelector,
    addProfile,
    removeProfile,
    isFavorite,
    isHidden,
    toggleFavorite,
    hideTitle,
    unhideTitle,
    updateContinueWatching,
    removeFromContinueWatching,
  }
}
