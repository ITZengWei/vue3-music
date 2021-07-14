<template>
  <div
    class="player"
  >
    <div
      class="normal-player"
      v-show="fullScreen"
    >
      <template v-if="currentSong">
        <div class="background">
          <img :src="currentSong.pic">
        </div>
        <div class="top">
          <div
            class="back"
            @click="goBack"
          >
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <div class="bottom">
          <div class="operators">
            <div class="icon i-left">
              <!--<i class="icon-sequence"></i>-->
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i  class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </template>
    </div>
    <audio ref="audioRef" @pause="pause" @canplay="ready" @error="error"></audio>
  </div>
</template>

<script>
  import { computed, watch, ref } from 'vue'
  import { useStore } from 'vuex'
  import useMode from "./use-mode"
  import useFavorite from "./use-favorite"

  export default {
    name: 'player',
    setup() {
      const audioRef = ref(null)
      const songReady = ref(false)

      const store = useStore()
      const { modeIcon, changeMode } = useMode()
      const { getFavoriteIcon, toggleFavorite } = useFavorite()

      const fullScreen = computed(() => store.state.fullScreen)
      const currentSong = computed(() => store.getters.currentSong)
      const playing = computed(() => store.state.playing)
      const currentIndex = computed(() => store.state.currentIndex)
      const playlist = computed(() => store.state.playlist)

      const playIcon = computed(() => {
        return playing.value ? 'icon-pause' : 'icon-play'
      })

      const disableCls = computed(() => {
        return songReady.value ? '' : 'disable'
      })

      /** 当前歌曲变更时候，设置 audio 的音乐资源 */
      watch(currentSong, (newSong) => {
        if (!newSong.id && !newSong.url) {
          return
        }
        /** 歌曲发生变化，我们需要修改歌曲缓冲 */
        songReady.value = false
        const audioEle = audioRef.value

        audioEle.src = newSong.url

        audioEle.play()
      })

      /** 根据store playing，设置 audio 的播放状态 */
      watch(playing, (newPlaying) => {
        if (!songReady.value) {
          return
        }
        const audioEle = audioRef.value
        newPlaying ? audioEle.play() : audioEle.pause()
      })

      function goBack() {
        store.commit('setFullScreen', false)
      }

      function togglePlay() {
        if (!songReady.value) {
          return
        }

        store.commit('setPlayingState', !playing.value)
      }

      /** 处理在笔记本盖上，audio 会暂停播放，可是数据并未更改 */
      function pause() {
        store.commit('setPlayingState', false)
      }

      function prev() {
        const list = playlist.value
        if (!songReady.value || !list.length) {
          return
        }

        /** 如果列表长度为1，那么设置循环播放 */
        if (list.length === 1) {
          return loop()
        }
        let index = currentIndex.value - 1
        if (index === -1) {
          index = list.length - 1
        }

        store.commit('setCurrentIndex', index)

        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }

      function next() {
        const list = playlist.value
        console.log(songReady.value)
        if (!songReady.value || !list.length) {
          return
        }

        /** 如果列表长度为1，那么设置循环播放 */
        if (list.length === 1) {
          return loop()
        }

        let index = currentIndex.value + 1
        if (index === list.length) {
          index = 0
        }

        store.commit('setCurrentIndex', index)

        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }

      function loop() {
        const audioEle = audioRef.value
        /** 设置当前时间为 0 */
        audioEle.currentTime = 0
        audioEle.play()
      }

      function ready() {
        /** 会出现多次缓存，但是我们只需要在第一次播放的时候设置为 true 就行 */
        if (songReady.value) {
          return
        }
        songReady.value = true
      }

      /** 当歌曲出错的时候，我们还需要可以切歌，这里也要把标识 */
      function error() {
        songReady.value = true
      }

      return {
        audioRef,
        fullScreen,
        currentSong,
        disableCls,
        playIcon,
        goBack,
        togglePlay,
        pause,
        prev,
        next,
        ready,
        error,

        /** useMode */
        modeIcon,
        changeMode,
        /** useFavorite */
        getFavoriteIcon,
        toggleFavorite,
      }
    }
  }
</script>

<style lang="scss" scoped>
  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: $color-background;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);

        img {
          width: 100%;
          height: 100%;
        }
      }
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
        }
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap();
          font-size: $font-size-large;
          color: $color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            box-sizing: border-box;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              img {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
                border: 10px solid rgba(255, 255, 255, 0.1);
              }
              .playing {
                animation: rotate 20s linear infinite
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-text;
              }
            }
            .pure-music {
              padding-top: 50%;
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: $color-text-ll;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 40px;
            line-height: 30px;
            width: 40px;
            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
            i {
              font-size: 30px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 40px;
            }
          }
          .i-right {
            text-align: left
          }
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active {
        transition: all .6s;
        .top, .bottom {
          transition: all .6s cubic-bezier(0.45, 0, 0.55, 1);
        }
      }
      &.normal-enter-from, &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -100px, 0);
        }
        .bottom {
          transform: translate3d(0, 100px, 0)
        }
      }
    }
  }
</style>
