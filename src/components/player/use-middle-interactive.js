import { ref } from 'vue'

/** 中间层互动钩子  */
export default function useMiddleInteractive() {
  const currentShow = ref()
  /** 中间左边样式(CD) */
  const middleLStyle = ref()
  /** 中间右边样式(歌词 Lyric) */
  const middleRStyle = ref()

  const touch = {}
  /** 当前页面展示的是哪个，可能在拖动的过程中，展示的是 currentShow 为 歌词, 可是在页面中还是以 CD 为主屏幕 */
  let currentView = 'cd'

  function onMiddleTouchStart(e) {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY

    /** 重置方向锁 */
    touch.directionLocked = ''
  }

  function onMiddleTouchMove(e) {
    /** 滑动的偏移量 */
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    /** 设置方向锁 */
    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaY > absDeltaX ? 'v' : 'h'
    }

    /** 如果当前滑动是垂直的话直接退出 */
    if (touch.directionLocked === 'v') {
      return
    }


    /** 滑动起始位置 */
    const left = currentView === 'cd' ? 0 : -window.innerWidth

    /** 最终偏移量 */
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))

    console.log(offsetWidth)

    /** 滑动百分比 */
    touch.percent = Math.abs(offsetWidth / window.innerWidth)

    if (currentView === 'cd') {
      /** 滑动超过页面的 百分之 20 切换到 歌词，反之不切换 */
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }

    } else {
      /** 如果当前是播放歌词，那么当 middle 偏移小于 百分之 80时候，切换回来 CD */
      if  (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }

    middleLStyle.value = {
      opacity: 1 - touch.percent,
      transitionDuration: '0ms'
    }

    middleRStyle.value = {
      transform: `translate3d(${ offsetWidth }px, 0, 0)`,
      transitionDuration: '0ms'
    }

    console.log(middleRStyle.value)
  }

  function onMiddleTouchEnd() {
    let opacity
    let offsetWidth
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      opacity = 1
      offsetWidth = 0
    } else {
      currentView = 'lyric'
      opacity = 0
      offsetWidth = - window.innerWidth
    }

    const duration = 300

    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }

    middleRStyle.value = {
      transform: `translate3d(${ offsetWidth }px, 0, 0)`,
      transitionDuration: `${duration}ms`
    }
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
