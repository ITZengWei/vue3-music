import {PLAY_MODEL} from "../assets/js/constant";

const state = {
  /** 顺序播放列表 */
  sequenceList: [],

  /** 真实播放列表 */
  playlist: [],

  /** 是否正在播放 */
  playing: false,

  /** 播放模式: (顺序、循环、随机) */
  playMode: PLAY_MODEL.sequence,

  /** 当前播放索引 */
  currentIndex: 0,

  /** 播放器状态 */
  fullScreen: false
}

export default state
