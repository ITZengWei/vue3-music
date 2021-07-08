<template>
  <div class="singer" v-loading="singers.length === 0">
    <index-list :data="singers" @select="selectSinger" />
  </div>


  <router-view v-slot="{ Component }">
    <transition name="slide" appear>
      <component :is="Component" :singer="selectedSinger"></component>
    </transition>
  </router-view>
</template>

<script>
  import { getSingerList } from "../service/singer"
  import IndexList from '@/components/base/index-list/index-list.vue'
  import storage  from 'good-storage'
  import { SINGER_KEY } from "../assets/js/constant"


  export default {
    name: 'singer',
    components: {
      IndexList
    },
    data() {
      return {
        singers: [],
        selectedSinger: null
      }
    },
    async created() {
      const result = await getSingerList()
      console.log(result)
      this.singers = result.singers
    },
    methods: {
      selectSinger(singer) {
        this.selectedSinger = singer
        this.$router.push({
          path: `/singer/${singer.mid}`
        })

        /** 存储在session中 */
        storage.session.set(SINGER_KEY, singer)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .singer {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
  }
</style>
