<script setup lang="ts">
import nuxtStorage from 'nuxt-storage/nuxt-storage';

const PASSWORD_STRING = 'kjbsefzjgzeiugfkuughfszguxsfzag';

const props = defineProps<{
  list: string[],
  updateCallback: () => void,
  state: number // 0, running; 1, paused; 2, ended
}>();

function sendState(name: string, state: boolean) {
  $fetch('/api/countdown/edit', {
    method: 'POST',
    body: JSON.stringify({
      state: state,
      name: name,
    }),
    headers: {
      password: nuxtStorage.localStorage.getData(PASSWORD_STRING),
    },
  });
}

function delCountdown(name: string) {
  $fetch('/api/countdown/delete', {
    method: 'POST',
    headers: {
      password: nuxtStorage.localStorage.getData(PASSWORD_STRING),
    },
    body: {
      name,
    },
  });

  props.updateCallback();
}

</script>

<template>

  <ul>
    <li v-for="name in list" :key="name">
      <div class="countdown-box">
        <div class="cd-section">
          <h2>{{ name }}</h2>
          <Countdown :update-callback="props.updateCallback" class="countdown" :name="name" ref="child"></Countdown>
        </div>

        <div class="icons">

          <a :href="'/c/' + name">
            <svg class="external" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                  d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/>
            </svg>
          </a>


          <!--          Stopped -->
          <svg @click="sendState(name, true)" v-if="props.state == 1" xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 384 512">
            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path
                d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
          </svg>

          <!--          Running -->
          <svg @click="sendState(name, false)" v-if="props.state == 0" xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 320 512">
            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path
                d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/>
          </svg>

          <!--          Trash -->
          <svg @click="delCountdown(name)" class="trash" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path
                d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
          </svg>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
ul {
  list-style: none;


  gap: .8rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  &::after {
    content: "";
    flex: auto; /* Ensure rows are equally wide */
  }

  & li {
    padding: 1rem;
    border-radius: .8rem;
    display: inline-block;
    background: rgba(255, 255, 255, .1);


    transition: background .2s;

    .countdown-box {
      color: white;
      text-decoration: none;

      display: flex;

      align-items: center;
      gap: 1rem;

      width: fit-content;
      flex: 1 1 auto;
      box-sizing: border-box;

      h2 {
        color: rgba(255, 255, 255, .7);
      }

      .countdown {
        font-size: 1.1rem;
      }

    }


    &:hover {
      background: rgba(255, 255, 255, .15);

    }

    .icons {
      display: flex;
      position: relative;
      gap: .2rem;

      & > * {
        height: 2rem;
        padding: .2rem;
        aspect-ratio: 1;
        fill: rgba(255, 255, 255, .7);

        cursor: pointer;

        &:hover {
          fill: rgba(0, 255, 128, .9);
        }

        &.trash:hover {
          fill: rgb(255, 75, 75);
        }
      }

    }
  }
}

@media only screen and (max-width: 500px) {
  ul {
    flex-wrap: nowrap;
    flex-direction: column;

    & li {
      width: 100%;
      position: relative;

      .countdown-box {
        justify-content: space-between;
        width: 100%;
      }
    }

  }
}
</style>