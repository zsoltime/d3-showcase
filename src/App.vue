<template>
  <div id="app">
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
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
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

.title-bar
  background-color: #c44

.menu
  display: flex
  justify-content: center
  list-style: none
  margin: 0
  padding: 1rem

  &__item
    margin-right: 1rem

    &--active
      .menu__link
        color: white

  &__link
    color: rgba(white, .75)
    text-decoration: none
    transition: color .2s ease-in-out
</style>
