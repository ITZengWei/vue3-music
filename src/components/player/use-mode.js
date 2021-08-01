import { useStore } from 'vuex'
import { computed } from 'vue'
import { PLAY_MODE } from "@/assets/js/constant"

export default function useMode() {
  const store = useStore()
  /** 播放模式 */
  const playMode = computed(() => store.state.playMode)

  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
      ? 'icon-sequence'
      : playModeVal === PLAY_MODE.random
        ? 'icon-random'
        : 'icon-loop'
  })

  const modeText = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
      ? '顺序播放'
      : playModeVal === PLAY_MODE.random
        ? '随机播放'
        : '单曲播放'
  })

  function changeMode() {
    const newMode = (playMode.value + 1) % 3
    store.dispatch('changeMode', newMode)
  }

  return { modeIcon, modeText, changeMode }
}
