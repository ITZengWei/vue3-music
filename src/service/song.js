import { get } from './base'

export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', {
    mid: songs.map(song => song.mid)
  }).then((result) => {
    const map = result.map
    return songs.map((song) => {
      song.url = map[song.mid]
      return song
    }).filter((song) => {
      return song.url && song.url.indexOf('vkey') > -1
    })
  })
}

const lyricMap = {}

/** 获取歌词 */
export function getLyric(song) {
  /** 是否之前缓存了 */
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }

  const mid = song.mid

  /** 不同的页面可能存在相同的 mid，我们可以通过 map 缓存起来 */
  const lyric = lyricMap[mid]
  if (lyric) {
    return Promise.resolve(lyric)
  }

  return get('/api/getLyric', { mid })
    .then((result) => {
      const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
      return lyric
    })
}
