import { PLAY_MODE, FAVORITE_KEY } from "../assets/js/constant"
import { load } from "@/assets/js/array-store"

const state = {
  /** 顺序播放列表 */
  sequenceList: [],

  /** 真实播放列表 */
  playlist: [],

  /** 是否正在播放 */
  playing: false,

  /** 播放模式: (顺序、循环、随机) */
  playMode: PLAY_MODE.sequence,

  /** 当前播放索引 */
  currentIndex: 0,

  /** 播放器状态 */
  fullScreen: false,

  /** 收藏列表 */
  favoriteList: load(FAVORITE_KEY)
}

export default state
