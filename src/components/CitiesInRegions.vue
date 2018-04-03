<template lang="pug">
.regions-quiz
    quiz-info(:info="info")
    error-msg(:error="errorMessage")
    #map
    button(v-if="!currentQuestion", type="button", class="btn btn-success", @click="nextQuestion") Rozruch!
    .quiz-block(v-if="currentQuestion")
        h4 Województw:&nbsp;
            strong {{ currentQuestion }} / {{ questions.length }}
        .description Zaznacz na mapie miasto
            span.city {{ questions[currentQuestion - 1].title }}
        template(v-if="answer")    
            button(v-if="currentQuestion !== questions.length", type="button", class="btn btn-primary", @click="nextQuestion") Następne miasto
            button(v-else, type="button", class="btn btn-primary", @click="nextQuestion") Zakończyć
    h5.finish-block(v-if="isFinish") Twój wynik&nbsp;
        span.total {{ total }}&nbsp;  
</template>

<script>

import QuizInfo from './partial/QuizInfo.vue'
import ErrorMsg from './partial/ErrorMsg.vue'

import QuizMixin from './mixins/QuizMixin'

export default {
    data() {
        return {
            info: {
                title: 'Gra geograficzna o miastach i województwach',
                description: 'Witaj, podróżniku! Teraz dowiemy się, jak dobrze znasz położenie miast w województwach...'
            },
            map: {},
            questions: [
                {answer: 'PL-WP', title: "Poznań"},
                {answer: 'PL-KP', title: "Bydgoszcz"},
                {answer: 'PL-KP', title: "Toruń"},
                {answer: 'PL-MA', title: "Kraków"},
                {answer: 'PL-LD', title: "Łódz"},
                {answer: 'PL-DS', title: "Wrocław"},
                {answer: 'PL-LB', title: "Gorzów Wielkopolski"},
                {answer: 'PL-LB', title: "Zielona Góra"},
                {answer: 'PL-LU', title: "Lublin"},
                {answer: 'PL-MZ', title: "Warszawa"},
                {answer: 'PL-OP', title: "Opole"},
                {answer: 'PL-PD', title: "Białystok"},
                {answer: 'PL-PM', title: "Gdańsk"},
                {answer: 'PL-SL', title: "Katowice"},
                {answer: 'PL-PK', title: "Rzeszów"},
                {answer: 'PL-SK', title: "Kielce"},
                {answer: 'PL-WN', title: "Olsztyn"},
                {answer: 'PL-ZP', title: "Szczecin"}
            ],
        }
    },
    components: {
        QuizInfo, ErrorMsg
    },
    mixins: [QuizMixin],
    mounted() {
        this.initMap()
    },
    methods: {
        initMap(values = []) {
            $('#map').empty();
                $('#map').vectorMap({
                    map: 'pl_merc',
                    // regionsSelectable: true,
                    onRegionTipShow: (e, el, code) => {
                        el.remove();
                    },
                    series: {
                        regions: [{
                            scale: {
                                'no': '#e84141',
                                'yes': '#1bc21b',
                                'right': '#a1a3a6'
                            },
                            attribute: 'fill',
                            values: values
                        }]
                    },
                    onRegionClick: (e, code) => {
                        this.getAnswer(code);
                    }
                });
        },
        clear() {
            this.initMap();
        },
        getAnswer(code) {
            if (!this.answer && this.currentQuestion > 0) {
                this.answer = code;
                let rightRegion = this.questions[this.currentQuestion - 1].answer;

                let values = {};
                if (this.answer === rightRegion) {
                    values[this.answer] = 'yes';
                    this.total++;
                } else {
                    values[this.answer] = 'no';
                    values[rightRegion] = 'right';
                }
                this.initMap(values)
            } else {
                this.errorStep()
            }
        }
    }
}
</script>

<style lang="scss">

</style>


