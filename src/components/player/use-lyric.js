import { useStore } from 'vuex'
import { watch, computed, ref  } from 'vue'
import { getLyric } from "@/service/song"
/** 导入第三方解析歌词的库 */
import LyricParser from 'lyric-parser'

export default function useLyric({ songReady, currentTime }) {
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  /** 纯音乐提示 */
  const pureMusicLyric = ref('')
  const playingLyric = ref('')
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async (newSong) => {
    /** 歌曲不合法 */
    if (!newSong.url || !newSong.id) {
      return
    }

    /** 快速切歌，歌词跳转问题 TODO 这里需要研究一下 */
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0

    /** 重置 */
    pureMusicLyric.value = ''
    playingLyric.value = ''

    const lyric = await getLyric(newSong)

    store.commit('addSongLyric', {
      song: newSong,
      lyric
    })

    /** 只为当前播放歌曲解析，只为最后一个过程为准 */
    if (newSong.lyric !== lyric) {
      return
    }

    currentLyric.value = new LyricParser(lyric, handleLyric)
    const hasLyric = currentLyric.value.lines.length
    if (hasLyric) {
      /** TODO 这里为什么不监听两个值呢 currentSong, songReady */
      /** 歌词获取之后，发现歌曲可以播放，启动 */
      if (songReady.value) {
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })

  /** 处理歌词  */
  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    /** TODO Comp 标识一个组件  */
    const scrollComp = lyricScrollRef.value

    /** TODO El 标识一个元素  */
    const listEl = lyricListRef.value

    if (!listEl) return

    /** 屏幕滚动，在第 5 行后的时候，滚动屏幕，保证歌词在中间 */
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  function playLyric() {
    const currentLyricVal = currentLyric.value

    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  function stopLyric() {
    const currentLyricVal = currentLyric.value

    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  return {
    currentLyric,
    pureMusicLyric,
    playLyric,
    stopLyric,
    currentLineNum,
    lyricScrollRef,
    lyricListRef,
    playingLyric
  }

}
