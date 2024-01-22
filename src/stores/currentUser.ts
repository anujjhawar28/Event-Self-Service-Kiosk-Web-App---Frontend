import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('currentUser', () => {
  const currentUser = ref(Object())
  const getCurrentUser = computed(() => currentUser.value)
  const updateUser = (user: any) => {
    currentUser.value = user;
  }

  return { currentUser, getCurrentUser, updateUser }
})
