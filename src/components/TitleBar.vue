<template>
  <nav class="title-bar">
    <ul class="menu">
      <router-link class="menu__item" tag="li" to="/" exact>
        <a class="menu__link">Home</a>
      </router-link>
      <router-link class="menu__item" tag="li" to="/bar-chart">
        <a class="menu__link">Bar Chart</a>
      </router-link>
      <router-link class="menu__item" tag="li" to="/scatterplot">
        <a class="menu__link">Scatterplot</a>
      </router-link>
      <router-link class="menu__item" tag="li" to="/heatmap">
        <a class="menu__link">Heat Map</a>
      </router-link>
      <router-link class="menu__item" tag="li" to="/force-directed">
        <a class="menu__link">Force Directed</a>
      </router-link>
      <router-link class="menu__item" tag="li" to="/map">
        <a class="menu__link">Map</a>
      </router-link>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'TitleBar',
};
</script>

<style lang="sass">
@import '~sassVars'

.title-bar
  background-color: #c44

.menu
  display: flex
  justify-content: center
  list-style: none
  margin: 0
  padding: 1rem
  position: relative
  z-index: 9

  &__item
    margin-right: 1rem

    &--active
      .menu__link
        color: white

  &__link
    color: rgba(white, .75)
    text-decoration: none
    transition: color .2s ease-in-out

.title, .subtitle
  font-weight: 400
  margin: 0

.subtitle
  font-weight: 300
</style>
