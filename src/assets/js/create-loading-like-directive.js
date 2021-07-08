import { createApp } from 'vue'
import {addClass, removeClass} from "../../assets/js/dom";

export default function createLoadingLikeDirective(Comp) {

  function append(el) {
    const name = Comp.name

    const style = getComputedStyle(el)
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, 'g-relative')
    }
    el.appendChild(el[name]?.instance.$el)
  }

  function remove(el) {
    const name = Comp.name

    removeClass(el, 'g-relative')
    el.removeChild(el[name]?.instance.$el)
  }

  return {
    mounted(el, binding) {
      const app = createApp(Comp)
      const instance = app.mount(document.createElement('div'))

      const name = Comp.name

      if (!el[name]) {
        el[name] = {}
      }

      el[name].instance = instance

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
}
