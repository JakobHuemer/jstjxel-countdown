<script setup lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies';
import { sha256 } from 'ohash';
import nuxtStorage from 'nuxt-storage/nuxt-storage';

const PASSWORD_STRING = 'kjbsefzjgzeiugfkuughfszguxsfzag';
let password = ref<string>('');

function updatePassword() {

  nuxtStorage.localStorage.setData(PASSWORD_STRING, sha256(password.value));

  navigateTo('/');
}
</script>

<template>
  <h1>Input Password:</h1>
  <main>
    <input placeholder="password" v-model="password" type="text" name="password" id="password">
    <button @click="updatePassword" type="submit">Submit</button>
  </main>
</template>

<style>

@import url('../assets/global.css');


h1 {
  text-align: center;
  padding: 1.5rem;
}

main {
  display: grid;
  place-items: center;
  gap: 1rem;
}

input, button {
  padding: .4rem;
  background: rgba(255, 255, 255, .2);
  border: none;
  outline: none;
  border-radius: .6rem;
  font-size: 1.2rem;
}
</style>