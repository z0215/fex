<script lang="ts" setup>
import type { ObjectDirective } from 'vue'
import './jelly.css'

const handleMouseenter = (event: MouseEvent) => {
  const dom = event.target as HTMLElement
  dom.classList.add('jelly')
}

const handleMouseleave = (event: MouseEvent) => {
  const dom = event.target as HTMLElement
  dom.classList.remove('jelly')
}

const handleClick = (event: MouseEvent) => {
  const dom = event.target as HTMLElement
  dom.classList.remove('jelly')
  const addTimer = setTimeout(() => {
    clearTimeout(addTimer)
    dom.classList.add('jelly')
  }, 13)
  const removeTimer = setTimeout(() => {
    clearTimeout(removeTimer)
    dom.classList.remove('jelly')
  }, 500)
}

const VJelly = {
  mounted(el: HTMLElement, { arg = 'click' }) {
    if (arg === 'click')
      el.addEventListener('click', handleClick, false)

    if (arg === 'hover') {
      el.addEventListener('mouseenter', handleMouseenter, false)
      el.addEventListener('mouseleave', handleMouseleave, false)
    }
  },
  unmounted(el: HTMLElement, { arg = 'click' }) {
    if (arg === 'click')
      el.removeEventListener('click', handleClick, false)

    if (arg === 'hover') {
      el.removeEventListener('mouseenter', handleMouseenter, false)
      el.removeEventListener('mouseleave', handleMouseleave, false)
    }
  },
} as ObjectDirective
</script>

<template>
  <button v-jelly class="btn m-10">
    click jelly
  </button>
  <button v-jelly:hover class="btn m-10">
    hover jelly
  </button>
</template>
