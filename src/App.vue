<template>
  <div>
    <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />
    <ul>
      <li>
        <template v-for="temp in beverageStore.temps" :key="temp">
          <label>
            <input
              type="radio"
              name="temperature"
              :id="`r${temp}`"
              :value="temp"
              v-model="beverageStore.currentTemp"
            />
            {{ temp }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="b in beverageStore.bases" :key="b.id">
          <label>
            <input
              type="radio"
              name="bases"
              :id="`r${b.id}`"
              :value="b"
              v-model="beverageStore.currentBase"
            />
            {{ b.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="s in beverageStore.syrups" :key="s.id">
          <label>
            <input
              type="radio"
              name="syrups"
              :id="`r${s.id}`"
              :value="s"
              v-model="beverageStore.currentSyrup"
            />
            {{ s.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="c in beverageStore.creamers" :key="c.id">
          <label>
            <input
              type="radio"
              name="creamers"
              :id="`r${c.id}`"
              :value="c"
              v-model="beverageStore.currentCreamer"
            />
            {{ c.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <button @click="withGoogle()">Sign in with Google</button>
      <button v-if="beverageStore.user != null" @click="beverageStore.setUser(null)">Sign out</button>
    </ul>
    <ul>
      <input type="text" placeholder="Beverage Name" v-model="beverageStore.currentName" />
      <button :disabled="!beverageStore.user" @click="beverageStore.makeBeverage">🍺 Make Beverage</button>
    </ul>
    <ul>{{ beverageStore.message }}</ul>
    <ul>
      <li>
        <template v-for="b in beverageStore.beverages" :key="b.name">
          <label>
            <input
              type="radio"
              name="beverages"
              :id="`r${b.name}`"
              :value="b"
              v-model="beverageStore.currentBeverage"
              @change="beverageStore.showBeverage()"
            />
            {{ b.name }}
          </label>
        </template>
      </li>
    </ul>
  </div>
  <div id="beverage-container" style="margin-top: 20px"></div>
</template>

<script setup lang="ts">
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
const beverageStore = useBeverageStore();
beverageStore.init();

function withGoogle() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider).then((result) => {
    beverageStore.setUser(result.user);
  }).catch((error) => {
    console.error("Error signing in with Google:", error);
  });
}

</script>

<style lang="scss">
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
}
ul {
  list-style: none;
}
</style>
