<template>
  <div
    class="suggest"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-if="singer"
      >
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">
            {{song.singer}}-{{song.name}}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { ref, watch } from 'vue'
  import { search } from '@/service/search'
  import { processSongs } from '@/service/song'


  export default {
    name: 'suggest',
    props: {
      query: String,
      /** 是否显示歌手 */
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    setup(props) {
      /** 歌手 TODO 是什么歌手 */
      const singer = ref(null)
      /** 推荐歌曲 */
      const songs = ref([])
      /** 是否存在加载更多 */
      const hasMore = ref(true)
      /** 页码 */
      const page = ref(1)

      // 注意这里不能直接 监听 props.query 需要 监听一个 getter函数 参考文档: https://vue3js.cn/docs/zh/api/computed-watch-api.html#%E4%BE%A6%E5%90%AC%E4%B8%80%E4%B8%AA%E5%8D%95%E4%B8%80%E6%BA%90
      watch(() => props.query, async (newQuery) => {
        if (!newQuery) {
          return
        }
        // 这里为啥需要 await watch 返回值？
        await searchFirst()
      })

      /** 搜索之前需要做的重置操作 */
      async function searchFirst() {
        console.log(props.query)
        songs.value = []
        page.value = 1
        hasMore.value = true
        singer.value = null
        // const result = await search(props.query, page.value, singer.value)
        // console.log(result)
        // /** 由于返回的歌曲数据是没有歌曲 URL 的 */
        // // songs.value = await processSongs(result.songs)
        // // console.log(songs.value)
        // // hasMore.value = result.hasMore
        // // singer.value = result.singer
      }

      function selectSong(song) {

      }

      return {
        singer,
        songs,
        selectSong,
      }
    }
  }
</script>

<style lang="scss" scoped>
  .suggest {
    height: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 30px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          [class^="icon-"] {
            font-size: 14px;
            color: $color-text-d;
          }
        }
        .name {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
          overflow: hidden;
          .text {
            @include no-wrap();
          }
        }
      }
    }
  }
</style>
