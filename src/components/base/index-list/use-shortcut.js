import { computed, ref } from 'vue'

export default function useShortcut(props, groupRef) {
  /** 锚点高度 */
  const ANCHOR_HEIGHT = 18

  const scrollRef = ref(null)


  const shortcutList = computed(() => {
    return props.data.map(group => group.title)
  })

  const touch = {}

  function onShortcutTouchStart(e) {
    const anchorIndex = + e.target.dataset.index
    const { pageY } = e.touches[0]
    touch.anchorIndex = anchorIndex
    touch.y1 = pageY

    scrollTo(anchorIndex)
  }

  function onShortcutTouchMove(e) {
    const { pageY } = e.touches[0]
    touch.y2 = pageY
    /** 偏移索引 */
    const offsetIndex = Math.floor((touch.y2 - touch.y1) / ANCHOR_HEIGHT)
    const anchorIndex = touch.anchorIndex + offsetIndex

    scrollTo(anchorIndex)
  }

  function scrollTo(index) {
    if (isNaN(index)) {
      return
    }
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    /** 目标滚动元素 */
    const target = groupRef.value.children[index]
    scrollRef.value.scroll.scrollToElement(target, 200)
  }

  return {
    scrollRef,
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove,
  }
}
