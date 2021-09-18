import { h, mergeProps, withCtx, renderSlot, ref, computed, watch, nextTick } from 'vue'
import Scroll from '@/components/base/scroll/scroll'
import { useStore } from 'vuex'

export default {
  name: 'wrap-scroll',
  /** 使用 Scroll 中的 props */
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(
      Scroll,
      // 合并参数
      mergeProps(
        { ref: "scrollRef" },
        ctx.$props,
        {
          onScroll: (e) => {
            ctx.$emit('scroll', e)
          }
        }
      ),
      // 插槽部分
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, 'default')]
        })
      }
    )
  },
  setup() {
    const scrollRef = ref(null)
    const store = useStore()
    const playlist = computed(() => store.state.playlist)

    const scroll = computed(() => {
      return scrollRef.value.scroll
    })

    watch(playlist, async () => {
      await nextTick()
      scroll.value.refresh()
    })

    return {
      scrollRef,
      scroll
    }
  }
}
