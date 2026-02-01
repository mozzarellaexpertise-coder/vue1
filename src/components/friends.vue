<script setup>
import { ref, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

// ===============================
// SUPABASE CLIENT
// ===============================
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)

// ===============================
// STATE VARIABLES
// ===============================
const friends = ref([])
const searchname = ref('')
const newFriendName = ref('')
const newFriendAge = ref('')

// ===============================
// LOAD FRIENDS
// ===============================
async function loadFriends() {
  const { data } = await supabase
    .from('table1')
    .select('*')
    .order('id', { ascending: true })
  // Force age to number to avoid v-model issues
  friends.value = data?.map(f => ({ ...f, age: Number(f.age) })) || []
}

// ===============================
// SEARCH FRIENDS
// ===============================
async function rowsearch(name) {
  const { data } = await supabase
    .from('table1')
    .select('*')
    .ilike('name', `%${name}%`)
    .order('id', { ascending: true })
  friends.value = data?.map(f => ({ ...f, age: Number(f.age) })) || []
}

// ===============================
// ADD FRIEND
// ===============================
async function addFriend() {
  if (!newFriendName.value || !newFriendAge.value) return
  const { error } = await supabase
    .from('table1')
    .insert([{
      name: newFriendName.value,
      age: parseInt(newFriendAge.value)
    }])
  if (error) return alert('Error adding friend: ' + error.message)
  newFriendName.value = ''
  newFriendAge.value = ''
  await loadFriends()
}

// ===============================
// UPDATE FRIEND
// ===============================
async function updateFriend(friend) {
  friend.age = Number(friend.age) || 0
  const { error } = await supabase
    .from('table1')
    .update({ name: friend.name, age: friend.age })
    .eq('id', friend.id)
  if (error) alert('Error updating friend: ' + error.message)
  else await loadFriends()
}

// ===============================
// DELETE FRIEND
// ===============================
async function deleteFriend(friendId) {
  const { error } = await supabase
    .from('table1')
    .delete()
    .eq('id', friendId)
  if (error) alert('Error deleting friend: ' + error.message)
  else await loadFriends()
}

// ===============================
// ON MOUNT
// ===============================
onMounted(() => {
  loadFriends()
})
</script>

<template>
  <div class="container">
    <h1 class="title">🟦 Friends List</h1>

    <!-- ADD FRIEND -->
    <div class="add-friend-form">
      <input v-model="newFriendName" type="text" placeholder="Name" />
      <input v-model="newFriendAge" type="number" placeholder="Age" />
      <button @click="addFriend">Add</button>
    </div>

    <!-- SEARCH -->
    <div class="search-bar">
      <input v-model="searchname" type="text" placeholder="Search friends..." />
      <button @click="rowsearch(searchname)">Search</button>
    </div>

    <!-- FRIENDS LIST -->
    <ul class="friends-list">
      <li v-for="friend in friends" :key="friend.id" class="friend-card">
        <input v-model="friend.name" @change="updateFriend(friend)" />
        <input v-model.number="friend.age" @change="updateFriend(friend)" type="number" />
        <button @click="deleteFriend(friend.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  max-width: 550px;
  margin: 30px auto;
  padding: 20px;
  background-color: #0f172a;
  border-radius: 12px;
  color: #f1f5f9;
  box-shadow: 0 6px 18px rgba(0,0,0,0.3);
}

/* TITLE */
.title {
  text-align: center;
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  margin-bottom: 25px;
  color: #38bdf8;
}

/* ADD FRIEND FORM */
.add-friend-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.add-friend-form input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #38bdf8;
  background-color: #1e293b;
  color: #f1f5f9;
}

.add-friend-form button {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background-color: #38bdf8;
  color: #0f172a;
  font-weight: bold;
  cursor: pointer;
}

/* SEARCH BAR */
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-bar input {
  flex-grow: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #38bdf8;
  background-color: #1e293b;
  color: #f1f5f9;
}

.search-bar input::placeholder {
  color: #94a3b8;
}

.search-bar button {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background-color: #38bdf8;
  color: #0f172a;
  font-weight: bold;
  cursor: pointer;
}

.search-bar button:hover {
  background-color: #0ea5e9;
}

/* FRIENDS LIST */
.friends-list {
  list-style: none;
  padding: 0;
  max-height: 350px;
  overflow-y: auto;
}

.friend-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  margin-bottom: 10px;
  background-color: #1e293b;
  border-radius: 8px;
  transition: transform 0.2s, background-color 0.2s;
}

.friend-card:hover {
  transform: translateY(-2px);
  background-color: #334155;
}

.friend-card input {
  width: 100px;
  margin-right: 10px;
  border-radius: 6px;
  border: 1px solid #38bdf8;
  padding: 4px 8px;
  background-color: #0f172a;
  color: #f1f5f9;
}

.friend-card button {
  background-color: #ef4444;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  color: #f1f5f9;
  cursor: pointer;
  transition: background-color 0.2s;
}

.friend-card button:hover {
  background-color: #dc2626;
}
</style>