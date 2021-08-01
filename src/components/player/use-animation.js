import { ref } from 'vue'
import animations from 'create-keyframe-animation'

export default function useAnimation() {
  const cdWrapperRef = ref(null)
  let entering = false
  let leaving = false

  function enter(el, done) {
    if (leaving) {
      afterLeave()
    }
    const { x, y, scale } = getPosAndScale()
    entering = true

    /** 通过 JS的方式生成动画 */
    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      100: {
        transform: `translate3d(0, 0, 0) scale(1)`
      }
    }

    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    })

    animations.runAnimation(cdWrapperRef.value, 'move', done)
  }

  function afterEnter() {
    entering = false
    animations.unregisterAnimation('move')
    cdWrapperRef.value.animation = ''
  }

  function leave(el, done) {
    if (entering) {
      afterEnter()
    }

    leaving = true
    /** 通过 transition 来做离开动画 */
    const { x, y, scale } = getPosAndScale()
    const cdWrapperEl = cdWrapperRef.value

    cdWrapperEl.style.transition = 'all .3s cubic-bezier(0.45, 0, 0.55, 1)'
    cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`

    cdWrapperEl.addEventListener('transitionend', next)

    function next() {
      cdWrapperEl.removeEventListener('transitionend', next)
      done()
    }
  }

  function afterLeave() {
    leaving = false
    const cdWrapperEl = cdWrapperRef.value
    cdWrapperEl.style.transition = ''
    cdWrapperEl.style.transform = ``
  }

  function getPosAndScale() {
    /** 目标小圆的宽度 */
    const targetWidth = 40

    /** 目标小圆原心距离左边的距离 半径 + 左边的 padding */
    const paddingLeft = 40 // 20 + 40 / 2

    /** 目标小圆原心距离底部的距离 半径 + 下边的 padding */
    const paddingBottom = 30 // 10 + 40 / 2

    /** 大圆距离顶部距离 */
    const paddingTop = 80

    /** 大圆宽度 */
    const width = window.innerWidth * 0.8

    /** 大圆原心距离小圆圆心的X距离  */
    const x = -(window.innerWidth / 2 - paddingLeft )

    /** 大圆原心距离小圆圆心的Y距离 页面高度 - 大圆距离顶部的距离 - 小圆距离底部的距离 - 大圆的半径  */
    const y = window.innerHeight - paddingTop - paddingBottom - width / 2

    /** 缩放比率 小圆的直径 / 大圆的直径 */
    const scale = targetWidth / width

    return {  x, y, scale }
  }

  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}
