<template lang="pug">
.regions-quiz
    quiz-info(:info="info")
    error-msg(:error="errorMessage")
    #map
    button(v-if="!currentQuestion", type="button", class="btn btn-success", @click="nextQuestion") Rozruch!
    .quiz-block(v-if="currentQuestion")
        h4 Województw:&nbsp;
            strong {{ currentQuestion }} / {{ questions.length }}
        .description Zaznacz na mapie województo
            span.city {{ questions[currentQuestion - 1].title }}
        template(v-if="answer")    
            button(v-if="currentQuestion !== questions.length", type="button", class="btn btn-primary", @click="nextQuestion") Następne województo
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
                title: 'Gra geograficzna o województwach',
                description: 'Witaj, podróżniku! Teraz dowiemy się, jak dobrze znasz położenie województw w Polsce...'
            },
            map: {},
            questions: [
                {answer: 'PL-WP', title: "Wielkopolskie"},
                {answer: 'PL-KP', title: "Kujawsko-Pomorskie"},
                {answer: 'PL-MA', title: "Małopolskie"},
                {answer: 'PL-LD', title: "Łódzkie"},
                {answer: 'PL-DS', title: "Dolnośląskie"},
                {answer: 'PL-LU', title: "Lubelskie"},
                {answer: 'PL-LB', title: "Lubuskie"},
                {answer: 'PL-MZ', title: "Mazowieckie"},
                {answer: 'PL-OP', title: "Opolskie"},
                {answer: 'PL-PD', title: "Podlaskie"},
                {answer: 'PL-PM', title: "Pomorskie"},
                {answer: 'PL-SL', title: "Śląskie"},
                {answer: 'PL-PK', title: "Podkarpackie"},
                {answer: 'PL-SK', title: "Świętokrzyskie"},
                {answer: 'PL-WN', title: "Warmińsko-mazurskie"},
                {answer: 'PL-ZP', title: "Zachodniopomorskie"}
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

