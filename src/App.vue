<template lang="pug">
#app
  ul.menu.nav.nav-pills.justify-content-center
    li.nav-item
      router-link(to="/cities", class="nav-link") Miasta
    li.nav-item
      router-link(to="/regions", class="nav-link") Województwa
    li.nav-item
      router-link(to="/cities-regions", class="nav-link") Miasta w województwach
    li.nav-item
      router-link(to="/writing", class="nav-link") Napisanie
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

.regions-quiz {
    width: 500px;
    margin: 0 auto;

    #map {
        width: 500px;
        height: 500px;
        margin-bottom: 20px;
    }

    .error {
        height: 60px;
    }

    .quiz-block {
        .description {
            .city {
                font-size: 120%;
                color: navy;
                margin-left: 10px;
            }
        }

        .answer{
            margin-bottom: 10px;
        }
    }

    .finish-block {
        margin: 10px 0;

        .total {
            color: navy;
        }
    }
}
</style>
