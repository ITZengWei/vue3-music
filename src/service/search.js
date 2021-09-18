import { get } from './base'

/** 获取热门推荐关键字 */
export function getHotKeys() {
  return get('/api/getHotKeys')
}


/** 搜索 */
export function search(query, page, showSinger) {
  return get('/api/search', {
    query,
    page,
    showSinger
  })
}
