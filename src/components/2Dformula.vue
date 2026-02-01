<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'
import { evaluate } from 'mathjs'

/* ===============================
   SUPABASE CLIENT
================================ */
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)

/* ===============================
   STATE
================================ */
const formulas = ref([])        // Supabase formulas
const results = ref([])         // Supabase evaluated
const gravitySpecial = ref('')  // Special GRAVITY tail

const a = ref('')
const b = ref('')
const c = ref('')
const d = ref('')

/* ===============================
   COMPUTED
================================ */
const isReady = computed(() =>
  a.value !== '' && b.value !== '' && c.value !== '' && d.value !== ''
)

const AB = computed(() => Number(a.value + b.value))
const CD = computed(() => Number(c.value + d.value))

/* ===============================
   TAIL HELPER
================================ */
function tailDigit(value) {
  if (typeof value === 'number') {
    const str = Math.floor(value).toString()  // integer part only
    return str[str.length - 1]                // last digit
  }
  return value
}

/* ===============================
   LOAD FORMULAS
================================ */
async function loadFormulas() {
  const { data } = await supabase
    .from('formulas')
    .select('*')
    .order('id', { ascending: true })

  formulas.value = data || []
}

/* ===============================
   SPECIAL GRAVITY %
================================ */
function calculateGravitySpecial() {
  const g = (AB.value / 100) * CD.value
  gravitySpecial.value = tailDigit(g)
}

/* ===============================
   EVALUATE SUPABASE FORMULAS
================================ */
function evaluateSupabase() {
  if (!isReady.value) {
    results.value = []
    gravitySpecial.value = ''
    return
  }

  const scope = {
    a: Number(a.value),
    b: Number(b.value),
    c: Number(c.value),
    d: Number(d.value)
  }

  results.value = formulas.value.map(f => {
    try {
      const base = evaluate(f.formula, scope)
      return {
        id: f.id,
        name: f.name,
        tail: tailDigit(base)
      }
    } catch {
      return {
        id: f.id,
        name: f.name,
        tail: 'ERR'
      }
    }
  })
}

/* ===============================
   MAIN CALCULATE
================================ */
function calculate() {
  evaluateSupabase()
  calculateGravitySpecial()
}

/* ===============================
   UX
================================ */
function next(e) {
  if (e.target.value) e.target.nextElementSibling?.focus()
}

watch([a, b, c, d], () => {
  if (isReady.value) calculate()
})
onMounted(loadFormulas)
</script>

<template>
  <div class="screen">
    <div class="sentinel">      
      <div class="sentinel-title">
        <button @click="a=''; b=''; c=''; d=''; results=[]; gravitySpecial=''">
          CLEAR ALL
        </button>
      </div>
      
      <!-- INPUT -->
      <div class="input-strip">
        <input v-model="a" @input="next" maxlength="1" placeholder="A" type="tel" />
        <input v-model="b" @input="next" maxlength="1" placeholder="B" type="tel" />
        <input v-model="c" @input="next" maxlength="1" placeholder="C" type="tel" />
        <input v-model="d" @input="next" maxlength="1" placeholder="D" type="tel" />
      </div>

      <!-- SUPABASE FORMULAS -->
      <div v-if="results.length" class="matrix">
        <div v-for="item in results" :key="item.id" class="cell">
          <div class="cell-label glow">{{ item.name }}</div>
          <div class="cell-val">{{ item.tail }}</div>
        </div>
      </div>

      <!-- SPECIAL GRAVITY % -->
      <div v-if="gravitySpecial" class="gravity-panel">
        <div class="special-values">
          {{ gravitySpecial }}
        </div>
      </div>

      <div v-else class="waiting">ENTER 4-DIGIT SEED</div>
    </div>
  </div>
</template>

<style scoped>
.screen {
  height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle, #020617, #000);
}

.sentinel {
  width: min(780px, 95vw);
  min-height: 600px;
  background: #020617;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #1e293b;
  box-shadow: 0 0 50px rgba(56,189,248,0.15);
  font-family: ui-monospace, Menlo, monospace;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 16px;
  letter-spacing: 3px;
  opacity: 0.7;
  margin-bottom: 18px;
}

.input-strip {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.input-strip input {
  width: 68px;
  height: 60px;
  font-size: 30px;
  font-weight: 900;
  text-align: center;
  background: #0f172a;
  color: #fbbf24;
  border-radius: 10px;
  border: 1px solid #334155;
}

.matrix {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.cell {
  background: #0f172a;
  border-radius: 5px;
  padding: 5px;
  border: 1px solid #1e293b;
  text-align: center;
}

.cell-label {
  font-size: 11px;
  margin-bottom: 8px;
}

.glow {
  color: white;
  text-shadow:
    0 0 6px rgba(192, 70, 0, 0.8),
    0 0 14px rgba(231, 179, 34, 0.9);
}

.cell-val {
  font-size: 38px;
  font-weight: 900;
  color: #fbbf24;
}

.gravity-panel {
  margin-top: 5px;
  padding: 5px;
  border-radius: 5px;
  background: #11172e;
  border: 2px solid #fbbf24;
  text-align: center;
  font-size: 48px;
  font-weight: 900;
}

.waiting {
  display: grid;
  place-items: center;
  flex-grow: 1;
  opacity: 0.35;
  letter-spacing: 2px;
}
</style>