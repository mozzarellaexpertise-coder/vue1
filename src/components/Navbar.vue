<!-- components/Navbar.vue -->
<template>
  <nav class="navbar">
    <ul class="nav-list">
      <li><router-link to="/" class="nav-link">Home</router-link></li>
      <li><router-link to="/friends" class="nav-link">Friends</router-link></li>
      <li><router-link to="/2dformula" class="nav-link">2D-Breaks</router-link></li>
      <li><router-link to="/snake" class="nav-link">Snake Game</router-link></li>
      <!-- Add more links as needed -->
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped>
.navbar {
  background-color: #1e293b; /* darker blue-gray for modern look */
  padding: 0.5rem 1rem;       /* slimmer padding */
  border-radius: 8px;         /* subtle rounded corners */
}

.nav-list {
  list-style: none;
  display: flex;
  gap: 1rem;                  /* space between links */
  margin: 0;
  padding: 0;
}

.nav-list li {
  margin: 0;
}

.nav-link {
  color: #f8fafc;            /* brighter, almost white text */
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;        /* slightly smaller text */
  transition: color 0.2s;
}

.nav-link:hover {
  color: #38bdf8;            /* bright cyan on hover */
}

.router-link-active {
  font-weight: 700;
  text-decoration: underline;
  color: #22d3ee;            /* highlight active link */
}
</style>
