<script setup>
import { onMounted, onUnmounted } from "vue";

const emit = defineEmits(["close"]);

const handleEscape = (e) => {
  if (e.key === "Escape") {
    emit("close");
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});
</script>

<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white p-6 rounded-lg max-w-md">
      <h2 class="text-xl font-bold mb-4">À propos de SoundFree Web</h2>
      <p class="mb-4">
        Version web de l'application SoundFree pour le téléchargement de
        musique.
      </p>
      <button
        @click="$emit('close')"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Fermer
      </button>
    </div>
  </div>
</template>
