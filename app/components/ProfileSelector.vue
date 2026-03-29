<script setup lang="ts">
const {
  profiles,
  currentProfile,
  profileSelectorOpen,
  setActiveProfile,
  addProfile,
  removeProfile,
  closeProfileSelector,
} = useProfiles()

const newProfileName = ref('')
const newProfileKids = ref(false)

const handleAddProfile = () => {
  addProfile(newProfileName.value, newProfileKids.value)
  newProfileName.value = ''
  newProfileKids.value = false
}
</script>

<template>
  <div v-if="profileSelectorOpen" class="profile-modal">
    <div class="profile-modal__backdrop" @click="closeProfileSelector"></div>

    <div class="profile-modal__box">
      <div class="profile-modal__header">
        <h2 class="profile-modal__title">Wybierz profil</h2>
        <button class="profile-modal__close" type="button" @click="closeProfileSelector">X</button>
      </div>

      <div class="profile-modal__grid">
        <button
          v-for="profile in profiles"
          :key="profile.id"
          class="profile-card"
          type="button"
          @click="setActiveProfile(profile.id)"
        >
          <div class="profile-card__avatar" :style="{ backgroundColor: profile.color }">
            {{ profile.name.charAt(0) }}
          </div>
          <span class="profile-card__name">{{ profile.name }}</span>
          <span class="profile-card__meta">
            {{ profile.kids ? 'Profil dzieciecy' : 'Profil standardowy' }}
          </span>

          <span v-if="profile.id === currentProfile?.id" class="profile-card__active">
            Aktywny
          </span>

          <button
            v-if="profiles.length > 1 && profile.id !== currentProfile?.id"
            class="profile-card__delete"
            type="button"
            @click.stop="removeProfile(profile.id)"
          >
            Usun
          </button>
        </button>
      </div>

      <div class="profile-modal__create">
        <h3 class="profile-modal__subtitle">Dodaj profil</h3>

        <div class="profile-modal__form">
          <input
            v-model="newProfileName"
            class="profile-modal__input"
            type="text"
            maxlength="16"
            placeholder="Np. Gosc"
          >

          <label class="profile-modal__toggle">
            <input v-model="newProfileKids" type="checkbox">
            Profil dzieci
          </label>

          <button class="profile-modal__create-button" type="button" @click="handleAddProfile">
            Dodaj
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-modal {
  position: fixed;
  inset: 0;
  z-index: 200;
}

.profile-modal__backdrop {
  position: absolute;
  inset: 0;
  background-color: rgba(7, 19, 31, 0.78);
}

.profile-modal__box {
  position: relative;
  max-width: 980px;
  margin: 80px auto 0;
  padding: 28px;
  border-radius: 24px;
  background-color: #102131;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
}

.profile-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

.profile-modal__title {
  margin: 0;
  font-size: 32px;
}

.profile-modal__close {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}

.profile-modal__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.profile-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  background-color: #13273a;
  color: #fff;
  text-align: left;
  cursor: pointer;
}

.profile-card__avatar {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  margin-bottom: 16px;
  border-radius: 20px;
  font-size: 28px;
  font-weight: 700;
}

.profile-card__name {
  margin-bottom: 8px;
  font-size: 22px;
  font-weight: 700;
}

.profile-card__meta {
  color: #cdd7e1;
  font-size: 14px;
}

.profile-card__active {
  margin-top: 14px;
  padding: 6px 10px;
  border-radius: 999px;
  background-color: rgba(34, 228, 199, 0.14);
  color: #22e4c7;
  font-size: 12px;
  font-weight: 700;
}

.profile-card__delete {
  margin-top: 14px;
  padding: 8px 14px;
  border: none;
  border-radius: 12px;
  background-color: #25384b;
  color: #fff;
  cursor: pointer;
}

.profile-modal__create {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.profile-modal__subtitle {
  margin: 0 0 14px;
  font-size: 20px;
}

.profile-modal__form {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.profile-modal__input {
  min-width: 220px;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background-color: #13273a;
  color: #fff;
}

.profile-modal__toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #d7e1ea;
}

.profile-modal__create-button {
  padding: 12px 18px;
  border: none;
  border-radius: 12px;
  background-color: #1f80d7;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 900px) {
  .profile-modal__box {
    margin: 20px 16px 0;
  }

  .profile-modal__grid {
    grid-template-columns: 1fr;
  }
}
</style>
