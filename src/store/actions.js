import { PLAY_MODE } from "../assets/js/constant"
import { shuffle } from "../assets/js/util"

/** 选择播放 */
export function selectPlay({ commit, state }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlaylist', list)
  // 设置播放索引
  commit('setCurrentIndex', index)
}

/** 随机播放 */
export function randomPlay({ commit }, { list }) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  // 进行洗牌
  commit('setPlaylist', shuffle(list))
}

/** 改变播放类型 */
export function changeMode({ state, commit, getters }, mode) {
  /** 在切换随机播放的时候，由于我们会打乱播放列表，会造成切歌现象 */
  const currentSongId = getters.currentSong.id
  if (mode === PLAY_MODE.random) {
    commit('setPlaylist', shuffle(state.sequenceList))
  } else if (mode === PLAY_MODE.sequence) {
    commit('setPlaylist', state.sequenceList)
  }
  /** 正在播放的歌曲，在改变后的歌曲中里面的索引 */
  const index = state.playlist.findIndex(song => song.id === currentSongId)

  commit('setPlayMode', mode)
  commit('setCurrentIndex', index)
}
