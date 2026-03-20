<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <header>
      <nav>
        <RouterLink to="/">Branches</RouterLink>
        <RouterLink to="/employees">Employees</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
header {
  background: #2196f3;
  padding: 1rem;
}

nav {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
}

nav a:hover {
  background: rgba(255, 255, 255, 0.1);
}

nav a.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}

main {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}
</style>