<template>
  <div class="container">
    <h1>🍎 Fruit Manager</h1>

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
    const res = await fetch('http://localhost:3000/api/fruits');
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
    const res = await fetch('http://localhost:3000/api/fruits', {
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
      `http://localhost:3000/api/fruits/${encodeURIComponent(name)}`,
      { method: 'DELETE' }
    );

    fruits.value = fruits.value.filter(f => f.name !== name);
  } catch (err) {
    console.error('Delete error:', err);
  }
}

onMounted(fetchFruits);
</script>

<style scoped>
.container {
  max-width: 420px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 12px;
  background: #fafafa;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  font-family: system-ui, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.add-form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.add-form input {
  flex: 1;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.add-form button {
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  background: #4caf50;
  color: white;
  cursor: pointer;
}

.add-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  color: #777;
}

.fruit-list {
  list-style: none;
  padding: 0;
}

.fruit-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #eee;
}

.fruit-list em {
  margin-left: 6px;
  color: #666;
}

.delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.empty {
  text-align: center;
  color: #999;
  margin-top: 16px;
}
</style>