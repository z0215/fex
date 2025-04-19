<script lang="ts" setup>
import type { ObjectDirective } from 'vue'
import './waves-in.css'
interface Options {
  type: 'hit' | 'center'
  color: string
}
interface CustomElement extends HTMLElement {
  '@@wavesInHandle': (e: MouseEvent) => void
}
const customKey = '@@wavesInHandle'

const handleClick = (el: CustomElement, options: Partial<Options> = {}) => {
  const handle = ({ clientY, clientX }: MouseEvent) => {
    const defaultOptions: Options = {
      // hit 点击位置扩散 center中心点扩展
      type: 'hit',
      // 波纹颜色
      color: 'rgba(0, 0, 0, 0.15)',
    }
    const { type, color } = { ...defaultOptions, ...options }

    el.style.cssText = 'position:relative;overflow:hidden'
    let ripple: HTMLElement | null = el.querySelector('.waves-in')
    if (ripple) {
      ripple.classList.remove('active')
    }
    else {
      ripple = document.createElement('span')
      ripple.classList.add('waves-in')
      el.appendChild(ripple)
    }
    const { width, height, left, top } = el.getBoundingClientRect()
    const eleSize = Math.max(width, height)
    const body = document.documentElement || document.body
    const map = {
      center: {
        top: (height - eleSize) / 2,
        left: (width - eleSize) / 2,
      },
      hit: {
        top: clientY - top - eleSize / 2 - body.scrollTop,
        left: clientX - left - eleSize / 2 - body.scrollLeft,
      },
    }
    const topStr = `top:${map[type].top}px;`
    const leftStr = `left:${map[type].left}px;`
    const bgStr = `background-color:${color};`
    const heightStr = `height:${eleSize}px;`
    const widthStr = `width:${eleSize}px;`
    ripple.style.cssText = heightStr.concat(widthStr, topStr, leftStr, bgStr)
    ripple.classList.add('active')
  }

  el[customKey] = handle

  return handle
}

const VWavesIn = {
  mounted(el, { value }) {
    el.addEventListener('click', handleClick(el, value), false)
  },
  unmounted(el) {
    el.removeEventListener('click', el[customKey], false)
    Reflect.deleteProperty(el, customKey)
  },
} as ObjectDirective<CustomElement, Options>
</script>

<template>
  <button v-waves-in class="btn m-10">
    click waves-in default
  </button>
  <button v-waves-in="{ type: 'center', color: 'red' }" class="btn m-10">
    click waves-in custom
  </button>
</template>
