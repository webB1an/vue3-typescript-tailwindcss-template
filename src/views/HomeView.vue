<script setup lang="ts"></script>

<template>
  <div class="home flex h-full w-full flex-col items-center justify-center bg-amber-300">
    <h1 class="title text-4xl font-bold text-black">Welcome to the Home Page</h1>
    <router-link to="/about">About</router-link>
  </div>
</template>

<style scoped>
.home {
  .title {
    margin-bottom: 2rem;
  }
}
</style>
