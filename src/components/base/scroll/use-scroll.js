import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, ref, onUnmounted, onActivated, onDeactivated } from 'vue'

BScroll.use(ObserveDOM)

export default function useScroll(wrapperRef, options, emit) {
  const scroll = ref(null)

  onMounted(() => {
    const scrollVal = scroll.value = new BScroll(
      wrapperRef.value,
     {observeDOM: true, ...options}
    )

    if (options.probeType > 0) {
      scrollVal.on('scroll', (pos) => {
        emit('scroll', pos)
      })
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  /** keep-alive 组件展示的时候 */
  onActivated(() => {
    const instance = scroll.value
    instance.enable()
    instance.refresh()
  })

  /** keep-alive 组件隐藏的时候 */
  onDeactivated(() => {
    scroll.value.disable()
  })

  return scroll
}
