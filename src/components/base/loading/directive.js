import { createApp } from 'vue'
import Loading from './loading.vue'
import {addClass, removeClass} from "../../../assets/js/dom";

const loadingDirective = {
  mounted(el, binding) {
    const app = createApp(Loading)
    const instance = app.mount(document.createElement('div'))
    el.instance = instance

    /** 动态设置提示信息 */
    if (binding.arg !== undefined) {
      instance.setTitle(binding.arg)
    }

    if (binding.value) {
      append(el)
    }
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}


function append(el) {
  const style = getComputedStyle(el)
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    addClass(el, 'g-relative')
  }
  el.appendChild(el.instance.$el)
}

function remove(el) {
  removeClass(el, 'g-relative')
  el.removeChild(el.instance.$el)
}

export default loadingDirective
