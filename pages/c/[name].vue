<script setup lang="ts">
const route = useRoute();
const cdName = ref<string>(route.params.name as string);


</script>

<template>
  <div class="countdown-wrapper">
    <Countdown class="cd" :name="cdName"></Countdown>
  </div>
</template>

<style>

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  height: 100vh;
}

.countdown-wrapper {
  display: grid;
  place-items: center;
  height: 100vh;
}

.cd {
  display: inline-block;
  font-size: 100px;
}
</style>