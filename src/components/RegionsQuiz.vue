<template lang="pug">
.regions-quiz
    quiz-info(:info="info")
    error-msg(:error="errorMessage")
    #map
    button(v-if="!currentQuestion", type="button", class="btn btn-success", @click="nextQuestion") Rozruch!
    .quiz-block(v-if="currentQuestion")
        h4 Województw:&nbsp;
            strong {{ currentQuestion }} / {{ regions.length }}
        .description Zaznacz na mapie województo
            span.city {{ regions[currentQuestion - 1].title }}
        template(v-if="selectedRegion")    
            button(v-if="currentQuestion !== regions.length", type="button", class="btn btn-primary", @click="nextQuestion") Następne województo
            button(v-else, type="button", class="btn btn-primary", @click="nextQuestion") Zakończyć
    h5.finish-block(v-if="isFinish") Twój wynik&nbsp;
        span.total {{ total }}&nbsp;
</template>

<script>    

import QuizInfo from './partial/QuizInfo.vue'
import ErrorMsg from './partial/ErrorMsg.vue'

export default {
    data() {
        return {
            info: {
                title: 'Gra geograficzna o województwach',
                description: 'Witaj, podróżniku! Teraz dowiemy się, jak dobrze znasz położenie województw w Polsce...'
            },
            errorMessage: '',
            total: 0,
            currentQuestion: 0,
            map: {},
            regions: [
                {'code': 'PL-WP', 'title': "Wielkopolskie"},
                {'code': 'PL-KP', 'title': "Kujawsko-Pomorskie"},
                {'code': 'PL-MA', 'title': "Małopolskie"},
                {'code': 'PL-LD', 'title': "Łódzkie"},
                {'code': 'PL-DS', 'title': "Dolnośląskie"},
                {'code': 'PL-LU', 'title': "Lubelskie"},
                {'code': 'PL-LB', 'title': "Lubuskie"},
                {'code': 'PL-MZ', 'title': "Mazowieckie"},
                {'code': 'PL-OP', 'title': "Opolskie"},
                {'code': 'PL-PD', 'title': "Podlaskie"},
                {'code': 'PL-PM', 'title': "Pomorskie"},
                {'code': 'PL-SL', 'title': "Śląskie"},
                {'code': 'PL-PK', 'title': "Podkarpackie"},
                {'code': 'PL-SK', 'title': "Świętokrzyskie"},
                {'code': 'PL-WN', 'title': "Warmińsko-mazurskie"},
                {'code': 'PL-ZP', 'title': "Zachodniopomorskie"}
            ],
            isFinish: false,
            selectedRegion: ''
        }
    },
    components: {
        QuizInfo, ErrorMsg
    },
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
        nextQuestion() {
            if (this.currentQuestion === this.regions.length) {
                this.currentQuestion = 0;
                this.isFinish = true;
                return;
            }

            if (this.currentQuestion === 0) {
                this.total = 0;
                this.isFinish = false;
            }

            this.errorMessage = '';
            this.isFinish = false;

            if (this.currentQuestion > 0 && this.selectedRegion === '') {
                this.errorMessage = 'Zaznacz województwo na mapie!'
                return
            }

            if (this.selectedRegion !== '') {
                this.initMap();
            }
            this.selectedRegion = '';

            this.currentQuestion++;
        },
        getAnswer(code) {
            if (this.selectedRegion === '' && this.currentQuestion > 0) {
                this.selectedRegion = code;
                let rightRegion = this.regions[this.currentQuestion - 1];

                let values = {};
                if (this.selectedRegion === rightRegion.code) {
                    values[this.selectedRegion] = 'yes';
                    this.total++;
                } else {
                    values[this.selectedRegion] = 'no';
                    values[rightRegion.code] = 'right';
                }
                this.initMap(values)
            } else {
                if (this.selectedRegion !== '') {
                    this.errorMessage = 'Już wykonałeś ruch!';
                } else {
                    this.errorMessage = 'Rozpocznij grę!';
                }
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

