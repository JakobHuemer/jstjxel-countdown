<script setup lang="ts">
const props = defineProps<{
  name: string
}>()

const name = ref(props.name);

// check if the countdown exists

let res = await fetch(`/api/countdown/${name}`)

if (res.status != 200) {
  throw new Error("Countdown doesn't exist!")
}

let cdResponse = res as Response & {
  status: number,
  timestamp: number,
  msg: string,
  countdown: {
    running: boolean,
    remaining: number,
    duration: number,
  },
}

const running = ref(cdResponse.countdown.running);
const remaining = ref(cdResponse.countdown.remaining);
const duration = ref(cdResponse.countdown.remaining);

</script>

<template>

</template>

<style scoped>

</style>