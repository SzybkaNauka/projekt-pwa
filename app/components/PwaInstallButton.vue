<script setup lang="ts">
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const isInstallable = ref(false)
const isInstalled = ref(false)
const isInstalling = ref(false)

const checkInstalledState = () => {
  if (!import.meta.client) {
    return
  }

  const standaloneMatch = window.matchMedia('(display-mode: standalone)').matches
  const iosStandalone = 'standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  isInstalled.value = standaloneMatch || iosStandalone

  if (isInstalled.value) {
    isInstallable.value = false
    deferredPrompt.value = null
  }
}

const onBeforeInstallPrompt = (event: Event) => {
  event.preventDefault()
  deferredPrompt.value = event as BeforeInstallPromptEvent
  isInstallable.value = true
}

const onAppInstalled = () => {
  checkInstalledState()
}

const installApp = async () => {
  if (!deferredPrompt.value) {
    return
  }

  isInstalling.value = true

  try {
    await deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice

    if (outcome === 'accepted') {
      isInstallable.value = false
    }
  }
  finally {
    deferredPrompt.value = null
    isInstalling.value = false
  }
}

onMounted(() => {
  checkInstalledState()

  window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.addEventListener('appinstalled', onAppInstalled)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.removeEventListener('appinstalled', onAppInstalled)
})
</script>

<template>
  <button
    v-if="isInstallable && !isInstalled"
    class="install-button"
    type="button"
    :disabled="isInstalling"
    @click="installApp"
  >
    {{ isInstalling ? 'Instalowanie...' : 'Zainstaluj appke' }}
  </button>
</template>

<style scoped>
.install-button {
  height: 42px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: linear-gradient(135deg, #1f80d7, #39b3ff);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  box-shadow: 0 10px 22px rgba(31, 128, 215, 0.24);
}

.install-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 26px rgba(31, 128, 215, 0.3);
}

.install-button:disabled {
  opacity: 0.7;
  cursor: wait;
  transform: none;
  box-shadow: none;
}

@media (max-width: 640px) {
  .install-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
