import { PLAY_MODEL } from "../assets/js/constant"
import { shuffle } from "../assets/js/util"

/** 选择播放 */
export function selectPlay({ commit, state }, { list, index }) {
  commit('setPlayMode', PLAY_MODEL.sequence)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlaylist', list)
  // 设置播放索引
  commit('setCurrentIndex', index)
}

/** 随机播放 */
export function randomPlay({ commit }, { list }) {
  commit('setPlayMode', PLAY_MODEL.random)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  // 进行洗牌
  commit('setPlaylist', shuffle(list))
}
