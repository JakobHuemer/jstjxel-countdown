<script setup lang="ts">
import nuxtStorage from 'nuxt-storage/nuxt-storage';

const PASSWORD_STRING = 'kjbsefzjgzeiugfkuughfszguxsfzag';

let name = ref<string>();

let seconds = ref<number>(0);
let minutes = ref<number>(0);
let hours = ref<number>(0);
let days = ref<number>(0);


function create() {


  let totalTime: number = seconds.value + 60 * (minutes.value + 60 * (hours.value + 24 * days.value));

  console.log('totalTime', totalTime);

  const body = JSON.stringify({
        name: name.value,
        duration: totalTime,
      })
  console.log(body);

  $fetch('/api/countdown/create', {
    method: 'POST',
    body,
    headers: {
      password: nuxtStorage.localStorage.getData(PASSWORD_STRING),
    },
  }).then(r => {
    console.log(r);
    navigateTo('/');
  });
}

function checkPassword() {

  console.log("nuxtStorage.localStorage.getData(PASSWORD_STRING)")
  console.log(!nuxtStorage.localStorage.getData(PASSWORD_STRING))
  const check = !nuxtStorage.localStorage.getData(PASSWORD_STRING)
  console.log(check)
  if ( check ) {
    navigateTo('/password');
  }

  return true;
}

checkPassword();

</script>

<template>
  <h1>Create Countdown</h1>

  <p style="text-align: center; padding-block: 1rem; color: rgb(255, 75, 75); font-weight: bold">Name (A-z, 0-9, _,-, Keiner Leerzeichen)
    <br>Maximale größe sind 24D, 20H, 32M, 32S wegen 32-bit signed int limit!
    <br>Alles darüber wird automatisch gecanceled</p>

  <div class="fields">
    <div class="name">
      <span>Name: </span>
      <input v-model="name" type="text" name="name" id="name">
    </div>
    <div class="time">
      <span>Days: </span>
      <input v-model="days" type="number" name="days" id="days">

      <span>Hours: </span>
      <input v-model="hours" type="number" name="hours" id="hours">

      <span>Minutes: </span>
      <input v-model="minutes" type="number" name="minutes" id="minutes">

      <span>Seconds: </span>
      <input v-model="seconds" type="number" name="seconds" id="seconds">
    </div>

    <button @click="create()" type="submit">Create</button>
  </div>
</template>

<style>
@import "../assets/global.css";

h1 {
  text-align: center;
  padding: 1.5rem;
}


input, button {
  padding: .4rem;
  background: rgba(255, 255, 255, .2);
  border: none;
  outline: none;
  border-radius: .6rem;
  font-size: 1.2rem;
}

.fields {
  width: min(90%, 1000px);
  margin-inline: auto;
  display: flex;

  flex-direction: column;
  gap: 3rem;

  .time {
    display: grid;
    gap: 1rem;
    grid-template-columns: 100px 1fr;
  }
}
</style>