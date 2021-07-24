/** 洗牌函数 */
export function shuffle(source) {
  const arr = source.slice()

  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }

  return arr
}

/** 随机获取 0 - max 之间的数 */
function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1))
}

/** 交换 */
function swap(arr, i, j) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}


/** 格式化时间 */
export function formatTime(interval) {
  interval = interval | 0
  const minute = ((interval / 60 | 0) + '').padStart(2, '0')
  const second = (interval % 60 + '').padStart(2, '0')
  return `${minute}:${second}`
}
