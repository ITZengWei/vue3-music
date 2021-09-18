import { get } from './base'

export function getRecommend() {
  return get('/api/getRecommend')
}

/** 获取专辑 */
export function getAlbum(album) {
  return get('/api/getAlbum', {
    id: album.id
  })
}
