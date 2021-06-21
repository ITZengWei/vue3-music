import { ref, watch, nextTick, computed } from 'vue'

export default function useFixed(props) {
  /** 固定标题容器高度 */
  const TITLE_HEIGHT = 30

  /** 外面盒子容器 */
  const groupRef = ref(null)

  /** 子元素的高度集合 */
  const listHeights = ref([])

  /** 当前Y的偏移 */
  const scrollY = ref(0)

  /** 当前区间索引 */
  const currentIndex = ref(0)

  /** 当前区间距离容器顶部的距离 */
  const distance = ref(0)

  /** 当前固定的标题 */
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  /** 固定的偏移量样式 */
  const fixedStyle = computed(() => {
    const distanceVal = distance.value

    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0

    return {
      transform: `translate3d(0, ${diff}px, 0)`
    }
  })

  /** 每次数据修改(列表数目改变)去计算一下高度。 注意这里要 nextTick 拿到DOM才能去操作 */
  watch(() => props.data, async () => {
    await nextTick()
    calculate()
  })

  /** 监听滚动的变化 */
  watch(scrollY, (newY) => {
    const listHeightsVal = listHeights.value
    /** 遍里次数，因为我们一开始 listHeightsVal push 了一个 0，只需要记录最后一个顶部偏移*/
    const eachLen = listHeightsVal.length - 1
    for (let i = 0; i < eachLen; i++) {
      const heightTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]
      /** 落在区间内 */
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i

        /** 下一个区间的顶部距离(当前区间的底部距离) - 当前的Y的偏移量 = 下一个区间距离顶部的距离 */
        distance.value = heightBottom - newY
      }
    }

  })

  function calculate() {
    /** 盒子容器的子元素 */
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    let height = 0

    /** 初始化子元素的高度(注意这里不能直接赋值 xx = [height]) */
    listHeightsVal.length = 0
    listHeightsVal.push(height)

    /** 累加记录总高度 */
    for (let i = 0; i < list.length; i++) {
      /** 记录各个区间顶部的Y位置 */
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }

  function onScroll(pos) {
    scrollY.value = - pos.y
  }

  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle
  }
}
