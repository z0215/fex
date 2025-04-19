<script lang="ts" setup>
import type { ObjectDirective } from 'vue'
import './waves-out.css'

interface CustomElement extends HTMLElement {
  '@@wavesOutHandle': (e: MouseEvent) => void
}
const customKey = '@@wavesOutHandle'

const handleClick = (el: CustomElement, color = '#1890ff') => {
  const handle = () => {
    el.style.position = 'relative'
    let ripple: HTMLElement | null = el.querySelector('.waves-out')
    if (ripple) {
      ripple.classList.remove('active')
    }
    else {
      ripple = document.createElement('span')
      ripple.classList.add('waves-out')
      el.appendChild(ripple)
    }
    ripple.style.borderColor = color
    // 触发重绘
    // eslint-disable-next-line no-unused-expressions
    ripple.offsetWidth
    ripple.classList.add('active')
  }

  el[customKey] = handle

  return handle
}

const VWavesOut = {
  mounted(el, { value }) {
    el.addEventListener('click', handleClick(el, value), false)
  },
  unmounted(el) {
    el.removeEventListener('click', el[customKey], false)
    Reflect.deleteProperty(el, customKey)
  },
} as ObjectDirective<CustomElement, string>
</script>

<template>
  <button v-waves-out class="btn m-10">
    click waves-out default
  </button>
  <button v-waves-out="'red'" class="btn m-10">
    click waves-out custom
  </button>
</template>
