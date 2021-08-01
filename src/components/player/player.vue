<template>
  <div
    class="player"
    v-show="playlist.length"
  >
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
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
        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <div
            class="middle-l"
            :style="middleLStyle"
          >
            <div
              class="cd-wrapper"
              ref="cdWrapperRef"
            >
              <div
                class="cd"
                ref="cdRef"
              >
                <img
                  ref="cdImageRef"
                  class="image"
                  :src="currentSong.pic"
                  :class="cdCls"
                />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll
            class="middle-r"
            :style="middleRStyle"
            ref="lyricScrollRef"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                  v-for="(line,index) in currentLyric.lines"
                  :key="line.num"
                  class="text"
                  :class="{'current': currentLineNum === index}"
                >
                  {{line.txt}}
                </p>
              </div>

              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{pureMusicLyric}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                ref="barRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              ></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
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
    </transition>

    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="onEnd"
    />
    <mini-player :progress="process" :toggle-play="togglePlay" />
  </div>
</template>

<script>
  import { computed, watch, ref, nextTick } from 'vue'
  import { useStore } from 'vuex'
  import scroll from '@/components/base/scroll/scroll'
  import useMode from "./use-mode"
  import useFavorite from "./use-favorite"
  import useMiddleInteractive from "./use-middle-interactive"
  import useAnimation from "./use-animation"
  import ProgressBar from './progress-bar'
  import MiniPlayer from './mini-player'
  import useCd from "./use-cd"
  import useLyric from "./use-lyric"
  import { formatTime } from "@/assets/js/util"
  import { PLAY_MODE } from "@/assets/js/constant"

  export default {
    name: 'player',
    components: {
      ProgressBar,
      scroll,
      MiniPlayer
    },
    setup() {
      const audioRef = ref(null)
      const songReady = ref(false)
      const currentTime = ref(0)
      const barRef = ref(null)
      let progressChanging = false

      const store = useStore()
      const { modeIcon, changeMode } = useMode()
      const { getFavoriteIcon, toggleFavorite } = useFavorite()
      const {  cdRef, cdImageRef, cdCls } = useCd()
      const { currentLyric, currentLineNum, playLyric, playingLyric, lyricScrollRef, lyricListRef, stopLyric, pureMusicLyric } = useLyric({ songReady, currentTime })
      const {
        currentShow,
        middleLStyle,
        middleRStyle,
        onMiddleTouchStart,
        onMiddleTouchMove,
        onMiddleTouchEnd
      } = useMiddleInteractive()

      const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation()

      const fullScreen = computed(() => store.state.fullScreen)
      const currentSong = computed(() => store.getters.currentSong)
      const playing = computed(() => store.state.playing)
      const currentIndex = computed(() => store.state.currentIndex)
      const playlist = computed(() => store.state.playlist)
      const playMode = computed(() => store.state.playMode)

      const playIcon = computed(() => {
        return playing.value ? 'icon-pause' : 'icon-play'
      })

      const disableCls = computed(() => {
        return songReady.value ? '' : 'disable'
      })

      const progress = computed(() => {
        return currentTime.value / currentSong.value.duration
      })

      /** 当前歌曲变更时候，设置 audio 的音乐资源 */
      watch(currentSong, (newSong) => {
        if (!newSong.id && !newSong.url) {
          return
        }
        /** 歌曲发生变化，我们需要修改歌曲缓冲 */
        songReady.value = false
        currentTime.value = 0
        const audioEle = audioRef.value

        audioEle.src = newSong.url
        audioEle.play()

        store.commit('setPlayingState', true)
      })

      /** 根据store playing，设置 audio 的播放状态 */
      watch(playing, (newPlaying) => {
        if (!songReady.value) {
          return
        }
        const audioEle = audioRef.value

        if (newPlaying) {
          playLyric()
          audioEle.play()
        } else {
          audioEle.pause()
          stopLyric()
        }
      })

      watch(fullScreen, async (newFullScreen) => {
        if (newFullScreen) {
          await nextTick()
          barRef.value.setOffset(progress.value)
        }
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

        // if (!playing.value) {
        //   store.commit('setPlayingState', true)
        // }
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

        // if (!playing.value) {
        //   store.commit('setPlayingState', true)
        // }
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

        /** 当歌词 | 歌曲 获取之后，也可以触发 */
        playLyric()
      }

      /** 当歌曲出错的时候，我们还需要可以切歌，这里也要把标识 */
      function error() {
        songReady.value = true
      }

      /** 歌曲进度改变的时候 */
      function updateTime(e) {
        if (progressChanging) return
        currentTime.value = e.target.currentTime
      }

      function onProgressChanging(progress) {
        progressChanging = true
        currentTime.value = currentSong.value.duration * progress

        /** 拖拽同步歌词 */
        playLyric()
        stopLyric()
      }

      function onProgressChanged(progress) {
        progressChanging = false
        audioRef.value.currentTime = currentSong.value.duration * progress
        playLyric()

        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }

      function onEnd() {
        currentTime.value = 0
        if (playMode.value === PLAY_MODE.loop) {
          loop()
        } else {
          next()
        }
      }

      return {
        barRef,
        audioRef,
        fullScreen,
        currentSong,
        progress,
        currentTime,
        playlist,
        disableCls,
        playIcon,
        goBack,
        togglePlay,
        pause,
        prev,
        next,
        ready,
        error,
        updateTime,
        onProgressChanging,
        onProgressChanged,
        onEnd,
        /** useMode */
        modeIcon,
        changeMode,
        /** useFavorite */
        getFavoriteIcon,
        toggleFavorite,
        /** use Cd */
        cdCls,
        cdRef,
        cdImageRef,
        /** useLyric  */
        currentLyric,
        currentLineNum,
        playingLyric,
        lyricScrollRef,
        lyricListRef,
        pureMusicLyric,

        /** use middle interactive */
        currentShow,
        middleLStyle,
        middleRStyle,
        onMiddleTouchStart,
        onMiddleTouchMove,
        onMiddleTouchEnd,
        formatTime,

        /** use animation */
        cdWrapperRef, enter, afterEnter, leave, afterLeave,
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
