import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

export default function useCd() {
  const cdRef = ref()
  const cdImageRef = ref()

  const store = useStore()
  const playing = computed(() => store.state.playing)

  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })

  watch(playing, (newPlaying) => {
    /** 如果当前播放状态为暂停状态，同步旋转角度 */
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  /** 同步旋转角度 */
  function syncTransform(wrapper, inner) {
    const wrapTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    /** 注意这里需要叠加两者角度 */
    // window.wrapTransform = wrapTransform
    wrapper.style.transform = wrapTransform === 'none' ? innerTransform : innerTransform.concat(wrapTransform)
  }

  return {
    cdRef,
    cdImageRef,
    cdCls
  }
}
