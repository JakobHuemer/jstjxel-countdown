<script setup lang="ts">

const props = defineProps<{
  name: string,
  updateCallback?: () => void,
}>();


let countInterval: NodeJS.Timeout | null = null;

const name = ref(props.name);

// check if the countdown exists
let res = await useFetch<CountdownResponse>(`/api/countdown/${ name.value }`);
await res.execute();

interface CountdownResponse {
  status: number;
  timestamp: number;
  msg: string;
  countdown: {
    running: boolean;
    remaining: number;
    duration: number;
  };
}

console.log(res);
console.log(res.data);


// sleep for 5 seconds
// await new Promise((resolve) => setTimeout(resolve, 500));
// q: why doesn't it work without the sleep


if ( !res.data.value ) {
  throw new Error('Countdown not found');
}

let remaining = ref<number>(res.data.value.countdown.remaining);
let duration = res.data.value.countdown.duration;
let timestamp = res.data.value.timestamp;
let running = res.data.value.countdown.running;

// computed variable formattedString should change if remaining changes
let formattedString = computed(() => {
  return formatDuration(Math.ceil(remaining.value) * 1000);
});

if ( running ) resumeLocal(remaining.value, timestamp);

// register event listener for changes

let eventSource = new EventSource(`/api/countdown/listen/${ name.value }`);

eventSource.onmessage = (ev) => {
  let data = JSON.parse(ev.data);

  if ( data.newState != undefined ) {
    if ( data.newState ) {
      resumeLocal(data.time, data.timestamp);
    } else {
      stopLocal(data.time);
    }
  } else {
    if ( data.ending == 'ending' && data.name == name.value ) {
      if ( countInterval ) clearInterval(countInterval);
      if ( props.updateCallback ) props.updateCallback();
      remaining.value = 0;
      running = false;
    }
  }
};

function resumeLocal(timeRemaining: number, whenWasThatTime: number) {
  if ( !running && props.updateCallback ) {
    props.updateCallback();
  }
  running = true;

  remaining.value = timeRemaining;

  remaining.value -= (Date.now() - whenWasThatTime) / 1000;

  countInterval = setInterval(() => {
    remaining.value--;
  }, 1000);
}

function stopLocal(timeRemaining: number) {
  if ( running && props.updateCallback ) {
    props.updateCallback();
  }
  running = false;

  if ( countInterval ) clearInterval(countInterval);

  remaining.value = timeRemaining;
}



function formatDuration(duration: number) {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  let days = Math.floor(duration / (1000 * 60 * 60 * 24));

  // Format the components
  return (days < 10 ? '0' : '') + days + ':' +
      (hours < 10 ? '0' : '') + hours + ':' +
      (minutes < 10 ? '0' : '') + minutes + ':' +
      (seconds < 10 ? '0' : '') + seconds;
}
</script>

<template>
  <div>
    <span>{{ formattedString }}</span>
  </div>
</template>

<style scoped>
span {
  font-family: monospace;
}
</style>