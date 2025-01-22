import { ref } from "vue";
import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", () => {
  const showAbout = ref(false);

  const toggleAboutDialog = () => {
    showAbout.value = !showAbout.value;
  };

  return {
    showAbout,
    toggleAboutDialog,
  };
});
