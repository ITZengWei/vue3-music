import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

export default function useMiniSlider() {
  const sliderWrapperRef = ref(null)
  const slider = ref(null)
  const store = useStore()

  const fullScreen = computed(() => store.state.fullScreen)
  const playlist = computed(() => store.state.playlist)
  const currentIndex = computed(() => store.state.currentIndex)

  /** 只有在迷你播放器展示，并且播放列表存在的时候才去初始化 */
  const sliderShow = computed(() => {
    return !fullScreen.value && playlist.value.length > 0
  })

  onMounted(() => {
    let sliderVal
    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick()
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })
          sliderVal.on('slideWillChange', (page) => {
            const currentPageIndex = page.pageX
            store.commit('setCurrentIndex', currentPageIndex)
            // store.commit('setPlayingState', true)
          })
        } else {
          sliderVal.refresh()
        }

        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    watch(currentIndex, (newIndex) => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })

    /** 播放列表改变的时候重置 slide 列表 */
    watch(playlist, () => {
      if (sliderVal && sliderShow.value) {
        sliderVal.refresh()
      }
    })
  })

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })

  return {
    slider,
    sliderWrapperRef
  }
}
