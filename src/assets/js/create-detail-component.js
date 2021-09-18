import MusicList from '@/components/music-list/music-list'
import storage  from 'good-storage'
import { processSongs } from "@/service/song"

export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: {
      MusicList
    },
    props: {
      data: {
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
      computedData() {
        let result = null
        const propSinger = this.data
        if (propSinger) {
          result = propSinger
        } else {
          const cached = storage.session.get(key)

          // 兼容性对比
          if (cached && (cached.mid || cached.id + '') === this.$route.params.id) {
            result = cached
          }
        }

        return result
      },
      pic() {
        const data = this.computedData
        return data && data.pic;
      },
      title() {
        const data = this.computedData
        return data && (data.name || data.title)
      },
    },
    async created() {
      const data = this.computedData
      /** 如果还没有拿到歌手详情，退回到一级路由 */
      if (!data) {
        const path = this.$route.matched[0].path
        this.$router.replace(path)
        return
      }
      this.loading = true
      const result = await fetch(data)
      this.songs = await processSongs(result.songs)
      this.loading = false
    }
  }

}
