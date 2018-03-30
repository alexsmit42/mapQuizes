<template lang="pug">
#app
  ul.menu.nav.nav-pills.justify-content-center
    li.nav-item
      router-link(to="/cities", class="nav-link") Miasta
    li.nav-item
      router-link(to="/regions", class="nav-link") Województwa
  router-view
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  .menu {
    margin-bottom: 20px;
  }
}

h1, h2 {
  font-weight: normal;
}
</style>
