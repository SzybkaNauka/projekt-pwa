<script setup lang="ts">
const { isAuthenticated, ensureProfileLogin } = useProfiles()

if (!isAuthenticated.value) {
  ensureProfileLogin()
}
</script>

<template>
  <div class="app-shell">
    <AppNavbar />
    <ProfileSelector />
    <NuxtPage />
  </div>
</template>
