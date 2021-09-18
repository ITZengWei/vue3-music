<template>
  <div class="singer-detail">
    <music-list :songs="songs" :pic="pic" :title="title" :loading="loading"></music-list>
  </div>
</template>

<script>
  import { getSingerDetail } from "../service/singer"
  import { processSongs } from "../service/song"
  import MusicList from '../components/music-list/music-list'
  import storage  from 'good-storage'
  import { SINGER_KEY } from "../assets/js/constant"

  export default {
    name: 'singer-detail',
    components: {
      MusicList
    },
    props: {
      singer: {
        type: Object,
      },
    },
    data() {
      return {
        songs: [],
        loading: false
      }
    },
    computed: {
      computedSinger() {
        let result = null
        const propSinger = this.singer
        if (propSinger) {
          result = propSinger
        } else {
          const cachedSinger = storage.session.get(SINGER_KEY)

          if (cachedSinger && cachedSinger.mid === this.$route.params.id) {
            result = cachedSinger
          }
        }

        return result
      },
      pic() {
        const singer = this.computedSinger
        return singer && singer.pic;
      },
      title() {
        const singer = this.computedSinger
        return singer && singer.name;
      },
    },
    async created() {
      const singer = this.computedSinger
      /** 如果还没有拿到歌手详情，退回到一级路由 */
      if (!singer) {
        const path = this.$route.matched[0].path
        this.$router.replace(path)
        return
      }
      this.loading = true
      const result = await getSingerDetail(singer)
      this.songs = await processSongs(result.songs)
      this.loading = false
    }
  }
</script>

<style lang="scss" scoped>
  .singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
