<script lang="ts" setup>
import { useCookies } from '@vueuse/integrations/useCookies';
import nuxtStorage from 'nuxt-storage/nuxt-storage';

const PASSWORD_STRING = 'kjbsefzjgzeiugfkuughfszguxsfzag';

interface Countdown {
  duration: number;
  timeToGo: number;
  lastStarted: number;
  running: boolean;
  name: string;
}

let globList: Countdown[] = [];
let stopped = ref<string[]>([]);
let running = ref<string[]>([]);
let ended = ref<string[]>([]);


let topics = reactive({
  running: {
    topic: 'Running',
    list: [] as string[],
    state: 0,
  },
  stopped: {
    topic: 'Stopped',
    list: [] as string[],
    state: 1,
  },
  ended: {
    topic: 'Ended',
    list: [] as string[],
    state: 2,
  },
});


async function refilter() {

  let res = await useFetch<{
    status: number,
    msg: string,
    list: Countdown[]
  }>('/api/countdown');

  if ( res.status.value == 'success' && res.data.value ) {
    globList = res.data.value.list;
  }

  console.log('REFILTERING');
  topics.running.list = globList.filter(c => c.running).map(c => c.name);
  topics.stopped.list = globList.filter(c => !c.running && c.timeToGo > 0).map(c => c.name);
  topics.ended.list = globList.filter(c => c.timeToGo <= 0).map(c => c.name);

}

refilter();

function checkPassword() {

  if ( !nuxtStorage.localStorage.getData(PASSWORD_STRING) ) {
    navigateTo('/password');
  }

  return true;
}

checkPassword();

</script>

<template>

  <h1>Countdowns</h1>

  <main class="wrapper">

    <ul class="all-list">
      <!--      <li>-->
      <!--        <h2>Running</h2>-->
      <!--        <CountdownList :update-callback="refilter" :list="running"></CountdownList>-->
      <!--      </li>-->

      <!--      <li>-->
      <!--        <h2>Stopped</h2>-->
      <!--        <CountdownList :update-callback="refilter" :list="stopped"></CountdownList>-->
      <!--      </li>-->

      <!--      <li>-->
      <!--        <h2>Ended</h2>-->
      <!--        <CountdownList :update-callback="refilter" :list="ended"></CountdownList>-->
      <!--      </li>-->
      <!--      -->
      <li v-for="t in topics" :key="t.topic">
        <h2>{{ t.topic }}</h2>
        <CountdownList :state="t.state" :update-callback="refilter" :list="t.list"></CountdownList>
      </li>

    </ul>


  </main>
</template>

<style>

@import url('../assets/global.css');

.all-list {
  list-style: none;

  & > * {
    margin-block: 1.5rem;

    & > h2 {
      margin-bottom: 1rem;
    }
  }
}

h1 {
  text-align: center;
  padding: 1.5rem;
}

.wrapper {
  width: min(90%, 1000px);
  margin-inline: auto;
}

</style>