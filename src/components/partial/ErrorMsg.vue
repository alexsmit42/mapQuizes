<template lang="pug">
.error
    .error-message(v-show="error", class="alert alert-danger" role="alert") {{ error }}  
</template>

<script>
export default {
    name: 'error-msg',
    props: ['error']
}
</script>

<style lang="scss">

</style>

