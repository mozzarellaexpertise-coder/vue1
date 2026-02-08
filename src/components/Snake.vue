<template>
  <div class="game-container" @keydown="changeDirection" tabindex="0" ref="gameArea">
    <div class="score">Score: {{ score }}</div>
    <div class="grid">
      <div
        v-for="(cell, index) in grid"
        :key="index"
        :class="getCellClass(cell)"
      ></div>
    </div>
    <button @click="resetGame">Restart</button>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';

export default {
  setup() {
    const gridSize = 20; // 20x20 grid
    const grid = reactive(Array.from({ length: gridSize * gridSize }, () => 0));
    const snake = reactive([{ x: 10, y: 10 }]);
    const direction = ref({ x: 0, y: -1 }); // start moving up
    const food = reactive({ x: 5, y: 5 });
    const score = ref(0);
    const gameInterval = ref(null);
    const gameArea = ref(null);

    const getIndex = (x, y) => y * gridSize + x;

    const getCellClass = (cellValue) => {
      if (cellValue === 'snake') return 'snake';
      if (cellValue === 'food') return 'food';
      return '';
    };

    const placeFood = () => {
      let x, y, index;
      do {
        x = Math.floor(Math.random() * gridSize);
        y = Math.floor(Math.random() * gridSize);
        index = getIndex(x, y);
      } while (grid[index] === 'snake');
      food.x = x;
      food.y = y;
    };

    const initializeGrid = () => {
      for (let i = 0; i < grid.length; i++) {
        grid[i] = 0;
      }
      // Place snake
      snake.forEach((part) => {
        grid[getIndex(part.x, part.y)] = 'snake';
      });
      // Place food
      grid[getIndex(food.x, food.y)] = 'food';
    };

    const moveSnake = () => {
      const head = { ...snake[0] };
      head.x += direction.value.x;
      head.y += direction.value.y;

      // Check collisions
      if (
        head.x < 0 ||
        head.x >= gridSize ||
        head.y < 0 ||
        head.y >= gridSize ||
        snake.some((part) => part.x === head.x && part.y === head.y)
      ) {
        alert('Game Over! Your score: ' + score.value);
        resetGame();
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        score.value++;
        placeFood();
      } else {
        snake.pop();
      }
      initializeGrid();
    };

    const changeDirection = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.value.y !== 1) direction.value = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (direction.value.y !== -1) direction.value = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (direction.value.x !== 1) direction.value = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (direction.value.x !== -1) direction.value = { x: 1, y: 0 };
          break;
      }
    };

    const startGame = () => {
      if (gameInterval.value) clearInterval(gameInterval.value);
      gameInterval.value = setInterval(moveSnake, 200);
    };

    const resetGame = () => {
      snake.splice(0);
      snake.push({ x: 10, y: 10 });
      direction.value = { x: 0, y: -1 };
      score.value = 0;
      placeFood();
      initializeGrid();
      startGame();
    };

    onMounted(() => {
      resetGame();
      // focus on game area for keyboard input
      if (gameArea.value) {
        gameArea.value.focus();
      }
    });

    onBeforeUnmount(() => {
      clearInterval(gameInterval.value);
    });

    return {
      grid,
      getCellClass,
      changeDirection,
      score,
      resetGame,
      gameArea,
    };
  },
};
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: none;
  margin-top: 20px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(20, 20px);
  grid-template-rows: repeat(20, 20px);
  gap: 1px;
  background-color: #333;
  margin-top: 10px;
}
.grid div {
  width: 20px;
  height: 20px;
}
.snake {
  background-color: green;
}
.food {
  background-color: red;
}
.score {
  font-size: 24px;
}
button {
  margin-top: 10px;
  padding: 8px 16px;
  font-size: 16px;
}
</style>
