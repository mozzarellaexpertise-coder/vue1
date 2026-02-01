<script setup>
import { ref, computed } from 'vue'

const newEntry = ref('');
const searchQuery = ref('');
const logEntries = ref([]);

// Add new entry to log
function addToLog() {
  if (!newEntry.value.trim()) return;
  logEntries.value.push(newEntry.value);
  newEntry.value = '';
}

// Filtered list based on search query
const filteredLogs = computed(() => {
  if (!searchQuery.value.trim()) return logEntries.value;
  return logEntries.value.filter(line => 
    line.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <div class="practice-box">
    <h1>Vue Practice Log</h1>
    
    <!-- Add New Entry Section -->
    <div class="section">
      <h2>Add a New Entry</h2>
      <div class="controls">
        <input 
          type="text" 
          v-model="newEntry" 
          placeholder="Type new activity..."
          @keyup.enter="addToLog" 
        />
        <button @click="addToLog" :disabled="!newEntry">Add</button>
      </div>
    </div>
    
    <!-- Search Section -->
    <div class="section">
      <h2>Search Log</h2>
      <div class="controls">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search activities..."
        />
      </div>
    </div>
    
    <!-- Log Display -->
    <div class="log-container">
      <h3>
        {{ searchQuery ? 'Search Results' : 'Activity Log' }} 
        <span>({{ filteredLogs.length }})</span>
      </h3>
      
      <div class="display-area">
        <div v-for="(line, index) in filteredLogs" :key="index" class="log-line">
          {{ line }}
        </div>
        <div v-if="filteredLogs.length === 0" class="empty-state">
          No entries found.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.practice-box {
  max-width: 600px;
  margin: 20px auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.section {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 8px;
  font-size: 1.2em;
  color: #555;
}

.controls {
  display: flex;
  gap: 10px;
}

input {
  flex-grow: 1;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 6px;
  outline: none;
}

input:focus { border-color: #42b883; }

button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0 15px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

button:disabled { background-color: #ccc; }

.log-container {
  margin-top: 20px;
}

.display-area {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
  min-height: 150px;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.log-line {
  padding: 8px;
  border-bottom: 1px solid #eee;
  background: white;
  margin-bottom: 4px;
  border-radius: 4px;
  animation: fadeIn 0.3s ease;
}

.empty-state {
  color: #999;
  text-align: center;
  margin-top: 20px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>