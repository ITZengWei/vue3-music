<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input
      class="input-inner"
      v-model="query"
      :placeholder="placeholder"
    />
    <i
      v-show="query"
      class="icon-dismiss"
      @click="clear"
    ></i>
  </div>
</template>

<script>
  import { debounce } from 'throttle-debounce'

  export default {
    name: 'search-input',
    props: {
      // 在 Vue3 中 v-model 不是 value，是modelValue， 详情查看 https://vue3js.cn/docs/zh/guide/migration/v-model.html#_3-x-%E8%AF%AD%E6%B3%95
      modelValue: String,
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        query: this.modelValue
      }
    },
    created() {
      // 通过 this.$watch 使用
      this.$watch('query', debounce(300, (newQuery) => {
        this.$emit('update:modelValue', newQuery.trim())
      }))

      this.$watch('modelValue', (newValue) => {
        this.query = newValue
      })
    },
    methods: {
      clear() {
        this.query = ''
      }
    },
  }
</script>

<style lang="scss" scoped>
  .search-input {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 32px;
    background: $color-highlight-background;
    border-radius: 6px;
    .icon-search {
      font-size: 24px;
      color: $color-text-d;
    }
    .input-inner {
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: $color-highlight-background;
      color: $color-text;
      font-size: $font-size-medium;
      outline: 0;
      &::placeholder {
        color: $color-text-d;
      }
    }
    .icon-dismiss {
      font-size: 16px;
      color: $color-text-d;
    }
  }
</style>
