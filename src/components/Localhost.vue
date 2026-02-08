<template>
  <div class="container">
    <h1>My Personal Server</h1>

    <!-- Add Fruit -->
    <form class="add-form" @submit.prevent="addFruit">
      <input
        v-model="newFruit"
        type="text"
        placeholder="Fruit name"
      />

      <input
        v-model.number="quantity"
        type="number"
        min="0"
        placeholder="Qty"
      />

      <button :disabled="loading">
        {{ loading ? 'Adding...' : 'Add Fruit' }}
      </button>
    </form>

    <!-- Loading -->
    <p v-if="loading" class="loading">Loading fruits...</p>

    <!-- Fruit List -->
    <ul v-else class="fruit-list">
      <li v-for="fruit in fruits" :key="fruit.id">
        <span>
          <strong>{{ fruit.name }}</strong>
          <em>({{ fruit.quantity }})</em>
        </span>

        <button class="delete" @click="deleteFruit(fruit.name)">
          ❌
        </button>
      </li>
    </ul>

    <!-- Empty State -->
    <p v-if="!loading && fruits.length === 0" class="empty">
      No fruits yet 🍃
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const fruits = ref([]);
const newFruit = ref('');
const quantity = ref(1);
const loading = ref(false);

/* =========================
   FETCH ALL FRUITS
========================= */

async function fetchFruits() {
  loading.value = true;
  try {
    const res = await fetch('http://192.168.100.8:3000/api/fruits');
    const data = await res.json();

    fruits.value = Array.isArray(data) ? data : data.data;
  } catch (err) {
    console.error('Fetch error:', err);
  } finally {
    loading.value = false;
  }
}

/* =========================
   ADD FRUIT
========================= */
async function addFruit() {
  if (!newFruit.value.trim()) return;

  loading.value = true;
  try {
    const res = await fetch('http://192.168.100.8:3000/api/fruits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fruit: newFruit.value,
        quantity: quantity.value
      })
    });

    const data = await res.json();
    fruits.value.unshift(data);

    newFruit.value = '';
    quantity.value = 1;
  } catch (err) {
    console.error('Add error:', err);
  } finally {
    loading.value = false;
  }
}

/* =========================
   DELETE FRUIT
========================= */
async function deleteFruit(name) {
  try {
    await fetch(
      `http://192.168.100.8:3000/api/fruits/${encodeURIComponent(name)}`,
      { method: 'DELETE' }
    );

    fruits.value = fruits.value.filter(f => f.name !== name);
  } catch (err) {
    console.error('Delete error:', err);
  }
}

onMounted(fetchFruits);
</script>