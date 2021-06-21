import { get } from './base'

export function getSingerList() {
  return get('/api/getSingerList')
}

export function getSingerDetail() {
  return get('/api/getSingerDetail')
}
