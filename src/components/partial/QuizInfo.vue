<template lang="pug">
.quiz-info
    h5 {{ info.title }}
    .description {{ info.description }}
</template>

<script>
export default {
    name: 'quiz-info',
    props: ['info']
}
</script>

<style lang="scss">

</style>


