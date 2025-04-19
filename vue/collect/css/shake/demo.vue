<script lang="ts" setup>
import type { ObjectDirective } from 'vue'
import './shake.css'

const handleMouseenter = (event: MouseEvent) => {
  const dom = event.target as HTMLElement
  dom.classList.add('shake')
}

const handleMouseleave = (event: MouseEvent) => {
  const dom = event.target as HTMLElement
  dom.classList.remove('shake')
}

const handleClick = (event: MouseEvent) => {
  const dom = event.target as HTMLElement
  dom.classList.remove('shake')
  const addTimer = setTimeout(() => {
    clearTimeout(addTimer)
    dom.classList.add('shake')
  }, 13)
  const removeTimer = setTimeout(() => {
    clearTimeout(removeTimer)
    dom.classList.remove('shake')
  }, 500)
}

const VShake = {
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
  <button v-shake class="btn m-10">
    click shake
  </button>
  <button v-shake:hover class="btn m-10">
    hover shake
  </button>
</template>
