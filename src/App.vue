<template>
  <m-header></m-header>
  <m-tab></m-tab>
  <router-view :style="viewStyle" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"></component>
    </keep-alive>
  </router-view>
  <!--<router-view-->
    <!--:style="viewStyle"-->
    <!--name="user"-->
    <!--v-slot="{ Component }"-->
  <!--&gt;-->
    <!--<transition appear name="slide">-->
      <!--<component :is="Component"></component>-->
    <!--</transition>-->
  <!--</router-view>-->
  <Player />
</template>

<script>
  import { mapState } from 'vuex'
  import Header from './components/header/header'
  import Tab from './components/tab/tab'
  import Player from './components/player/player'

  export default {
    components: {
      MHeader: Header,
      MTab: Tab,
      Player,
    },
    computed: {
      ...mapState(['playlist']),
      viewStyle() {
        const bottom = this.playlist.length ? '60px' : '0'
        console.log('bottom', bottom)
        return {
          bottom
        }
      }
    }
  }
</script>
