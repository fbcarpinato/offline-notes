<template>
  <div class="flex w-screen h-screen text-gray-700">
    <div
      class="flex flex-col flex-shrink-0 w-64 border-r border-gray-300 bg-gray-100"
    ></div>
    <div class="flex flex-col flex-grow"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class App extends Vue {}
</script>
