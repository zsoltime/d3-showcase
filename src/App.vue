<template>
  <div id="app">
    <TitleBar />
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import TitleBar from './components/TitleBar';

export default {
  name: 'app',
  components: {
    TitleBar,
  },
};
</script>

<style lang="sass">
body
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  color: #2c3e50
  font-family: Lato, 'Helvetica Neue', Arial, sans-serif
  margin: 0
  text-align: center

.tooltip, text
  font-size: .625rem

.fade-enter-active, .fade-leave-active
  transition: opacity .5s

.fade-enter, .fade-leave-to
  opacity: 0
</style>
