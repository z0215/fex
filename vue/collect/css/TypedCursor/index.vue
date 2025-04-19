<script>
export default {
  name: 'VTypedCursor',
  props: {
    text: {
      type: String,
      default: '',
    },
    time: {
      type: Number,
      default: 200,
    },
    mode: {
      /**
       * 目前支持两种模式：
       * fade 淡入淡出效果
       * cursor 光标效果
       */
      type: String,
      default: 'cursor',
    },
  },
  data() {
    return {
      iText: '',
      cursorClass: '',
    }
  },
  mounted() {
    this.animation()
  },
  methods: {
    animation() {
      let index = 0
      const len = this.text.length
      const timer = setInterval(() => {
        if (index === len) {
          clearInterval(timer)
          if (this.mode === 'cursor')
            this.cursorClass = 'flicker'
        }
        this.iText = this.text.slice(0, index++)
      }, this.time)
    },
    isShow(value) {
      return value === this.mode
    },
  },
}
</script>

<template>
  <div class="v-typed-cursor">
    <span v-if="isShow('cursor')" class="cursor" :class="cursorClass">
      {{ iText }}
    </span>
    <transition-group v-if="isShow('fade')" name="fade" tag="div" class="fade">
      <span v-for="(item, index) in iText" :key="index + 1">{{ item }}</span>
    </transition-group>
  </div>
</template>

<style lang="scss" scoped>
.v-typed-cursor {
  .cursor {
    font-size: 30px;
    font-weight: bold;
    &::after {
      margin-left: 5px;
      content: '|';
    }
    &.flicker::after {
      animation: flicker 1s infinite steps(1);
    }
  }
  .fade {
    text-align: center;
    span {
      font-size: 30px;
      font-weight: bold;
    }
  }
}

// 光标闪烁动画
@keyframes flicker {
  0%,
  100% {
    color: #000;
  }
  50% {
    color: transparent;
  }
}

// 淡入淡出
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
