<template>
  <div
    class="progress-bar"
    @click="onClick"
  >
    <div class="bar-inner">
      <div
        class="progress"
        ref="progress"
        :style="progressStyle"
      ></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>

  const progressBtnWidth = 16

	export default {
		name: "progress-bar",
    props: {
      progress: {
        type: Number,
        default: 0
      },
    },
    emits: ['progress-changing', 'progress-changed'],
    data() {
      return {
        offset: 0
      }
    },
    computed: {
      progressStyle() {
        return `width: ${ this.offset }px`
      },
      btnStyle() {
        return `transform: translate3d(${ this.offset }px, 0, 0)`
      }
    },
    watch: {
		  /** 也可以用 computed 实现，但是需要注意 computed在使用的时候this.$el.clientWidth可能拿不到值 */
      progress(newProgress) {
        this.setOffset(newProgress)
      }
    },
    created() {
		  this.touch = {}
    },
    methods: {
      onTouchStart(e) {
        /** 记录下开始偏移 */
        this.touch.x1 = e.touches[0].pageX

        /** 还没有移动的时候的宽度 */
        this.touch.beginWidth = this.$refs.progress.clientWidth
      },
      onTouchMove(e) {
        /** 拿到开始和移动的偏移量 */
        const delta = e.touches[0].pageX - this.touch.x1
        /** 移动后 progress 的宽度 */
        const tempWidth = this.touch.beginWidth + delta
        const barWidth = this.$el.clientWidth - progressBtnWidth
        /** 设置更改后的 progress 注意 [0, 1] 之间 */
        const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
        this.offset = barWidth * progress
        this.$emit('progress-changing', progress)
      },
      onTouchEnd(e) {
        /** 拿到修改后的 progress 宽度 */
        const barWidth = this.$el.clientWidth - progressBtnWidth

        /** 更改后的进度 */
        const progress = this.$refs.progress.clientWidth / barWidth
        this.$emit('progress-changed', progress)
      },
      onClick(e) {
        const rect = this.$el.getBoundingClientRect()
        const offset = e.pageX - rect.left
        const barWidth = this.$el.clientWidth - progressBtnWidth
        /** 更改后的进度 */
        const progress = offset / barWidth
        this.$emit('progress-changed', progress)
      },
      setOffset(progress) {
        const barWidth = this.$el.clientWidth - progressBtnWidth
        this.offset = barWidth * progress
      }
    },
	}
</script>


<style lang="scss" scoped>
  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>

